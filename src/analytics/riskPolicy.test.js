const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { evaluatePolicy } = require('./riskPolicy.js');
describe('evaluatePolicy', () => {
    it('increases realization during drawdown', () => {
        const normal = evaluatePolicy({
            entryPrice: 10,
            currentPrice: 9,
            realizedUsdt: 100,
            entryValueUsdt: 10_000,
        });
        const stressed = evaluatePolicy({
            entryPrice: 10,
            currentPrice: 7,
            realizedUsdt: 100,
            entryValueUsdt: 10_000,
        });
        assert.ok(stressed.realizeToUsdtPct > normal.realizeToUsdtPct);
        assert.ok(Math.abs(stressed.drawdownPct - 0.3) < 1e-12);
        assert.equal(stressed.reinvestPct, 0);
        assert.equal(stressed.reason, 'severe drawdown: maximize stablecoin realization');
        assert.equal(normal.reason, 'normal regime');
    });
    it('raises realization once drawdown crosses the moderate threshold', () => {
        const decision = evaluatePolicy({
            entryPrice: 10,
            currentPrice: 8,
            realizedUsdt: 420,
            entryValueUsdt: 10_000,
        });
        assert.equal(decision.realizeToUsdtPct, 0.8);
        assert.ok(Math.abs(decision.reinvestPct - 0.2) < 1e-12);
        assert.ok(Math.abs(decision.realizedYieldPct - 0.042) < 1e-12);
        assert.equal(decision.reason, 'drawdown: increase stablecoin realization');
    });
    it('rejects a non-positive entry price or entry value', () => {
        assert.throws(() => evaluatePolicy({
            entryPrice: 0,
            currentPrice: 1,
            realizedUsdt: 0,
            entryValueUsdt: 1,
        }), /entry price\/value must be positive/);
    });
});
