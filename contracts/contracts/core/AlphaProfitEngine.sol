// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IAlphaSwapAdapter} from "../interfaces/IAlphaSwapAdapter.sol";

/// @notice Converts harvested reward tokens into the configured USDT settlement token.
/// @dev The MVP intentionally uses an allowlisted adapter instead of arbitrary executor calldata.
contract AlphaProfitEngine is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;
    mapping(address => bool) public approvedAdapters;

    event AdapterApprovalChanged(address indexed adapter, bool approved);
    event ProfitRealized(
        address indexed caller,
        address indexed rewardToken,
        address indexed adapter,
        uint256 amountIn,
        uint256 usdtOut,
        address recipient
    );

    error AdapterNotApproved();
    error InvalidAddress();
    error InsufficientOutput(uint256 received, uint256 minimum);

    constructor(address usdt_) {
        if (usdt_ == address(0)) revert InvalidAddress();
        usdt = IERC20(usdt_);
    }

    function setAdapter(address adapter, bool approved) external onlyOwner {
        if (adapter == address(0)) revert InvalidAddress();
        approvedAdapters[adapter] = approved;
        emit AdapterApprovalChanged(adapter, approved);
    }

    function realize(
        address rewardToken,
        uint256 amountIn,
        address adapter,
        uint256 minUsdtOut,
        address recipient
    ) external nonReentrant returns (uint256 usdtOut) {
        if (!approvedAdapters[adapter]) revert AdapterNotApproved();
        if (rewardToken == address(0) || recipient == address(0)) revert InvalidAddress();

        IERC20 input = IERC20(rewardToken);
        input.safeTransferFrom(msg.sender, address(this), amountIn);
        input.safeApprove(adapter, 0);
        input.safeApprove(adapter, amountIn);

        uint256 beforeBalance = usdt.balanceOf(recipient);
        IAlphaSwapAdapter(adapter).swap(rewardToken, address(usdt), amountIn, minUsdtOut, recipient);
        uint256 afterBalance = usdt.balanceOf(recipient);
        usdtOut = afterBalance - beforeBalance;

        if (usdtOut < minUsdtOut) revert InsufficientOutput(usdtOut, minUsdtOut);
        input.safeApprove(adapter, 0);

        emit ProfitRealized(msg.sender, rewardToken, adapter, amountIn, usdtOut, recipient);
    }
}
