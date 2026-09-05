// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAlphaStrategy {
    function asset() external view returns (address);
    function rewardToken() external view returns (address);
    function totalManagedAssets() external view returns (uint256);
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount, address recipient) external returns (uint256 withdrawn);
    function harvest(address recipient) external returns (uint256 rewardAmount);
}
