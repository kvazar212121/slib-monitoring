import { CRITERIA, GROUPS, STATUS, statusFromScore } from '../data/criteria';
import { StatusPill, Ring, Sparkline } from './ui';
import Icon, { GROUP_ICON } from './Icon';

export default function JournalDrawer({ journal, onClose }) {
  if (!journal) return null;
  const st = statusFromScore(journal.total);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)', zIndex: 40 }}
      />
      <div
        style={{
          position: 'fixed', top: 0, right: 0, height: '100vh', width: 460, maxWidth: '92vw',
          background: 'var(--surface-2)', zIndex: 50, boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column', animation: 'slideIn 0.28s ease',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 22px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <StatusPill status={st.id} />
              <h2 style={{ margin: '10px 0 4px', fontSize: 17, fontWeight: 800, lineHeight: 1.3 }}>{journal.name}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {journal.issn ? `ISSN: ${journal.issn}` : 'ISSN kiritilmagan'} · {journal.studyField}
              </div>
            </div>
            <button onClick={onClose} style={{ color: 'var(--text-3)', padding: 4, lineHeight: 1, display: 'inline-flex' }}><Icon name="x" size={20} /></button>
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 16 }}>
            <Ring value={journal.total} size={72} stroke={7} color={st.color} label={
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{journal.total}</span>
                <span style={{ fontSize: 9, color: 'var(--text-3)' }}>/ 100</span>
              </span>
            } />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>Umumiy faollik reytingi</div>
              <Sparkline data={journal.trend} color={st.color} width={180} height={38} />
            </div>
          </div>

          {/* Quick metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
            {[
              { l: 'Maqola', v: journal.metrics.articles },
              { l: 'Sonlar', v: journal.metrics.editions },
              { l: 'Kutilyapti', v: journal.metrics.pendingApplications },
              { l: "O'rt. kun", v: journal.metrics.avgReviewDays },
            ].map((m) => (
              <div key={m.l} style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{m.v}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Criteria groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
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
                <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
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
