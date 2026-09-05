# Changelog

## Unreleased

### Node.js product handoff
- Reorganized AlphaBank into one Node.js-driven developer experience.
- Added a React product frontend served through Vite middleware from the Node.js process.
- Added portfolio, vault, performance and AI demo APIs.
- Added polished Boofy AlphaBank dashboard emphasizing realized USDT and net P&L.
- Preserved Solidity MVP, Python risk research and documentation.
- Added exact supplied Boofy PNG branding asset.
- Added developer handoff documentation.

## 0.4.0 - Start page / demo wallet entry
- Added a dedicated public AlphaBank home page before the authenticated dashboard.
- Added demo `Login with MetaMask`, `Connect Wallet`, and `Enter AlphaBank Demo` actions.
- Demo wallet actions require no signature and route directly to the dashboard.
- Dashboard wallet chip now returns to the start page for easy candidate demos.
- Added product-flow, AI, and security positioning to the start page.

## 0.5.0 — Home V2

- Rebuilt the public AlphaBank start page around the selected second visual concept.
- Added dedicated MetaMask / WalletConnect / Coinbase Wallet / Trust Wallet demo-entry panel.
- Added live demo metric handoff from the existing Node.js API-loaded state to the home page.
- Added Stake → Harvest → Realize → Intelligence product cards and an AlphaBank dashboard preview.
- Added `docs/FRONTEND_HOME_TARGET_V2.png` as the selected visual reference.
- Kept wallet authentication intentionally simulated; production wallet integration remains a clear engineering seam.


## 0.5.1 — Structural verification pass
- Pinned Node/React/Vite dependencies for reproducible installs.
- Added `dotenv` loading for `.env` integration settings.
- Added the Solidity package as an npm workspace and fixed root contract scripts.
- Added JSON 404 handling for unknown API routes.
- Cleaned unused dashboard imports.
- Documented the permissionless-harvest/min-output security item for the next Solidity pass.

## 0.6.0
- Added polished dedicated product pages for every sidebar destination.
- Added portfolio, strategy, intelligence, transaction and settings interaction surfaces.
- Preserved the existing Node.js API and Solidity/Python MVP modules.

## 0.7.0
- Added coherent live demo simulation engine.
- Added SSE push stream and live status badge.
- Linked portfolio, performance, realized profit, TVL, AI risk and transaction events to one simulated state.


## 0.8.0
- Added wallet dropdown on the dashboard with an explicit Log Out action.
- Log Out returns the demo session to the Boofy AlphaBank public Home page.
- Replaced scroll-only public navigation with dedicated Products, Strategies, AI Intelligence, Security and About pages.
- Added public product architecture cards, AI decision pipeline, security boundaries, demo product metrics and guided page-to-page tour actions.
- Preserved V7 live demo simulation and authenticated product pages.
