import 'dotenv/config';
import 'greensaver';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

import {
  aiInsight,
  strategies,
  transactions,
  vaults,
} from './mockData.js';
import { getLiveSnapshot } from './simulation.js';

const APP_VERSION = '0.8.2';
const port = Number(process.env.PORT ?? 3000);
const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'boofy-alphabank',
    version: APP_VERSION,
    mode: process.env.ALPHABANK_NETWORK ?? 'demo-live',
  });
});

app.get('/api/vaults', (_req, res) => {
  const snapshot = getLiveSnapshot();
  res.json(
    vaults.map((vault, index) =>
      index === 0
        ? {
            ...vault,
            tvlUsd: snapshot.tvlUsd,
            realizedUsdt: snapshot.realizedUsdt,
            realizedYield: snapshot.realizedYield,
          }
        : vault,
    ),
  );
});

app.get('/api/strategies', (_req, res) => res.json(strategies));

app.get('/api/transactions', (_req, res) => {
  const liveEvents = getLiveSnapshot().events;
  res.json([...liveEvents, ...transactions].slice(0, 12));
});

app.get('/api/performance', (_req, res) => {
  res.json(getLiveSnapshot().performance);
});

app.get('/api/ai/insight', (_req, res) => {
  const snapshot = getLiveSnapshot();
  res.json({
    ...aiInsight,
    riskScore: snapshot.riskScore,
    headline: `${snapshot.riskBand} Risk — live demo policy response`,
    summary: `Simulation tick ${snapshot.tick}. Principal, realized profit and risk are recalculated from one coherent demo state.`,
  });
});

app.get('/api/portfolio/:wallet', (req, res) => {
  res.json({ ...getLiveSnapshot().portfolio, wallet: req.params.wallet });
});

app.get('/api/live', (_req, res) => res.json(getLiveSnapshot()));

app.get('/api/live/stream', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = () => {
    res.write(`data: ${JSON.stringify(getLiveSnapshot())}\n\n`);
  };

  send();
  const timer = setInterval(send, 2_000);

  req.on('close', () => {
    clearInterval(timer);
    res.end();
  });
});

app.get('/api/system', (_req, res) => {
  res.json({
    api: [
      '/api/health',
      '/api/vaults',
      '/api/strategies',
      '/api/portfolio/:wallet',
      '/api/performance',
      '/api/transactions',
      '/api/ai/insight',
      '/api/ai/analyze',
      '/api/live',
      '/api/live/stream',
    ],
    contracts: [
      'AlphaBankVault.sol',
      'AlphaProfitEngine.sol',
      'IAlphaStrategy.sol',
      'IAlphaSwapAdapter.sol',
    ],
    integrations: {
      rpc: process.env.ALPHABANK_RPC_URL ? 'configured' : 'not-configured',
      vaultAddress: process.env.ALPHABANK_VAULT_ADDRESS ? 'configured' : 'not-configured',
      aiProvider: process.env.OPENAI_API_KEY ? 'configured' : 'demo-policy',
    },
  });
});

app.post('/api/ai/analyze', (req, res) => {
  const snapshot = getLiveSnapshot();
  const preference = req.body?.riskPreference ?? 'balanced';
  const stance =
    preference === 'conservative'
      ? 'Conservative'
      : preference === 'opportunistic'
        ? 'Opportunistic'
        : 'Balanced';

  res.json({
    ...aiInsight,
    riskScore: snapshot.riskScore,
    headline: `${snapshot.riskBand} Risk — ${preference} live-demo analysis`,
    stance,
    summary: `Live simulation tick ${snapshot.tick}: principal ${snapshot.portfolio.principalUsd.toFixed(2)} USD, claimable ${snapshot.portfolio.claimableUsdt.toFixed(2)} USDT. Advisory output only.`,
    generatedAt: new Date().toISOString(),
    mode: 'demo-live',
    disclaimer:
      'Simulation/research output only. No transaction is signed or submitted by the AI layer.',
  });
});

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, error: 'API route not found' });
});

async function startServer() {
  const configFile = fileURLToPath(new URL('../../vite.config.ts', import.meta.url));
  const vite = await createViteServer({
    configFile,
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const server = app.listen(port, () => {
    console.log(`\n  Boofy AlphaBank V8.2 Live Demo → http://localhost:${port}`);
    console.log(`  Live stream                     → http://localhost:${port}/api/live/stream\n`);
  });

  const shutdown = async () => {
    server.close();
    await vite.close();
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Failed to start Boofy AlphaBank:', error);
  process.exitCode = 1;
});
