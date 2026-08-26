// Donut (halqa) grafik - yashil/sariq/qizil segmentlar
export default function Donut({ segments, size = 132, thickness = 18, centerTop, centerBottom }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const gap = 0.012 * c; // segmentlar orasidagi kichik bo'shliq

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const len = Math.max(0, frac * c - gap);
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.7s ease, stroke-dashoffset 0.7s ease' }}
            />
          );
          offset += frac * c;
          return el;
        })}
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 1,
        }}
      >
        <div style={{ fontSize: size < 120 ? 22 : 26, fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>{centerTop}</div>
        {centerBottom && <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600 }}>{centerBottom}</div>}
      </div>
    </div>
  );
}
