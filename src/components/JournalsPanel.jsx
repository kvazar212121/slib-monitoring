import { useMemo, useState } from 'react';
import { JOURNALS } from '../data/journals';
import { CRITERIA, GROUPS, STATUS, statusFromScore } from '../data/criteria';
import { StatusPill, StatusDot, Sparkline, CriteriaCell } from './ui';
import Icon, { CRITERIA_ICON, GROUP_ICON } from './Icon';

const STATUS_META = {
  all: { label: 'Barcha jurnallar', grad: 'linear-gradient(135deg,#1e293b,#0f172a)', icon: 'book' },
  green: { label: 'Yaxshi jurnallar', grad: 'linear-gradient(135deg,#16a34a,#15803d)', icon: 'check' },
  yellow: { label: "O'rtacha jurnallar", grad: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: 'warn' },
  red: { label: 'Faol emas jurnallar', grad: 'linear-gradient(135deg,#ef4444,#dc2626)', icon: 'x' },
};

export default function JournalsPanel({ initialStatus = 'all', group = null, onClose, onOpenJournal }) {
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [groupView, setGroupView] = useState(group ? group.id : 'overview');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('total');
  const [view, setView] = useState('table'); // table | cards

  // Guruh tanlangan bo'lsa - statusni guruhga xos ballardan olamiz
  const statusOf = (j) => (group ? j.groupStatus[group.id] : j.status);

  const groupCriteria = groupView === 'overview' ? null : CRITERIA.filter((c) => c.group === groupView);

  const counts = useMemo(() => {
    const c = { all: JOURNALS.length, green: 0, yellow: 0, red: 0 };
    JOURNALS.forEach((j) => { c[statusOf(j)] += 1; });
    return c;
  }, [group]);

  const filtered = useMemo(() => {
    let list = JOURNALS.filter((j) => {
      if (statusFilter !== 'all' && statusOf(j) !== statusFilter) return false;
      if (search && !j.name.toLowerCase().includes(search.toLowerCase()) && !j.studyField.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'total') return (group ? b.groupScore[group.id] - a.groupScore[group.id] : b.total - a.total);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'articles') return b.metrics.articles - a.metrics.articles;
      if (sortBy === 'recent') return a.lastUpdateDays - b.lastUpdateDays;
      return 0;
    });
    return list;
  }, [statusFilter, search, sortBy, group]);

  const meta = STATUS_META[statusFilter] || STATUS_META.all;
  const avgScore = filtered.length ? Math.round(filtered.reduce((s, j) => s + j.total, 0) / filtered.length) : 0;
  const totalArticles = filtered.reduce((s, j) => s + j.metrics.articles, 0);
  const withDoi = filtered.filter((j) => j.metrics.hasDoi).length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--surface-3)', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: meta.grad, color: '#fff', padding: '18px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 60, top: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 220, bottom: -60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
            <Icon name="chevronLeft" size={16} /> Orqaga
          </button>
          <div style={{ width: 46, height: 46, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={meta.icon} size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>{group ? `${group.title.toUpperCase()} · KATALOG` : 'JURNALLAR KATALOGI'}</div>
            <h1 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800 }}>{meta.label}</h1>
          </div>
          {/* Mini stats */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { l: 'Jurnal', v: filtered.length },
              { l: "O'rt. ball", v: avgScore },
              { l: 'Maqola', v: totalArticles },
              { l: 'DOI bor', v: withDoi },
            ].map((s) => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 7, padding: '8px 15px', textAlign: 'center', backdropFilter: 'blur(4px)', minWidth: 66 }}>
                <div style={{ fontSize: 21, fontWeight: 800 }}>{s.v}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status quick filter chips */}
      <div style={{ padding: '12px 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { id: 'all', l: 'Barchasi', c: 'var(--text)' },
          { id: 'green', l: 'Yaxshi', c: '#16a34a' },
          { id: 'yellow', l: "O'rtacha", c: '#d97706' },
          { id: 'red', l: 'Faol emas', c: '#dc2626' },
        ].map((f) => {
          const on = statusFilter === f.id;
          return (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
                background: on ? f.c : 'var(--surface-3)', color: on ? '#fff' : 'var(--text-2)' }}>
              {f.id !== 'all' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: on ? '#fff' : f.c }} />}
              {f.l}
              <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 7px', borderRadius: 6, background: on ? 'rgba(255,255,255,0.25)' : 'var(--surface)', color: on ? '#fff' : 'var(--text-3)' }}>{counts[f.id]}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        {/* View toggle */}
        <div style={{ display: 'flex', background: 'var(--surface-3)', borderRadius: 9, padding: 3, gap: 3 }}>
          {[{ id: 'cards', ic: 'box' }, { id: 'table', ic: 'logs' }].map((v) => (
            <button key={v.id} onClick={() => setView(v.id)}
              style={{ padding: '7px 12px', borderRadius: 7, background: view === v.id ? 'var(--surface)' : 'transparent', color: view === v.id ? 'var(--blue)' : 'var(--text-3)', boxShadow: view === v.id ? 'var(--shadow-sm)' : 'none' }}>
              <Icon name={v.ic} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: '12px 28px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <Icon name="search" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Jurnal yoki yo'nalish qidirish..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 14 }} />
        </div>
        {/* Criteria group filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ id: 'overview', icon: 'chart', short: 'Umumiy' }, ...GROUPS.map((g) => ({ id: g.id, icon: GROUP_ICON[g.id], short: g.short }))].map((g) => {
            const on = groupView === g.id;
            return (
              <button key={g.id} onClick={() => setGroupView(g.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 13px', borderRadius: 9, fontSize: 12.5, fontWeight: 700,
                  background: on ? 'var(--text)' : 'var(--surface)', color: on ? '#fff' : 'var(--text-2)', border: '1px solid ' + (on ? 'var(--text)' : 'var(--border)') }}>
                <Icon name={g.icon} size={15} />{g.short}
              </button>
            );
          })}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 13px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>
          <option value="total">Ball bo'yicha</option>
          <option value="name">Nom bo'yicha</option>
          <option value="articles">Maqola soni</option>
          <option value="recent">Faollik vaqti</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
            <Icon name="search" size={34} /><div style={{ marginTop: 10 }}>Hech qanday jurnal topilmadi</div>
          </div>
        )}

        {view === 'cards' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 16 }}>
            {filtered.map((j, i) => (
              <JournalCard key={j.id} j={j} index={i} groupView={groupView} groupCriteria={groupCriteria} group={group} onClick={() => onOpenJournal(j)} />
            ))}
          </div>
        ) : (
          <JournalsTable list={filtered} groupView={groupView} groupCriteria={groupCriteria} onOpenJournal={onOpenJournal} />
        )}
      </div>
    </div>
  );
}

function JournalCard({ j, index, groupView, groupCriteria, group, onClick }) {
  const st = group ? STATUS[j.groupStatus[group.id]] : statusFromScore(j.total);
  const scoreShown = group ? j.groupScore[group.id] : j.total;
  const scoreMax = group ? j.groupMax[group.id] : 100;
  return (
    <div onClick={onClick}
      style={{ background: 'var(--surface)', borderRadius: 9, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', animation: `fadeUp 0.4s ease ${Math.min(index * 0.03, 0.4)}s both` }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
      <div style={{ height: 4, background: st.color }} />
      <div style={{ padding: '15px 17px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{j.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: st.color, lineHeight: 1 }}>{scoreShown}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)' }}>/ {scoreMax}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <StatusPill status={st.id} size="sm" />
          <div style={{ flex: 1 }} />
          <Sparkline data={j.trend} color={st.color} width={70} height={24} />
        </div>

        {groupView === 'overview' ? (
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {GROUPS.map((g) => (
              <div key={g.id} style={{ flex: 1, background: 'var(--surface-3)', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }} title={g.title}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, color: 'var(--text-3)' }}><Icon name={GROUP_ICON[g.id]} size={13} /><StatusDot status={j.groupStatus[g.id]} size={6} /></div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-2)', marginTop: 3 }}>{j.groupScore[g.id]}/{j.groupMax[g.id]}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {groupCriteria.map((c) => {
              const val = j.scores[c.id]; const ratio = val / c.max;
              const cs = ratio >= 0.7 ? 'green' : ratio >= 0.4 ? 'yellow' : 'red';
              return (
                <div key={c.id} title={`${c.name}: ${val}/${c.max}`} style={{ display: 'flex', alignItems: 'center', gap: 4, background: STATUS[cs].soft, color: STATUS[cs].color, borderRadius: 7, padding: '4px 8px', fontSize: 11, fontWeight: 700 }}>
                  <Icon name={CRITERIA_ICON[c.id]} size={13} />{val}/{c.max}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--surface-3)' }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-3)' }}>
            <span><b style={{ color: 'var(--text-2)' }}>{j.metrics.articles}</b> maqola</span>
            <span><b style={{ color: 'var(--text-2)' }}>{j.metrics.editions}</b> son</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: j.lastUpdateDays < 30 ? 'var(--green)' : j.lastUpdateDays < 60 ? 'var(--yellow)' : 'var(--red)' }}>{j.lastUpdateLabel}</span>
        </div>
      </div>
    </div>
  );
}

function JournalsTable({ list, groupView, groupCriteria, onOpenJournal }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: groupView === 'overview' ? 1080 : 720 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              <th style={{ ...thS, textAlign: 'left', width: 30 }}>#</th>
              <th style={{ ...thS, textAlign: 'left', minWidth: 240 }}>Jurnal nomi</th>
              <th style={{ ...thS, minWidth: 92 }}>Status / Ball</th>
              {groupView === 'overview' ? (
                <>
                  {GROUPS.map((g) => (
                    <th key={g.id} style={{ ...thS, minWidth: 100 }} title={g.hint}>
                      <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}><Icon name={GROUP_ICON[g.id]} size={16} /><span style={{ fontSize: 10 }}>{g.short}</span></span>
                    </th>
                  ))}
                  <th style={{ ...thS, minWidth: 84 }}>Trend</th>
                </>
              ) : (
                groupCriteria.map((c) => (
                  <th key={c.id} style={{ ...thS, width: 44 }} title={c.name}><span style={{ display: 'inline-flex', justifyContent: 'center' }}><Icon name={CRITERIA_ICON[c.id]} size={16} /></span></th>
                ))
              )}
              <th style={{ ...thS, minWidth: 96 }}>Oxirgi faollik</th>
              <th style={{ ...thS, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((j, i) => {
              const st = statusFromScore(j.total);
              return (
                <tr key={j.id} onClick={() => onOpenJournal(j)} style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...tdS, color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                  <td style={tdS}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{ width: 4, height: 32, borderRadius: 3, background: st.color, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: st.color }}>{j.total}<span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>/100</span></div>
                      <StatusPill status={st.id} size="sm" />
                    </div>
                  </td>
                  {groupView === 'overview' ? (
                    <>
                      {GROUPS.map((g) => (
                        <td key={g.id} style={{ ...tdS, textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 6, background: 'var(--surface-3)', justifyContent: 'center' }}>
                            <StatusDot status={j.groupStatus[g.id]} size={7} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>{j.groupScore[g.id]}/{j.groupMax[g.id]}</span>
                          </div>
                        </td>
                      ))}
                      <td style={{ ...tdS, textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><Sparkline data={j.trend} color={st.color} width={70} height={24} /></div></td>
                    </>
                  ) : (
                    groupCriteria.map((c) => {
                      const val = j.scores[c.id]; const ratio = val / c.max;
                      const cs = ratio >= 0.7 ? 'green' : ratio >= 0.4 ? 'yellow' : 'red';
                      return <td key={c.id} style={{ ...tdS, textAlign: 'center' }}><CriteriaCell status={cs} value={val} max={c.max} title={c.name} /></td>;
                    })
                  )}
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: j.lastUpdateDays < 30 ? 'var(--green)' : j.lastUpdateDays < 60 ? 'var(--yellow)' : 'var(--red)' }}>{j.lastUpdateLabel}</span>
                  </td>
                  <td style={{ ...tdS, textAlign: 'center' }}><span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronRight" size={15} /></span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thS = { padding: '11px 9px', fontSize: 10.5, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', whiteSpace: 'nowrap' };
const tdS = { padding: '10px 9px', verticalAlign: 'middle' };
