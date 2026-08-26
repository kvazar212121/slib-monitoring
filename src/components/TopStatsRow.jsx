import Icon from './Icon';

// Tepadagi kichik statistika kartalari qatori (SLIB TZ §10 ko'rsatkichlari)
const STATS = [
  { id: 'newApps', label: 'Yangi arizalar', value: '214', note: 'Bugun', delta: +18, icon: 'inbox' },
  { id: 'reviewing', label: "Ko'rib chiqilayotgan", value: '356', note: 'Jami', delta: +12, icon: 'clock' },
  { id: 'inReview', label: 'Taqriz jarayonida', value: '187', note: 'Jami', delta: -8, icon: 'pen' },
  { id: 'articles', label: 'Maqolalar soni', value: '25 614', note: 'Jami', delta: +22, icon: 'file' },
  { id: 'editions', label: 'Nashrlar / Sonlar', value: '4 321', note: 'Jami', delta: +15, icon: 'box' },
  { id: 'admins', label: 'Faol adminlar', value: '412', note: 'Jami', delta: +11, icon: 'users' },
];

export default function TopStatsRow({ onOpen }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
      {STATS.map((s, i) => {
        const up = s.delta >= 0;
        const col = up ? '#16a34a' : '#dc2626';
        const bg = up ? '#dcfce7' : '#fee2e2';
        return (
          <div key={s.id}
            onClick={() => onOpen && onOpen(s.id)}
            style={{
              background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', padding: '14px 16px', cursor: 'pointer',
              animation: `fadeUp 0.4s ease ${i * 0.05}s both`, transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--surface-3)', color: 'var(--text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={s.icon} size={16} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, lineHeight: 1.2 }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.note}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 800, color: col, background: bg, padding: '2px 7px', borderRadius: 6 }}>
                <Icon name={up ? 'trendUp' : 'trendDown'} size={12} strokeWidth={2.6} />{up ? '+' : ''}{s.delta}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
