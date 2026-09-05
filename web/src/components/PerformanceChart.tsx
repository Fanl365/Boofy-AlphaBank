export function PerformanceChart({ points }: { points: Array<{ day: string; principal: number; realized: number }> }) {
  if (!points.length) return <div className="chart-empty">Loading performance…</div>;
  const width = 720;
  const height = 230;
  const pad = 24;
  const principalValues = points.map(p => p.principal);
  const max = Math.max(...principalValues, 103);
  const min = Math.min(...principalValues, 90);
  const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(points.length - 1, 1);
  const y = (v: number) => pad + ((max - v) * (height - pad * 2)) / Math.max(max - min, 1);
  const principal = points.map((p, i) => `${x(i)},${y(p.principal)}`).join(' ');
  const realized = points.map((p, i) => `${x(i)},${height - pad - p.realized * 5}`).join(' ');
  return (
    <div className="chart-wrap">
      <svg className="performance-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Demo principal and realized profit chart">
        <defs>
          <linearGradient id="fillPrincipal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#28c8ff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#28c8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0,1,2,3].map(i => <line key={i} x1={pad} x2={width-pad} y1={pad + i * 52} y2={pad + i*52} className="grid-line" />)}
        <polygon points={`${pad},${height-pad} ${principal} ${width-pad},${height-pad}`} fill="url(#fillPrincipal)" />
        <polyline points={principal} className="line principal-line" />
        <polyline points={realized} className="line realized-line" />
      </svg>
      <div className="chart-labels"><span>{points[0]?.day}</span><span>{points[points.length-1]?.day}</span></div>
    </div>
  );
}
