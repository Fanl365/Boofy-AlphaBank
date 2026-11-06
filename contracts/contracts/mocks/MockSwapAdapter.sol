// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IAlphaSwapAdapter} from "../interfaces/IAlphaSwapAdapter.sol";

contract MockSwapAdapter is IAlphaSwapAdapter {
    using SafeERC20 for IERC20;
    uint256 public rateNumerator = 1;
    uint256 public rateDenominator = 1;

    function setRate(uint256 numerator, uint256 denominator) external {
        require(denominator != 0, "zero denominator");
        rateNumerator = numerator;
        rateDenominator = denominator;
    }

    function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, address recipient)
        external
        override
        returns (uint256 amountOut)
    {
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        amountOut = amountIn * rateNumerator / rateDenominator;
        require(amountOut >= minAmountOut, "slippage");
        IERC20(tokenOut).safeTransfer(recipient, amountOut);
    }
}
