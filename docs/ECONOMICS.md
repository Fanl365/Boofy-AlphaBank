# Economics and P&L Model

AlphaBank should never present staking APY as equivalent to user profit.

For a position, define:

- `entryValue`: USDT value of deposited principal at entry;
- `currentPrincipalValue`: current USDT value of the remaining principal;
- `realizedUsdt`: cumulative USDT generated from harvested rewards;
- `claimedUsdt`: USDT already withdrawn by the user;
- `claimableUsdt`: USDT currently available to claim.

A simple user-facing net P&L is:

```text
netPnL = currentPrincipalValue + claimedUsdt + claimableUsdt - entryValue
```

A useful realized-yield metric is:

```text
realizedYield = (claimedUsdt + claimableUsdt) / entryValue
```

This is intentionally different from total return because it does not disguise principal depreciation.

## Harvest policy

The MVP contract converts harvested reward tokens to USDT. A later policy engine may divide harvest proceeds between:

- stablecoin realization;
- compounding/reinvestment;
- reserve/risk buffer;
- protocol fees, if a transparent fee model is introduced.

No fee is encoded in the initial MVP. A fee model should not be added until business rules are explicitly approved.
