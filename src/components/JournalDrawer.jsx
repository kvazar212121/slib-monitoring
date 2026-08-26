import { CRITERIA, GROUPS, STATUS, statusFromScore } from '../data/criteria';
import { StatusPill, Sparkline } from './ui';
import Icon, { GROUP_ICON } from './Icon';

export default function JournalDrawer({ journal, onClose }) {
  if (!journal) return null;
  const st = statusFromScore(journal.total);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(3px)', zIndex: 90 }}
      />
      <div
        style={{
          position: 'fixed', top: 0, right: 0, height: '100vh', width: 560, maxWidth: '96vw',
          background: 'var(--surface-2)', zIndex: 91, boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', animation: 'slideIn 0.28s ease',
        }}
      >
        {/* Gradient header */}
        <div style={{ padding: '22px 26px', background: `linear-gradient(135deg,${st.color},${st.ring})`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', right: 60, bottom: -50, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, position: 'relative' }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', fontSize: 12, fontWeight: 700 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} /> {st.label}
              </span>
              <h2 style={{ margin: '12px 0 5px', fontSize: 19, fontWeight: 800, lineHeight: 1.3 }}>{journal.name}</h2>
              <div style={{ fontSize: 12.5, opacity: 0.9 }}>
                {journal.issn ? `ISSN: ${journal.issn}` : 'ISSN kiritilmagan'} · {journal.studyField}
              </div>
            </div>
            <button onClick={onClose} style={{ color: '#fff', padding: 5, lineHeight: 1, display: 'inline-flex', background: 'rgba(255,255,255,0.18)', borderRadius: 9 }}><Icon name="x" size={20} /></button>
          </div>

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 20, position: 'relative' }}>
            <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
              <svg width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="46" cy="46" r="40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
                <circle cx="46" cy="46" r="40" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - journal.total / 100)} style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{journal.total}</span>
                <span style={{ fontSize: 10, opacity: 0.85 }}>/ 100</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, opacity: 0.9, marginBottom: 6, fontWeight: 600 }}>Umumiy faollik reytingi (12 oy)</div>
              <Sparkline data={journal.trend} color="#ffffff" width={280} height={54} />
            </div>
          </div>

          {/* Quick metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginTop: 18, position: 'relative' }}>
            {[
              { l: 'Maqola', v: journal.metrics.articles },
              { l: 'Sonlar', v: journal.metrics.editions },
              { l: 'Kutilyapti', v: journal.metrics.pendingApplications },
              { l: "O'rt. kun", v: journal.metrics.avgReviewDays },
            ].map((m) => (
              <div key={m.l} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 7, padding: '10px 6px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 19, fontWeight: 800 }}>{m.v}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 26px' }}>
          {GROUPS.map((g) => {
            const gs = journal.groupStatus[g.id];
            const gScore = journal.groupScore[g.id];
            const gMax = journal.groupMax[g.id];
            const items = CRITERIA.filter((c) => c.group === g.id);
            return (
              <div key={g.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-flex', color: STATUS[gs].color }}><Icon name={GROUP_ICON[g.id]} size={17} /></span>
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>{g.title}</span>
                  </div>
                  <StatusPill status={gs} size="sm">{gScore}/{gMax}</StatusPill>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 7, border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {items.map((c, i) => {
                    const val = journal.scores[c.id];
                    const ratio = val / c.max;
                    const cs = ratio >= 0.7 ? STATUS.green : ratio >= 0.4 ? STATUS.yellow : STATUS.red;
                    return (
                      <div key={c.id} style={{ padding: '11px 14px', borderTop: i ? '1px solid var(--surface-3)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{c.desc}</div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: cs.color, whiteSpace: 'nowrap' }}>{val}/{c.max}</div>
                        </div>
                        <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${ratio * 100}%`, background: cs.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '14px 22px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'var(--blue)', color: '#fff', fontWeight: 700, fontSize: 13 }}>Batafsil hisobot</button>
          <button style={{ padding: '10px 16px', borderRadius: 10, background: 'var(--surface-3)', color: 'var(--text-2)', fontWeight: 700, fontSize: 13 }}>Eslatma yuborish</button>
        </div>
      </div>
    </>
  );
}
