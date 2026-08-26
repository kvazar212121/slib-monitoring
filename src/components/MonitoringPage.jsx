import { useEffect, useMemo, useState } from 'react';
import { JOURNALS, summarize } from '../data/journals';
import { CRITERIA, GROUPS, STATUS, statusFromScore } from '../data/criteria';
import { StatusPill, StatusDot, CriteriaCell, Sparkline } from './ui';
import KpiCard from './KpiCard';
import JournalDrawer from './JournalDrawer';
import Icon, { CRITERIA_ICON, GROUP_ICON } from './Icon';
import CriteriaStatCard from './CriteriaStatCard';
import CategoryDetailView from './CategoryDetailView';
import JournalsPanel from './JournalsPanel';

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
  const [journalsPanel, setJournalsPanel] = useState(null); // 'all'|'green'|'yellow'|'red' yoki null
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
          value={summary.total} percent={100}
          onClick={() => setJournalsPanel('all')} />
        <KpiCard variant="green" title="Yaxshi" subtitle="Faol jurnallar" index={1}
          value={summary.green} total={summary.total} percent={Math.round((summary.green / summary.total) * 100)}
          active={false} onClick={() => setJournalsPanel('green')} />
        <KpiCard variant="yellow" title="O'rtacha" subtitle="O'rtacha faol jurnallar" index={2}
          value={summary.yellow} total={summary.total} percent={Math.round((summary.yellow / summary.total) * 100)}
          active={false} onClick={() => setJournalsPanel('yellow')} />
        <KpiCard variant="red" title="Faol emas" subtitle="Faol bo'lmagan jurnallar" index={3}
          value={summary.red} total={summary.total} percent={Math.round((summary.red / summary.total) * 100)}
          active={false} onClick={() => setJournalsPanel('red')} />
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
      {journalsPanel && (
        <JournalsPanel
          initialStatus={journalsPanel}
          onClose={() => setJournalsPanel(null)}
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
