// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAlphaSwapAdapter {
    /// @dev Caller must transfer/approve tokenIn according to the adapter implementation.
    function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, address recipient)
        external
        returns (uint256 amountOut);
}
