# Boofy AlphaBank

**Staking · Realized USDT Profit · Transparent P&L · AI-Assisted Risk
Intelligence**

Boofy AlphaBank is a DeFi project being developed by the Boofy team. Its
goal is to go beyond simple staking APY and build a system that can
combine staking, reward harvesting, profit realization in USDT,
portfolio P&L, strategy management, and AI-assisted risk analysis.

## Why AlphaBank?

Traditional staking platforms usually focus on how many tokens a user
earns and the advertised APY.

But earning more tokens does not always mean making a real profit. If
the underlying token price falls significantly, staking rewards may not
compensate for the loss in principal value.

AlphaBank is being designed around a different idea:

> **Measure not only how much was earned, but how much value was
> actually realized and preserved.**

The intended AlphaBank flow is:

``` text
Token Deposit
      ↓
Staking / DeFi Strategy
      ↓
Reward Harvest
      ↓
Alpha Strategy & Risk Analysis
      ↓
USDT Profit Realization
      ↓
USDT Bank
      ↓
Claim / Reinvest
```

This allows AlphaBank to distinguish between **principal value, staking
rewards, realized USDT profit, and actual portfolio P&L**.

AI Intelligence is planned to help analyze market conditions, strategy
performance, risk, drawdowns, and profit-realization opportunities. AI
is intended as an analysis and recommendation layer---not as an
unrestricted controller of user funds.

> \[!IMPORTANT\] \## SAFE DEMO --- NO REAL ASSETS ARE USED
>
> **The current version of Boofy AlphaBank is an MVP / developer
> demonstration.**
>
> The wallet buttons and MetaMask-style experience in this demo are
> simulated. They are included only to demonstrate the intended user
> experience.
>
> **This demo does NOT:**
>
> -   connect to your real MetaMask wallet;
> -   request a wallet signature;
> -   request a seed phrase or private key;
> -   access your cryptocurrency;
> -   transfer, stake, swap, deposit, or withdraw real assets.
>
> The wallet address, balances, TVL, staking rewards, USDT profits,
> transactions, charts, strategies, and AI signals shown in the
> application are **demo/simulation data unless explicitly stated
> otherwise**.
>
> **Never enter a seed phrase or private key into this application.**
>
> This repository is not presented as an audited or production/mainnet
> financial application and should not currently be used with real
> funds.

------------------------------------------------------------------------

## What Is Included

The current AlphaBank prototype includes:

-   Node.js backend
-   React frontend
-   AlphaBank Dashboard
-   Staking
-   USDT Bank
-   Strategies
-   AI Intelligence
-   Portfolio & P&L
-   Transactions
-   Settings
-   Live Demo Simulation
-   Solidity AlphaBank Vault / Profit Engine prototype
-   Node.js risk-analysis module

The Live Demo Simulation makes portfolio values, rewards, realized USDT,
P&L, transactions, strategy status, and risk indicators change over time
so developers can evaluate the intended product behavior before real
blockchain integrations are enabled.

------------------------------------------------------------------------

## Run AlphaBank

### Requirements

-   Node.js 20.19+ (Node.js 22 LTS recommended)
-   npm

Install the application dependencies:

``` bash
npm install
```

Start:

``` bash
npm start
```

The Solidity workspace is intentionally installed separately so normal app setup does not pull the heavier Hardhat toolchain. For contract development only:

``` bash
npm run contracts:install
npm run contracts:compile
```

Then open:

``` text
http://localhost:3000
```

The application begins on the public AlphaBank Home page. Choose one of
the demo wallet options to enter the Dashboard.

To exit, click the wallet/address control in the Dashboard and select
**Log Out**.

------------------------------------------------------------------------

## AlphaBank Architecture

``` text
Web Application
      ↓
Node.js API
      ↓
AlphaBank Services
      ↓
Strategy / Risk / AI Layer
      ↓
Smart Contracts
      ↓
Blockchain / DeFi Protocols
```

The current simulation layer is designed so that it can later be
progressively replaced by verified RPC connections, smart-contract data,
price/oracle services, DEX integrations, indexers, and AI services.

------------------------------------------------------------------------

## Boofy Background

Boofy AlphaBank is part of the broader **Boofy** development project.

The Boofy team has been working across Web3/DeFi software covering
frontend applications, Node.js APIs, Solidity smart contracts, protocol
components, and Boofy token/protocol development.

The broader development areas include **Boofy-App, Boofy-Api,
Boofy-Contracts, Boofy-Protocol, and Boofy-AlphaBank**.

AlphaBank builds on this development experience while introducing a
focused product direction:

**Staking + Profit Realization + USDT Bank + Transparent P&L + AI Risk
Intelligence.**

Where Boofy projects use or derive from upstream open-source software,
applicable licenses, copyright notices, and attribution must remain
preserved.

------------------------------------------------------------------------

## Development Direction

The next stages of AlphaBank development include real testnet wallet
integration, verified blockchain data, staking strategy adapters,
controlled DEX execution, persistent portfolio history, AI analysis
integration, stronger risk controls, extensive smart-contract testing,
and independent security review before any meaningful production
deployment.

**AlphaBank does not promise guaranteed profit or principal
protection.** The objective is to make staking economics, realized
profit, and risk substantially more transparent and manageable.

------------------------------------------------------------------------

## Team

-   **Fan Long** --- Co-Founder --- ceo@boofy.net
-   **David Woo** --- Developer --- david@boofy.net
-   **Tyler Casselman** --- Developer --- tyler@boofy.net
-   **Albert Jones** --- Developer --- ajones923@gmail.com

**Boofy --- BUILD · CONNECT · GROW**

------------------------------------------------------------------------

## License & Attribution

See `LICENSE` and `THIRD_PARTY_NOTICES.md`.

Any upstream open-source code must retain its applicable license,
copyright, and author attribution.

### Clean install after upgrading from V8/V8.1

If this folder previously had dependencies installed, remove the old install state once before installing V8.2:

```bash
rm -rf node_modules package-lock.json
npm cache verify
npm install
npm start
```

V8.2 requires Node `20.19+` or `22.12+`. Do not use `--force` or `--legacy-peer-deps`; the dependency tree is intended to resolve normally.
