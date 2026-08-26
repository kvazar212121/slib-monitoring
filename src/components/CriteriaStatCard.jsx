import Icon, { GROUP_ICON } from './Icon';
import { Sparkline } from './ui';

// Zamonaviy kriteriya karta: gradient bosh, katta foiz, stacked segment-bar
export default function CriteriaStatCard({ index, group, breakdown, total, trend, onView }) {
  const { green, yellow, red } = breakdown;
  const pct = (v) => (total ? (v / total) * 100 : 0);
  const greenPct = Math.round(pct(green));

  const GRAD = [
    'linear-gradient(135deg,#0ea5e9,#2563eb)',
    'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    'linear-gradient(135deg,#f59e0b,#ea580c)',
  ][index % 3];

  const rows = [
    { s: 'Yaxshi', v: green, color: '#16a34a', bg: '#dcfce7', dot: '#22c55e' },
    { s: "O'rtacha", v: yellow, color: '#d97706', bg: '#fef3c7', dot: '#f59e0b' },
    { s: 'Faol emas', v: red, color: '#dc2626', bg: '#fee2e2', dot: '#ef4444' },
  ];

  return (
    <div
      style={{
        background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        animation: `fadeUp 0.45s ease ${index * 0.08}s both`,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Gradient header */}
      <div style={{ background: GRAD, padding: '18px 20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', right: 24, bottom: -30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative' }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
            <Icon name={GROUP_ICON[group.id]} size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>{index + 1}-KRITERIYA GURUHI</div>
            <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25, marginTop: 1 }}>{group.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14, position: 'relative' }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{greenPct}%</div>
            <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>samarali foydalanish darajasi</div>
          </div>
          {trend && (
            <div style={{ opacity: 0.9 }}>
              <Sparkline data={trend} color="#ffffff" width={92} height={34} />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Stacked segment bar */}
        <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', gap: 3, marginBottom: 14 }}>
          <div style={{ width: `${pct(green)}%`, background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 6, transition: 'width 0.7s ease' }} title={`Yaxshi: ${green}`} />
          <div style={{ width: `${pct(yellow)}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', borderRadius: 6, transition: 'width 0.7s ease' }} title={`O'rtacha: ${yellow}`} />
          <div style={{ width: `${pct(red)}%`, background: 'linear-gradient(90deg,#f87171,#ef4444)', borderRadius: 6, transition: 'width 0.7s ease' }} title={`Faol emas: ${red}`} />
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r) => (
            <div key={r.s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600, flex: 1 }}>{r.s}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: r.color, background: r.bg, padding: '2px 9px', borderRadius: 7 }}>{r.v} ta</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, minWidth: 42, textAlign: 'right' }}>{pct(r.v).toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <button
          onClick={onView}
          style={{
            marginTop: 16, padding: '11px', borderRadius: 11, background: 'var(--text)', color: '#fff',
            fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
        >
          <Icon name="chart" size={16} /> Katalogni ochish <Icon name="chevronRight" size={15} />
        </button>
      </div>
    </div>
  );
}
