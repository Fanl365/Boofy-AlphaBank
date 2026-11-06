const defaultPolicyConfig = {
    normalRealizePct: 0.5,
    drawdownRealizePct: 0.8,
    severeDrawdownRealizePct: 1,
    drawdownThreshold: 0.15,
    severeDrawdownThreshold: 0.3,
};
function evaluatePolicy(state, cfg = defaultPolicyConfig) {
    if (state.entryPrice <= 0 || state.entryValueUsdt <= 0) {
        throw new Error('entry price/value must be positive');
    }
    const drawdown = Math.max(0, (state.entryPrice - state.currentPrice) / state.entryPrice);
    let realize = cfg.normalRealizePct;
    let reason = 'normal regime';
    if (drawdown >= cfg.severeDrawdownThreshold) {
        realize = cfg.severeDrawdownRealizePct;
        reason = 'severe drawdown: maximize stablecoin realization';
    }
    else if (drawdown >= cfg.drawdownThreshold) {
        realize = cfg.drawdownRealizePct;
        reason = 'drawdown: increase stablecoin realization';
    }
    return {
        drawdownPct: drawdown,
        realizeToUsdtPct: realize,
        reinvestPct: 1 - realize,
        realizedYieldPct: state.realizedUsdt / state.entryValueUsdt,
        reason,
    };
}
function evaluatePortfolioPolicy(portfolio) {
    return evaluatePolicy({
        entryPrice: portfolio.depositedUsd,
        currentPrice: portfolio.principalUsd,
        realizedUsdt: portfolio.realizedUsdt,
    entryValueUsdt: portfolio.depositedUsd,
  });
}

module.exports = { defaultPolicyConfig, evaluatePolicy, evaluatePortfolioPolicy };
