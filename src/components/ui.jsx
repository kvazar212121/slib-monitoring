import { STATUS } from '../data/criteria';
import Icon from './Icon';

let sparkSeq = 0;


export function StatusDot({ status, size = 8, pulse = false }) {
  const s = STATUS[status];
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: s.color,
        boxShadow: `0 0 0 3px ${s.soft}`,
        animation: pulse ? 'pulse 1.6s ease-in-out infinite' : 'none',
      }}
    />
  );
}

export function StatusPill({ status, children, size = 'md' }) {
  const s = STATUS[status];
  const pad = size === 'sm' ? '2px 8px' : '4px 11px';
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: pad,
        borderRadius: 999,
        background: s.soft,
        color: s.color,
        fontSize: fs,
        fontWeight: 700,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      <StatusDot status={status} size={size === 'sm' ? 6 : 7} />
      {children || s.label}
    </span>
  );
}

// Kichik SVG sparkline (faollik trendi)
export function Sparkline({ data, color = '#22c55e', width = 92, height = 30 }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gid = `spark-grad-${sparkSeq++}`;
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

// Progress ring (foiz)
export function Ring({ value, size = 46, stroke = 5, color, track = '#e2e8f0', label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size < 40 ? 11 : 12,
          fontWeight: 800,
          color: 'var(--text)',
        }}
      >
        {label ?? `${value}%`}
      </div>
    </div>
  );
}

// Kriteriya katakchasi: yashil/sariq/qizil belgisi
export function CriteriaCell({ status, value, max, title }) {
  const s = STATUS[status];
  const icons = { green: 'check', yellow: 'warn', red: 'x' };
  return (
    <div
      title={title ? `${title}: ${value}/${max} ball` : `${value}/${max}`}
      style={{
        width: 26,
        height: 26,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: s.soft,
        color: s.color,
        margin: '0 auto',
        cursor: 'default',
      }}
    >
      <Icon name={icons[status]} size={15} strokeWidth={2.6} />
    </div>
  );
}
