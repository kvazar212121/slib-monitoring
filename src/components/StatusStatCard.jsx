import Icon from './Icon';
import { STATUS, GROUPS } from '../data/criteria';

// Status kartasi: Yaxshi(yashil) / O'rtacha(sariq) / Faol emas(qizil)
export default function StatusStatCard({ index, statusKey, count, total, groupBreakdown, onView }) {
  const sc = STATUS[statusKey];
  const GRAD = `linear-gradient(135deg,${sc.color},${sc.ring})`;
  const icon = statusKey === 'green' ? 'check' : statusKey === 'yellow' ? 'warn' : 'x';
  const subtitle = statusKey === 'green' ? 'Platformadan faol foydalanmoqda'
    : statusKey === 'yellow' ? 'Faol, lekin jarayonlar sust'
    : 'Deyarli foydalanmayapti';

  return (
    <div
      onClick={() => onView(statusKey)}
      style={{
        background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer',
        animation: `fadeUp 0.45s ease ${index * 0.08}s both`,
        display: 'flex', flexDirection: 'column', transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* Gradient header - status rangida */}
      <div style={{ background: GRAD, padding: '20px 22px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -25, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', right: 30, bottom: -35, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
            <Icon name={icon} size={24} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>{sc.label}</div>
            <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ marginTop: 16, position: 'relative' }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{count}<span style={{ fontSize: 18, fontWeight: 600, opacity: 0.8 }}> / {total}</span></div>
          <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 3 }}>jami jurnallardan</div>
        </div>
      </div>

      {/* Body: kriteriya guruhlari bo'yicha shu statusdagilar (ixcham) */}
      <div style={{ padding: '16px 22px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 10 }}>Kriteriya guruhlari bo'yicha</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {GROUPS.map((g) => {
            const n = groupBreakdown[g.id][statusKey];
            const gPct = total ? (n / total) * 100 : 0;
            return (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 600, width: 96, flexShrink: 0 }}>{g.short}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--surface-3)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${gPct}%`, background: sc.color, borderRadius: 5, transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: sc.color, minWidth: 34, textAlign: 'right' }}>{n} ta</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: sc.color }}>
          Ro'yxatni ochish uchun bosing <Icon name="chevronRight" size={15} />
        </div>
      </div>
    </div>
  );
}
