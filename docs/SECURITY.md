# Security Model

This repository is an MVP and is not approved for production funds.

## Trust assumptions

- the owner/admin can set strategy and profit-engine components;
- only reviewed strategies and swap adapters should be allowlisted;
- the chosen USDT token must be the verified deployment for the target chain;
- oracle/pricing data used by the API is informational until on-chain validation is added;
- keepers must not receive custody permissions beyond the exact harvest functions they require.

## Main risk categories

1. **Strategy risk** — staking contracts can be exploited, paused, migrated, or change reward behavior.
2. **Token price risk** — realized staking yield does not guarantee that principal value is protected.
3. **Swap risk** — slippage, MEV, bad routing or a compromised adapter can reduce realized proceeds.
4. **Stablecoin risk** — USDT itself has issuer, liquidity, chain/bridge and depeg risks.
5. **Accounting risk** — share transfers around harvests must not allow reward theft or double claims.
6. **Admin risk** — owner powers should move to a multisig/timelock before production.

## Production gate

Before any mainnet launch with user funds:

- complete unit, fuzz and invariant tests;
- run fork tests against the exact target-chain integrations;
- deploy to a testnet and conduct end-to-end testing;
- perform independent internal code review;
- commission an external smart-contract security audit;
- cap early TVL and enable emergency pause/unwind controls;
- complete legal/regulatory review for the jurisdictions in which the service will be offered.
