# Architecture

## 1. Why AlphaBank is separate from ordinary staking

Ordinary staking usually optimizes token quantity. AlphaBank separates two ledgers:

- **principal ledger** — the deposited/staked asset and its market value;
- **profit ledger** — harvested rewards that have actually been converted into USDT.

A position can therefore show positive realized USDT profit and still show a negative overall P&L if the deposited token falls enough. The product should display both.

## 2. Contract components

### AlphaBankVault

The vault issues transferable shares against one deposit asset. It deploys idle principal into an allowlisted strategy, can pull principal back for withdrawals, and accounts for USDT distributed by a successful harvest.

The MVP uses share-based accounting similar to common vault patterns but deliberately avoids claiming ERC-4626 compliance until all edge cases are tested. Fee-on-transfer and rebasing assets are out of scope.

### IAlphaStrategy

A narrow adapter between AlphaBank and an external staking venue. A strategy must expose:

- its underlying asset;
- total managed principal;
- deposit and withdrawal operations;
- one reward token for the MVP;
- a harvest operation that transfers harvested rewards back to the vault.

Later versions can support multiple reward tokens through a typed array interface.

### AlphaProfitEngine

Receives harvested reward tokens, sends them through a specifically allowlisted swap adapter, and verifies that the requested USDT amount was actually received. The vault then distributes that realized USDT across share holders through a cumulative reward-per-share index.

This module is intentionally not an unrestricted router. Arbitrary calldata/executor patterns are excluded from the MVP because they greatly expand the security surface.

### USDT Bank accounting

The vault maintains a cumulative `accUsdtPerShare` index. Each account has a reward debt and an accrued claimable amount. Before and after share balance changes, the vault checkpoints this accounting so realized USDT belongs to the holders who owned shares when the harvest occurred.

## 3. Off-chain components

### API

The API is the reporting layer. It should eventually combine verified on-chain reads, token prices, strategy metadata, and historical snapshots. The MVP defines a service boundary that can later consume Boofy address-book data without pretending existing Beefy addresses are AlphaBank deployments.

### App

The dashboard is intentionally P&L-first. Instead of making APY the hero metric, the product highlights realized USDT, current principal value, net P&L and drawdown.

### Python analytics

The Python module is a research layer, not an autonomous trading system. It calculates drawdown and recommends a harvest-to-USDT versus reinvest split under a transparent policy. Any real automated trading strategy should be independently backtested and reviewed before integration.

## 4. Future modules

- multiple strategies per vault;
- strategy allocator and caps;
- oracle sanity checks;
- DEX quote aggregation;
- keeper automation;
- emergency unwind;
- reinvestment policies;
- optional hedging module;
- per-chain deployment registry;
- historical P&L database;
- governance and timelock controls.
