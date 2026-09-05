// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IAlphaStrategy} from "../interfaces/IAlphaStrategy.sol";
import {AlphaProfitEngine} from "./AlphaProfitEngine.sol";

/// @notice Single-asset staking vault with separate USDT profit accounting.
/// @dev MVP contract. Fee-on-transfer/rebasing assets are explicitly unsupported.
contract AlphaBankVault is ERC20, Ownable2Step, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private constant ACC_PRECISION = 1e27;

    IERC20 public immutable asset;
    IERC20 public immutable usdt;
    IAlphaStrategy public strategy;
    AlphaProfitEngine public profitEngine;
    address public swapAdapter;

    uint256 public accUsdtPerShare;
    uint256 public totalUsdtRealized;
    mapping(address => uint256) public usdtRewardDebt;
    mapping(address => uint256) public accruedUsdt;

    event Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
    event Withdrawn(address indexed caller, address indexed receiver, uint256 assets, uint256 shares);
    event Harvested(uint256 rewardAmount, uint256 usdtRealized, uint256 accUsdtPerShare);
    event UsdtClaimed(address indexed account, address indexed receiver, uint256 amount);
    event StrategyUpdated(address indexed oldStrategy, address indexed newStrategy);
    event ProfitEngineUpdated(address indexed oldEngine, address indexed newEngine);
    event SwapAdapterUpdated(address indexed oldAdapter, address indexed newAdapter);

    error InvalidAddress();
    error IncompatibleStrategy();
    error ZeroAmount();
    error InsufficientAssets();
    error NoShares();

    constructor(
        address asset_,
        address usdt_,
        address strategy_,
        address profitEngine_,
        address swapAdapter_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        if (asset_ == address(0) || usdt_ == address(0) || strategy_ == address(0) || profitEngine_ == address(0)) {
            revert InvalidAddress();
        }
        asset = IERC20(asset_);
        usdt = IERC20(usdt_);
        strategy = IAlphaStrategy(strategy_);
        profitEngine = AlphaProfitEngine(profitEngine_);
        swapAdapter = swapAdapter_;
        if (strategy.asset() != asset_) revert IncompatibleStrategy();
    }

    function totalManagedAssets() public view returns (uint256) {
        return asset.balanceOf(address(this)) + strategy.totalManagedAssets();
    }

    function previewDeposit(uint256 assets) public view returns (uint256 shares) {
        uint256 supply = totalSupply();
        uint256 managed = totalManagedAssets();
        return supply == 0 || managed == 0 ? assets : (assets * supply) / managed;
    }

    function previewWithdraw(uint256 assets) public view returns (uint256 shares) {
        uint256 supply = totalSupply();
        uint256 managed = totalManagedAssets();
        if (supply == 0 || managed == 0) return assets;
        shares = (assets * supply + managed - 1) / managed;
    }

    function deposit(uint256 assets, address receiver) external nonReentrant whenNotPaused returns (uint256 shares) {
        if (assets == 0) revert ZeroAmount();
        if (receiver == address(0)) revert InvalidAddress();
        shares = previewDeposit(assets);
        if (shares == 0) revert NoShares();

        asset.safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);
        _deployIdle();
        emit Deposited(msg.sender, receiver, assets, shares);
    }

    function withdraw(uint256 assets, address receiver) external nonReentrant returns (uint256 shares) {
        if (assets == 0) revert ZeroAmount();
        if (receiver == address(0)) revert InvalidAddress();
        if (assets > totalManagedAssets()) revert InsufficientAssets();

        shares = previewWithdraw(assets);
        _burn(msg.sender, shares);

        uint256 idle = asset.balanceOf(address(this));
        if (idle < assets) {
            strategy.withdraw(assets - idle, address(this));
        }
        asset.safeTransfer(receiver, assets);
        emit Withdrawn(msg.sender, receiver, assets, shares);
    }

    /// @notice Harvest reward tokens from the strategy and convert them to USDT.
    /// @dev `minUsdtOut` must come from a trusted off-chain/on-chain quote policy.
    function harvest(uint256 minUsdtOut) external nonReentrant whenNotPaused returns (uint256 usdtOut) {
        uint256 rewardAmount = strategy.harvest(address(this));
        if (rewardAmount == 0) return 0;

        address reward = strategy.rewardToken();
        IERC20(reward).safeApprove(address(profitEngine), 0);
        IERC20(reward).safeApprove(address(profitEngine), rewardAmount);
        usdtOut = profitEngine.realize(reward, rewardAmount, swapAdapter, minUsdtOut, address(this));
        IERC20(reward).safeApprove(address(profitEngine), 0);

        uint256 supply = totalSupply();
        if (supply == 0) revert NoShares();
        totalUsdtRealized += usdtOut;
        accUsdtPerShare += (usdtOut * ACC_PRECISION) / supply;

        emit Harvested(rewardAmount, usdtOut, accUsdtPerShare);
    }

    function claimableUsdt(address account) public view returns (uint256) {
        uint256 accumulated = (balanceOf(account) * accUsdtPerShare) / ACC_PRECISION;
        uint256 pending = accumulated > usdtRewardDebt[account] ? accumulated - usdtRewardDebt[account] : 0;
        return accruedUsdt[account] + pending;
    }

    function claimUsdt(address receiver) external nonReentrant returns (uint256 amount) {
        if (receiver == address(0)) revert InvalidAddress();
        _checkpoint(msg.sender);
        amount = accruedUsdt[msg.sender];
        accruedUsdt[msg.sender] = 0;
        usdt.safeTransfer(receiver, amount);
        emit UsdtClaimed(msg.sender, receiver, amount);
    }

    function setStrategy(address newStrategy) external onlyOwner {
        if (newStrategy == address(0)) revert InvalidAddress();
        IAlphaStrategy candidate = IAlphaStrategy(newStrategy);
        if (candidate.asset() != address(asset)) revert IncompatibleStrategy();
        if (strategy.totalManagedAssets() != 0) revert InsufficientAssets();
        address old = address(strategy);
        strategy = candidate;
        emit StrategyUpdated(old, newStrategy);
        _deployIdle();
    }

    function setProfitEngine(address newEngine) external onlyOwner {
        if (newEngine == address(0)) revert InvalidAddress();
        address old = address(profitEngine);
        profitEngine = AlphaProfitEngine(newEngine);
        emit ProfitEngineUpdated(old, newEngine);
    }

    function setSwapAdapter(address newAdapter) external onlyOwner {
        if (newAdapter == address(0)) revert InvalidAddress();
        address old = swapAdapter;
        swapAdapter = newAdapter;
        emit SwapAdapterUpdated(old, newAdapter);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _deployIdle() internal {
        uint256 amount = asset.balanceOf(address(this));
        if (amount == 0) return;
        asset.safeApprove(address(strategy), 0);
        asset.safeApprove(address(strategy), amount);
        strategy.deposit(amount);
        asset.safeApprove(address(strategy), 0);
    }

    function _checkpoint(address account) internal {
        if (account == address(0)) return;
        uint256 accumulated = (balanceOf(account) * accUsdtPerShare) / ACC_PRECISION;
        uint256 debt = usdtRewardDebt[account];
        if (accumulated > debt) accruedUsdt[account] += accumulated - debt;
        usdtRewardDebt[account] = accumulated;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0)) _checkpoint(from);
        if (to != address(0) && to != from) _checkpoint(to);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override {
        super._afterTokenTransfer(from, to, amount);
        if (from != address(0)) usdtRewardDebt[from] = (balanceOf(from) * accUsdtPerShare) / ACC_PRECISION;
        if (to != address(0) && to != from) usdtRewardDebt[to] = (balanceOf(to) * accUsdtPerShare) / ACC_PRECISION;
    }
}
