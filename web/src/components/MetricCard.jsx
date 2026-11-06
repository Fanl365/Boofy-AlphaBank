function MetricCard({ label, value, sub, icon }) {
    return (<article className="metric-card glass-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <p className="eyebrow">{label}</p>
        <h3>{value}</h3>
        <p className="muted">{sub}</p>
      </div>
    </article>);
}

module.exports = { MetricCard };
