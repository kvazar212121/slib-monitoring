import { Sparkline } from './ui';
import Icon from './Icon';

const CONFIG = {
  green: { color: '#16a34a', ring: '#22c55e', soft: '#dcfce7', icon: 'check' },
  yellow: { color: '#d97706', ring: '#f59e0b', soft: '#fef3c7', icon: 'warn' },
  red: { color: '#dc2626', ring: '#ef4444', soft: '#fee2e2', icon: 'x' },
  blue: { color: '#2563eb', ring: '#2563eb', soft: '#dbeafe', icon: 'book' },
};

export default function KpiCard({ variant, title, subtitle, value, percent, total, trend, active, onClick, index = 0 }) {
  const c = CONFIG[variant];
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 210,
        textAlign: 'left',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        boxShadow: active ? `0 0 0 2px ${c.ring}, var(--shadow)` : 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.15s, box-shadow 0.15s',
        animation: `fadeUp 0.4s ease ${index * 0.06}s both`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 0 0 2px ${c.ring}, var(--shadow-lg)`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = active ? `0 0 0 2px ${c.ring}, var(--shadow)` : 'var(--shadow-sm)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: c.color, opacity: 0.9 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: c.soft, color: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          ><Icon name={c.icon} size={23} strokeWidth={2.4} /></div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.3, color: c.color, textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        {trend && <Sparkline data={trend} color={c.color} width={72} height={28} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>
          {value}
          {total != null && <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-3)' }}> / {total}</span>}
        </div>
        {percent != null && (
          <div style={{ fontSize: 13, fontWeight: 800, color: c.color, background: c.soft, padding: '3px 9px', borderRadius: 8 }}>
            {percent}%
          </div>
        )}
      </div>
    </button>
  );
}
