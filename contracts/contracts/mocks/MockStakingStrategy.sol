// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IAlphaStrategy} from "../interfaces/IAlphaStrategy.sol";
import {MockERC20} from "./MockERC20.sol";

contract MockStakingStrategy is IAlphaStrategy {
    using SafeERC20 for IERC20;
    address public immutable vault;
    address public immutable override asset;
    address public immutable override rewardToken;
    uint256 public nextReward;

    modifier onlyVault() { require(msg.sender == vault, "vault only"); _; }

    constructor(address vault_, address asset_, address reward_) {
        vault = vault_;
        asset = asset_;
        rewardToken = reward_;
    }

    function totalManagedAssets() external view override returns (uint256) {
        return IERC20(asset).balanceOf(address(this));
    }

    function setNextReward(uint256 amount) external { nextReward = amount; }

    function deposit(uint256 amount) external override onlyVault {
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount, address recipient) external override onlyVault returns (uint256) {
        IERC20(asset).safeTransfer(recipient, amount);
        return amount;
    }

    function harvest(address recipient) external override onlyVault returns (uint256 rewardAmount) {
        rewardAmount = nextReward;
        nextReward = 0;
        if (rewardAmount != 0) MockERC20(rewardToken).mint(recipient, rewardAmount);
    }
}
