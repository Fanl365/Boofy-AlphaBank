# Boofy AlphaBank — Developer Handoff

## 10-minute orientation

1. Run `npm install` and `npm start`.
2. Open `http://localhost:3000`.
3. Open `http://localhost:3000/api/system` to see every API and integration boundary.
4. Review `src/server/index.ts` and `src/server/mockData.ts`.
5. Review `web/src/App.tsx` to see how frontend sections map to APIs.
6. Review `contracts/contracts/core/AlphaBankVault.sol` and `AlphaProfitEngine.sol`.
7. Review `docs/ARCHITECTURE.md` and `docs/SECURITY.md` before changing fund-flow logic.

## Current frontend-to-API map

- headline metrics → `GET /api/vaults`
- portfolio/P&L → `GET /api/portfolio/:wallet`
- performance chart → `GET /api/performance`
- strategy cards → `GET /api/strategies`
- activity → `GET /api/transactions`
- AI panel → `GET /api/ai/insight`, `POST /api/ai/analyze`
- integration status → `GET /api/health`, `GET /api/system`

## Deliberate boundaries

The current project does not invent chain addresses or pretend demo data is live. The server exposes clear seams for replacing demo sources with:

- RPC / contract reads;
- event indexer / database;
- oracle/price data;
- actual staking strategy adapter;
- approved DEX adapter;
- structured AI provider.

AI remains advisory. It must not be given unrestricted signing/custody authority.

## Definition of the next real integration

A good first engineering milestone should select one testnet or safe development environment and make one complete vertical slice real:

`wallet → vault deposit → strategy position → harvest → reward conversion → USDT accounting → API/indexer → frontend P&L`

Do not call the contracts production-ready until compile/tests, adversarial tests and independent review have been completed.

## Visual reference

`docs/FRONTEND_TARGET.png` is the product-direction reference used for the current dashboard pass. The React UI implements that direction as live components rather than displaying the reference as a full-page static image.

## Public start page / wallet handoff
The MVP intentionally simulates wallet login. `web/src/App.tsx` starts with `connected=false`; the MetaMask/Connect buttons call `connectDemoWallet()` and reveal the dashboard. Replace that function with the production wallet stack (for example wagmi/viem or a direct EIP-1193 provider) when real wallet authentication is approved. Do not make AI services a wallet signer.

## Selected Home V2 implementation

The public home page was rebuilt from the selected second visual concept. Start with:

- `web/src/components/HomePage.tsx` — actual landing-page components and demo wallet handoff.
- `web/src/home-v2.css` — landing-page visual system and responsive layout.
- `docs/FRONTEND_HOME_TARGET_V2.png` — selected design reference.

The landing page consumes the already-loaded vault/AI demo summaries from `App.tsx`, so its TVL, realized-profit/yield and AI risk preview can later become real automatically when the API data sources are replaced. All wallet buttons currently call the same `connectDemoWallet()` boundary by design.


## Pre-handoff verification notes

- Root npm dependencies are pinned instead of using `latest`.
- `contracts/` is an npm workspace, so root `npm install` installs the Hardhat toolchain too.
- The Node server loads `.env` automatically using `dotenv`.
- Unknown `/api/*` paths return JSON 404 instead of falling through to the React SPA.
- Static relative-import validation passed.
- Python risk-policy test passed.
- npm registry access timed out in the packaging environment, so run `npm install`, `npm run check`, `npm run contracts:compile`, and `npm run contracts:test` on the developer machine before treating the handoff as fully runtime-verified.

### Smart-contract security item to address before testnet

`AlphaBankVault.harvest(minUsdtOut)` is currently permissionless while `minUsdtOut` is supplied by the caller. Before testnet with meaningful value, either restrict harvest execution to an approved keeper/role or enforce a trusted quote/oracle policy on-chain so an arbitrary caller cannot intentionally choose an unsafe minimum output.


## V8 interaction changes
- Dashboard wallet chip opens an account dropdown instead of immediately leaving the app.
- `Log Out` returns the demo user to the public Home page.
- Public navigation is now page-based inside the React SPA: Products, Strategies, AI Intelligence, Security and About have dedicated content surfaces.
- These public pages are intentionally implemented without a router dependency so a production engineer can later map the same state to React Router/Next.js routes if desired.
- V7 live simulation endpoints and all authenticated pages remain unchanged.
