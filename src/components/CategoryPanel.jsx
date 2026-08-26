import { useMemo, useState } from 'react';
import { journalsByCategoryStatus, categoryBreakdown } from '../data/categories';
import { STATUS } from '../data/criteria';
import { StatusPill, Sparkline } from './ui';
import Icon from './Icon';

const STATUS_META = {
  all: { label: 'Barcha jurnallar', color: '#1e293b' },
  green: { label: 'Yaxshi', color: '#16a34a' },
  yellow: { label: "O'rtacha", color: '#d97706' },
  red: { label: 'Faol emas', color: '#dc2626' },
};

export default function CategoryPanel({ category, initialStatus = 'all', onClose, onOpenJournal }) {
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState('');

  const counts = useMemo(() => categoryBreakdown(category.id), [category.id]);
  const list = useMemo(() => {
    let arr = journalsByCategoryStatus(category.id, statusFilter);
    if (search) arr = arr.filter((j) => j.name.toLowerCase().includes(search.toLowerCase()) || j.studyField.toLowerCase().includes(search.toLowerCase()));
    return arr;
  }, [category.id, statusFilter, search]);

  const meta = STATUS_META[statusFilter];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--surface-3)', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: category.grad, color: '#fff', padding: '18px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 60, top: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
            <Icon name="chevronLeft" size={16} /> Orqaga
          </button>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={category.icon} size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>{category.title.toUpperCase()} · KATEGORIYA</div>
            <h1 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800 }}>{statusFilter === 'all' ? 'Barcha jurnallar' : `${meta.label} jurnallar`}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ l: 'Yaxshi', v: counts.green }, { l: "O'rtacha", v: counts.yellow }, { l: 'Faol emas', v: counts.red }].map((t) => (
              <div key={t.l} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '8px 16px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{t.v}</div>
                <div style={{ fontSize: 10.5, opacity: 0.9 }}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: '12px 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-3)', borderRadius: 10 }}>
          <Icon name="search" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Jurnal yoki yo'nalish qidirish..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ id: 'all', l: 'Barchasi', c: 'var(--text)' }, { id: 'green', l: 'Yaxshi', c: '#16a34a' }, { id: 'yellow', l: "O'rtacha", c: '#d97706' }, { id: 'red', l: 'Faol emas', c: '#dc2626' }].map((f) => {
            const on = statusFilter === f.id;
            return (
              <button key={f.id} onClick={() => setStatusFilter(f.id)}
                style={{ padding: '9px 15px', borderRadius: 9, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7,
                  background: on ? f.c : 'var(--surface-3)', color: on ? '#fff' : 'var(--text-2)' }}>
                {f.id !== 'all' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: on ? '#fff' : f.c }} />}
                {f.l}
                <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 7px', borderRadius: 6, background: on ? 'rgba(255,255,255,0.25)' : 'var(--surface)', color: on ? '#fff' : 'var(--text-3)' }}>{f.id === 'all' ? counts.total : counts[f.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ ...thS, textAlign: 'left', width: 30 }}>#</th>
                  <th style={{ ...thS, textAlign: 'left', minWidth: 260 }}>Jurnal nomi</th>
                  <th style={{ ...thS, minWidth: 130 }}>{category.short} holati</th>
                  <th style={{ ...thS, minWidth: 150 }}>Ko'rsatkich</th>
                  <th style={{ ...thS, minWidth: 90 }}>Trend</th>
                  <th style={{ ...thS, minWidth: 96 }}>Oxirgi faollik</th>
                  <th style={{ ...thS, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.map((j, i) => {
                  const cat = j.cats[category.id];
                  const sc = STATUS[cat.status];
                  return (
                    <tr key={j.id} onClick={() => onOpenJournal(j.id)} style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...tdS, color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                      <td style={tdS}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{ width: 4, height: 32, borderRadius: 3, background: sc.color, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                          <StatusPill status={cat.status} size="sm" />
                          <div style={{ width: 90, height: 6, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${cat.pct}%`, background: sc.color, borderRadius: 4 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)' }}>{category.metric(cat)}</td>
                      <td style={{ ...tdS, textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><Sparkline data={j.trend} color={sc.color} width={70} height={24} /></div></td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: j.lastUpdateDays < 30 ? 'var(--green)' : j.lastUpdateDays < 60 ? 'var(--yellow)' : 'var(--red)' }}>{j.lastUpdateLabel}</span>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}><span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronRight" size={15} /></span></td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 50, textAlign: 'center', color: 'var(--text-3)' }}>Jurnal topilmadi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const thS = { padding: '11px 10px', fontSize: 10.5, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', whiteSpace: 'nowrap' };
const tdS = { padding: '10px 10px', verticalAlign: 'middle' };
