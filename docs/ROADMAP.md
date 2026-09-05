# MVP Roadmap

## Phase 0 — Foundation (current)
- [x] Define AlphaBank principal/profit separation.
- [x] Create vault/strategy/profit-engine interfaces.
- [x] Add USDT profit-per-share accounting.
- [x] Add TypeScript API and React dashboard skeleton.
- [x] Add Python risk-policy sandbox.
- [ ] Compile and run contract tests after dependencies are installed.

## Phase 1 — Single-token testnet MVP
- [ ] Select one target chain.
- [ ] Select one staking asset and one real staking protocol.
- [ ] Implement the production strategy adapter.
- [ ] Select and integrate a production DEX adapter.
- [ ] Add verified USDT address to deployment config.
- [ ] Add keeper/harvester service.
- [ ] Feed verified price data to API.

## Phase 2 — Risk and reporting
- [ ] Historical portfolio snapshots.
- [ ] Entry-price accounting and realized/unrealized P&L.
- [ ] Drawdown alerts and harvest policy simulation.
- [ ] Slippage/quote checks.
- [ ] Strategy caps and emergency unwind.

## Phase 3 — Audit and controlled launch
- [ ] Fuzz/invariant and fork tests.
- [ ] Multisig + timelock administration.
- [ ] Independent audit.
- [ ] Restricted/capped mainnet beta.

## Phase 4 — Multi-token AlphaBank
- [ ] Strategy registry.
- [ ] Multiple reward tokens.
- [ ] Multi-chain deployment registry.
- [ ] Optional reinvest and hedging modules.
