import { useEffect, useMemo, useState } from 'react';
import { JOURNALS, summarize } from '../data/journals';
import { CRITERIA, GROUPS, STATUS, statusFromScore } from '../data/criteria';
import { StatusPill, StatusDot, CriteriaCell, Sparkline } from './ui';
import KpiCard from './KpiCard';
import JournalDrawer from './JournalDrawer';
import Icon, { CRITERIA_ICON, GROUP_ICON } from './Icon';
import CriteriaStatCard from './CriteriaStatCard';
import CategoryDetailView from './CategoryDetailView';

function GroupBadge({ status, label }) {
  const s = STATUS[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 7, background: s.soft }}>
      <StatusDot status={status} size={7} />
      <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{label}</span>
    </div>
  );
}

export default function MonitoringPage() {
  const initialView = ['data', 'tools', 'activity'].includes(
    typeof window !== 'undefined' ? window.location.hash.replace('#view=', '') : ''
  ) ? window.location.hash.replace('#view=', '') : 'overview';
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupView, setGroupView] = useState(initialView); // overview | data | tools | activity
  const [search, setSearch] = useState('');
  const initialJournal = (() => {
    if (typeof window === 'undefined') return null;
    const m = window.location.hash.match(/journal=(\d+)/);
    return m ? JOURNALS.find((j) => j.id === Number(m[1])) || null : null;
  })();
  const [selected, setSelected] = useState(initialJournal);
  const initialCategory = (() => {
    if (typeof window === 'undefined') return null;
    const m = window.location.hash.match(/catalog=(\w+)/);
    return m ? GROUPS.find((g) => g.id === m[1]) || null : null;
  })();
  const [categoryView, setCategoryView] = useState(initialCategory); // ochilgan kategoriya guruhi
  const [sortBy, setSortBy] = useState('total');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const summary = useMemo(() => summarize(JOURNALS), []);

  // Har bir kriteriya guruhi bo'yicha yashil/sariq/qizil taqsimot
  const groupBreakdown = useMemo(() => {
    const out = {};
    GROUPS.forEach((g) => { out[g.id] = { green: 0, yellow: 0, red: 0 }; });
    JOURNALS.forEach((j) => {
      GROUPS.forEach((g) => { out[g.id][j.groupStatus[g.id]] += 1; });
    });
    return out;
  }, []);

  useEffect(() => {
    const next = groupView === 'overview' ? '' : `#view=${groupView}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next || window.location.pathname);
    }
  }, [groupView]);

  const filtered = useMemo(() => {
    let list = JOURNALS.filter((j) => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false;
      if (search && !j.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'total') return b.total - a.total;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'articles') return b.metrics.articles - a.metrics.articles;
      return 0;
    });
    return list;
  }, [statusFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const activeGroup = GROUPS.find((g) => g.id === groupView);
  const groupCriteria = activeGroup ? CRITERIA.filter((c) => c.group === activeGroup.id) : CRITERIA;

  return (
    <div style={{ padding: '22px 26px 40px', animation: 'fadeUp 0.4s ease' }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            Jurnallar faolligi monitoringi
            <span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="info" size={17} /></span>
          </h1>
          <p style={{ margin: '5px 0 0', color: 'var(--text-2)', fontSize: 13.5 }}>
            Platformadagi jurnallar faolligi va sifat ko'rsatkichlari bo'yicha kompleks baho
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>
            <Icon name="calendar" size={16} /> 2026-yil holatiga
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--blue)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Icon name="download" size={16} /> Hisobotni yuklash
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 22 }}>
        <KpiCard variant="blue" title="Jami jurnallar" subtitle="Umumiy soni" index={0}
          value={summary.total} percent={100} />
        <KpiCard variant="green" title="Yaxshi" subtitle="Faol jurnallar" index={1}
          value={summary.green} total={summary.total} percent={Math.round((summary.green / summary.total) * 100)}
          trend={[40,45,52,58,60,66,70,74,80,85,88,92]}
          active={statusFilter === 'green'} onClick={() => { setStatusFilter(statusFilter === 'green' ? 'all' : 'green'); setPage(1); }} />
        <KpiCard variant="yellow" title="O'rtacha" subtitle="O'rtacha faol jurnallar" index={2}
          value={summary.yellow} total={summary.total} percent={Math.round((summary.yellow / summary.total) * 100)}
          trend={[60,58,55,57,54,52,50,53,49,51,48,50]}
          active={statusFilter === 'yellow'} onClick={() => { setStatusFilter(statusFilter === 'yellow' ? 'all' : 'yellow'); setPage(1); }} />
        <KpiCard variant="red" title="Faol emas" subtitle="Faol bo'lmagan jurnallar" index={3}
          value={summary.red} total={summary.total} percent={Math.round((summary.red / summary.total) * 100)}
          trend={[30,28,32,26,29,24,27,22,25,20,23,18]}
          active={statusFilter === 'red'} onClick={() => { setStatusFilter(statusFilter === 'red' ? 'all' : 'red'); setPage(1); }} />
      </div>

      {/* Kriteriyalar bo'yicha umumiy ko'rsatkichlar */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="chart" size={18} /> Kriteriyalar bo'yicha umumiy ko'rsatkichlar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
          {GROUPS.map((g, i) => (
            <CriteriaStatCard
              key={g.id}
              index={i}
              group={g}
              breakdown={groupBreakdown[g.id]}
              total={summary.total}
              trend={[45,50,48,55,60,58,66,70,68,75,80,85].map((v) => v - i * 6)}
              onView={() => setCategoryView(g)}
            />
          ))}
        </div>
      </div>

      {/* Group view tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[{ id: 'overview', icon: 'chart', short: "Umumiy ko'rinish" }, ...GROUPS.map((g) => ({ id: g.id, icon: GROUP_ICON[g.id], short: g.short }))].map((g) => {
          const on = groupView === g.id;
          return (
            <button key={g.id} onClick={() => setGroupView(g.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10,
                background: on ? 'var(--text)' : 'var(--surface)', color: on ? '#fff' : 'var(--text-2)',
                border: '1px solid ' + (on ? 'var(--text)' : 'var(--border)'), fontSize: 13, fontWeight: 700,
                transition: 'all 0.15s', boxShadow: on ? 'var(--shadow)' : 'none',
              }}>
              <Icon name={g.icon} size={16} />{g.short}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div id="journals-table" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 0, background: 'var(--surface)', padding: 12, borderRadius: '14px 14px 0 0', border: '1px solid var(--border)', borderBottom: 'none', scrollMarginTop: 16 }}>
        <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: 'var(--surface-3)', borderRadius: 9 }}>
          <span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="search" size={16} /></span>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Jurnal nomini qidirish..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13.5, color: 'var(--text)' }} />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={selectStyle}>
          <option value="all">Barcha statuslar</option>
          <option value="green">🟢 Yaxshi</option>
          <option value="yellow">🟡 O'rtacha</option>
          <option value="red">🔴 Faol emas</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="total">Ball bo'yicha</option>
          <option value="name">Nom bo'yicha</option>
          <option value="articles">Maqola soni</option>
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 6px', fontSize: 12.5, color: 'var(--text-3)', fontWeight: 600 }}>
          Jami: <b style={{ color: 'var(--text)' }}>{filtered.length}</b> jurnal
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0 0 14px 14px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: groupView === 'overview' ? 1120 : 760 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <th style={{ ...thStyle, textAlign: 'left', width: 30 }}>#</th>
                <th style={{ ...thStyle, textAlign: 'left', minWidth: 240 }}>Jurnal nomi</th>
                <th style={{ ...thStyle, minWidth: 92 }}>Status / Ball</th>
                {groupView === 'overview' ? (
                  <>
                    {GROUPS.map((g) => (
                      <th key={g.id} style={{ ...thStyle, minWidth: 110 }} title={g.hint}>
                        <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                          <Icon name={GROUP_ICON[g.id]} size={16} />
                          <span style={{ fontSize: 10.5 }}>{g.short}</span>
                        </span>
                      </th>
                    ))}
                    <th style={{ ...thStyle, minWidth: 88 }}>Trend</th>
                  </>
                ) : (
                  groupCriteria.map((c) => (
                    <th key={c.id} style={{ ...thStyle, width: 46 }} title={`${c.name}: ${c.desc}`}>
                      <span style={{ display: 'inline-flex', justifyContent: 'center' }}><Icon name={CRITERIA_ICON[c.id]} size={16} /></span>
                    </th>
                  ))
                )}
                <th style={{ ...thStyle, minWidth: 96 }}>Oxirgi faollik</th>
                <th style={{ ...thStyle, width: 44 }}></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((j, i) => {
                const st = statusFromScore(j.total);
                return (
                  <tr key={j.id}
                    onClick={() => setSelected(j)}
                    style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: 'var(--text-3)', fontWeight: 700 }}>{(page - 1) * pageSize + i + 1}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 4, height: 34, borderRadius: 3, background: st.color, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: st.color }}>{j.total}<span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>/100</span></div>
                        <StatusPill status={st.id} size="sm" />
                      </div>
                    </td>
                    {groupView === 'overview' ? (
                      <>
                        {GROUPS.map((g) => (
                          <td key={g.id} style={{ ...tdStyle, textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <GroupBadge status={j.groupStatus[g.id]} label={`${j.groupScore[g.id]}/${j.groupMax[g.id]}`} />
                            </div>
                          </td>
                        ))}
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Sparkline data={j.trend} color={st.color} width={72} height={26} />
                          </div>
                        </td>
                      </>
                    ) : (
                      groupCriteria.map((c) => {
                        const val = j.scores[c.id];
                        const ratio = val / c.max;
                        const cs = ratio >= 0.7 ? 'green' : ratio >= 0.4 ? 'yellow' : 'red';
                        return (
                          <td key={c.id} style={{ ...tdStyle, textAlign: 'center' }}>
                            <CriteriaCell status={cs} value={val} max={c.max} title={c.name} />
                          </td>
                        );
                      })
                    )}
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: j.lastUpdateDays < 30 ? 'var(--green)' : j.lastUpdateDays < 60 ? 'var(--yellow)' : 'var(--red)' }}>
                        {j.lastUpdateLabel}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronRight" size={16} /></span>
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr><td colSpan={12} style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Jurnal topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderTop: '1px solid var(--surface-3)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} / {filtered.length} ta jurnal
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}><Icon name="chevronLeft" size={15} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={pageBtn(false, p === page)}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}><Icon name="chevronRight" size={15} /></button>
          </div>
        </div>
      </div>

      {/* Legend row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14, marginTop: 20 }}>
        <LegendCard />
        <ScoringCard />
        <CriticalRulesCard />
      </div>

      {selected && <JournalDrawer journal={selected} onClose={() => setSelected(null)} />}
      {categoryView && (
        <CategoryDetailView
          group={categoryView}
          onClose={() => setCategoryView(null)}
          onOpenJournal={(j) => setSelected(j)}
        />
      )}
    </div>
  );
}

function LegendCard() {
  const rows = [
    { s: 'green', t: 'Yaxshi (75-100 ball)', d: 'Jurnal platformadan faol foydalanmoqda' },
    { s: 'yellow', t: "O'rtacha (45-74 ball)", d: "Jurnal faol, lekin jarayonlar sust" },
    { s: 'red', t: 'Faol emas (0-44 ball)', d: 'Jurnal deyarli foydalanmayapti' },
  ];
  return (
    <div style={cardStyle}>
      <div style={cardTitle}><Icon name="palette" size={16} /> Status ranglari ma'nosi</div>
      {rows.map((r) => (
        <div key={r.s} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '9px 0', borderTop: '1px solid var(--surface-3)' }}>
          <div style={{ marginTop: 2 }}><StatusDot status={r.s} size={11} /></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: STATUS[r.s].color }}>{r.t}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{r.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoringCard() {
  const items = CRITERIA.map((c) => ({ n: c.name, p: c.max }));
  return (
    <div style={cardStyle}>
      <div style={cardTitle}><Icon name="calculator" size={16} /> Ball hisoblash kriteriyalari (100 ball)</div>
      <div style={{ maxHeight: 172, overflowY: 'auto' }}>
        {items.map((it) => (
          <div key={it.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid var(--surface-3)', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{it.n}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--blue)', whiteSpace: 'nowrap' }}>{it.p} ball</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 4, borderTop: '2px solid var(--surface-3)', fontWeight: 800, fontSize: 13 }}>
        <span>Jami</span><span style={{ color: 'var(--blue)' }}>100 ball</span>
      </div>
    </div>
  );
}

function CriticalRulesCard() {
  const rules = [
    { r: "Oxirgi 3 oyda maqola kiritilmasa", e: 'Maks. SARIQ', s: 'yellow' },
    { r: 'Oxirgi 6 oyda umuman faollik bo\'lmasa', e: 'QIZIL', s: 'red' },
    { r: "Profil to'ldirilishi < 40% bo'lsa", e: 'QIZIL', s: 'red' },
    { r: "Antiplagiat / AI detektor ishlatilmasa", e: 'SARIQ / QIZIL', s: 'yellow' },
    { r: "Web-sayt/DOI olib ishlatilmasa", e: 'Ball kamayadi', s: 'yellow' },
    { r: 'Taqriz jarayoni buzilsa', e: 'Ball kamayadi', s: 'yellow' },
  ];
  return (
    <div style={cardStyle}>
      <div style={cardTitle}><Icon name="warn" size={16} /> Kritik qoidalar (avtomatik ta'sir qiladi)</div>
      {rules.map((r) => (
        <div key={r.r} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--surface-3)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', gap: 7, alignItems: 'center' }}>
            <StatusDot status={r.s} size={7} />{r.r}
          </span>
          <span style={{ fontSize: 11, fontWeight: 800, color: STATUS[r.s].color, whiteSpace: 'nowrap' }}>{r.e}</span>
        </div>
      ))}
    </div>
  );
}

const selectStyle = {
  padding: '9px 13px', background: 'var(--surface-3)', border: 'none', borderRadius: 9,
  fontSize: 13, color: 'var(--text-2)', fontWeight: 600, cursor: 'pointer', outline: 'none',
};
const thStyle = {
  padding: '12px 10px', fontSize: 11, fontWeight: 800, color: 'var(--text-3)',
  textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', whiteSpace: 'nowrap',
};
const tdStyle = { padding: '11px 10px', verticalAlign: 'middle' };
const cardStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
  padding: '16px 18px', boxShadow: 'var(--shadow-sm)',
};
const cardTitle = { fontSize: 13.5, fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 };

function pageBtn(disabled, active) {
  return {
    minWidth: 32, height: 32, borderRadius: 8, fontSize: 13, fontWeight: 700,
    background: active ? 'var(--blue)' : 'var(--surface-3)',
    color: active ? '#fff' : disabled ? 'var(--text-3)' : 'var(--text-2)',
    opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer',
  };
}
