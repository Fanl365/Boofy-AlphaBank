# Changelog

## Unreleased

### CommonJS
- Replaced JavaScript `import` and `export` with `require` and `module.exports`.
- The React screens stay as `require` in source. Vite rewrites those calls for the browser.

### JavaScript sources
- Converted the application, Vite config, and Hardhat workspace from TypeScript to JavaScript.
- The server now starts with `node --watch src/server/index.js`.
- React screens are `.jsx` files. Server, analytics, and contract tests are `.js` files.

### Node.js risk policy
- Replaced the Python drawdown and harvest-allocation sandbox with `src/analytics/riskPolicy.js`.
- Risk-policy tests now run with Node.js (`npm run test:risk`).
- `/api/ai/insight`, `/api/ai/analyze`, and `/api/risk/policy` use that policy for the live demo portfolio.

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

## 0.8.2

- Fixed the root npm peer-dependency conflict by pairing `vite@8.2.2` with `@vitejs/plugin-react@6.1.1`.
- Updated `lucide-react` to `1.43.0`.
- Aligned the Node engine with Vite 8 (`^20.19.0 || >=22.12.0`) and declared npm 10+.
- Added `npm run verify` for typecheck, production build, and analytics tests.
- Updated runtime/UI version reporting to V8.2.

## 0.8.1
- Updated the Node/React/Vite dependency stack to current compatible stable releases.
- Migrated Express from v4 to v5 and aligned its TypeScript definitions.
- Updated React/ReactDOM to 19.2.x and aligned React type packages.
- Updated Vite/plugin-react, tsx, dotenv, Lucide, Node types and TypeScript.
- Raised the supported Node.js floor to 20.19+ for modern Vite compatibility.
- Refactored `src/server/index.ts` for clearer Express 5 handlers, robust Vite config path resolution, clean startup failure handling, graceful shutdown, and V8.1 version reporting.
- Separated Solidity/Hardhat installation from the default application `npm install` so app startup does not automatically install the heavier contract toolchain.
- Updated the Hardhat 2 toolchain to its maintained hh2-compatible line while retaining OpenZeppelin 4.9.6 because the existing Solidity code targets its API.
