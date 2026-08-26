import Icon from './Icon';

// "Jami jurnallar" kartasi - status kartalari bilan bir qatorda
export default function TotalStatCard({ total, onView }) {
  const GRAD = 'linear-gradient(135deg,#2563eb,#1d4ed8)';
  return (
    <div
      onClick={onView}
      style={{
        background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer',
        animation: 'fadeUp 0.45s ease both',
        display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* Gradient header */}
      <div style={{ background: GRAD, padding: '20px 22px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -25, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', right: 30, bottom: -35, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
            <Icon name="book" size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>Jami jurnallar</div>
            <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 2 }}>Platformadagi barcha nashrlar</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, position: 'relative' }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 3 }}>umumiy soni</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 22px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 10 }}>Umumiy taqsimot</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { l: 'Yaxshi', c: '#22c55e' },
            { l: "O'rtacha", c: '#f59e0b' },
            { l: 'Faol emas', c: '#ef4444' },
          ].map((r) => (
            <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: r.c, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600 }}>{r.l}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#2563eb' }}>
          Barcha jurnallarni ochish <Icon name="chevronRight" size={15} />
        </div>
      </div>
    </div>
  );
}
