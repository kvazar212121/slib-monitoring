import Icon from './Icon';

// Kategoriya kartasi: ichida yashil/sariq/qizil taqsimot, bosilsa ro'yxat ochiladi
export default function CategoryStatCard({ index, category, breakdown, onView }) {
  const { green, yellow, red, total } = breakdown;
  const pct = (v) => (total ? (v / total) * 100 : 0);

  const rows = [
    { key: 'green', s: 'Yaxshi', v: green, color: '#16a34a', bg: '#dcfce7', dot: '#22c55e' },
    { key: 'yellow', s: "O'rtacha", v: yellow, color: '#d97706', bg: '#fef3c7', dot: '#f59e0b' },
    { key: 'red', s: 'Faol emas', v: red, color: '#dc2626', bg: '#fee2e2', dot: '#ef4444' },
  ];

  return (
    <div
      style={{
        background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        animation: `fadeUp 0.45s ease ${index * 0.07}s both`,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Gradient header */}
      <div style={{ background: category.grad, padding: '18px 20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -25, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', right: 24, bottom: -30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
            <Icon name={category.icon} size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>{index + 1}-KATEGORIYA</div>
            <div style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.2, marginTop: 1 }}>{category.title}</div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 12, position: 'relative', lineHeight: 1.4 }}>{category.hint}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Stacked bar */}
        <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', gap: 3, marginBottom: 14 }}>
          <div style={{ width: `${pct(green)}%`, background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 6, transition: 'width 0.7s ease' }} />
          <div style={{ width: `${pct(yellow)}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', borderRadius: 6, transition: 'width 0.7s ease' }} />
          <div style={{ width: `${pct(red)}%`, background: 'linear-gradient(90deg,#f87171,#ef4444)', borderRadius: 6, transition: 'width 0.7s ease' }} />
        </div>

        {/* Status rows - bosilsa o'sha ro'yxat ochiladi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.map((r) => (
            <button key={r.key} onClick={() => onView(r.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--surface-2)', transition: 'background 0.15s', textAlign: 'left', width: '100%' }}
              onMouseEnter={(e) => e.currentTarget.style.background = r.bg}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface-2)'}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600, flex: 1 }}>{r.s}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: r.color, background: r.bg, padding: '2px 9px', borderRadius: 7 }}>{r.v} ta</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, minWidth: 42, textAlign: 'right' }}>{pct(r.v).toFixed(1)}%</span>
              <span style={{ display: 'inline-flex', color: 'var(--text-3)' }}><Icon name="chevronRight" size={14} /></span>
            </button>
          ))}
        </div>

        <button onClick={() => onView('all')}
          style={{ marginTop: 14, padding: '11px', borderRadius: 11, background: 'var(--text)', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'opacity 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <Icon name="chart" size={16} /> Barchasini ko'rish <Icon name="chevronRight" size={15} />
        </button>
      </div>
    </div>
  );
}
