import { useMemo, useState } from 'react';
import { JOURNAL_CATEGORY } from '../data/categories';
import { Sparkline } from './ui';
import Icon from './Icon';

// Kichik stat kartasi bosilganda ochiladigan detal panel.
// Har bir stat uchun mos jurnallar ro'yxati generatsiya qilinadi.
const META = {
  newApps:  { title: 'Yangi arizalar', col: 'Arizalar', icon: 'inbox', grad: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', field: (j) => j.cats.workflow.detail.total, unit: 'ariza', total: '214', note: 'Bugun kelib tushgan' },
  reviewing:{ title: "Ko'rib chiqilayotgan", col: 'Kutilmoqda', icon: 'clock', grad: 'linear-gradient(135deg,#0ea5e9,#2563eb)', field: (j) => j.cats.workflow.detail.pending, unit: 'ariza', total: '356', note: "Ko'rib chiqilishni kutmoqda" },
  inReview: { title: 'Taqriz jarayonida', col: 'Taqrizda', icon: 'pen', grad: 'linear-gradient(135deg,#f59e0b,#ea580c)', field: (j) => Math.round(j.cats.workflow.detail.pending * 0.6), unit: 'maqola', total: '187', note: 'Taqrizchida turgan maqolalar' },
  articles: { title: 'Maqolalar soni', col: 'Maqola', icon: 'file', grad: 'linear-gradient(135deg,#16a34a,#15803d)', field: (j) => j.cats.activity.detail.articles, unit: 'maqola', total: '25 614', note: 'Jami chop etilgan maqolalar' },
  editions: { title: 'Nashrlar / Sonlar', col: 'Sonlar', icon: 'box', grad: 'linear-gradient(135deg,#6366f1,#4338ca)', field: (j) => j.cats.activity.detail.editions, unit: 'son', total: '4 321', note: 'Jami chiqarilgan sonlar' },
  admins:   { title: 'Faol adminlar', col: 'Adminlar', icon: 'users', grad: 'linear-gradient(135deg,#0d9488,#0f766e)', field: (j) => 1 + (j.id % 4), unit: 'admin', total: '412', note: 'Jurnallardagi faol adminlar' },
};

export default function StatDetailPanel({ statId, onClose, onOpenJournal }) {
  const meta = META[statId] || META.articles;
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    let arr = JOURNAL_CATEGORY.map((j) => ({ ...j, statValue: meta.field(j) }));
    arr.sort((a, b) => b.statValue - a.statValue);
    if (search) arr = arr.filter((j) => j.name.toLowerCase().includes(search.toLowerCase()) || j.studyField.toLowerCase().includes(search.toLowerCase()));
    return arr;
  }, [statId, search]);

  const sum = list.reduce((s, j) => s + j.statValue, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--surface-3)', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: meta.grad, color: '#fff', padding: '18px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 60, top: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
            <Icon name="chevronLeft" size={16} /> Orqaga
          </button>
          <div style={{ width: 46, height: 46, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={meta.icon} size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>STATISTIKA · TAFSILOT</div>
            <h1 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800 }}>{meta.title}</h1>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 2 }}>{meta.note}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 7, padding: '10px 18px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{meta.total}</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Jami</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 7, padding: '10px 18px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{list.length}</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Jurnal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: '12px 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-3)', borderRadius: 10 }}>
          <Icon name="search" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Jurnal qidirish..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 14 }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600 }}>Jurnallar kesimida: <b style={{ color: 'var(--text)' }}>{sum.toLocaleString()}</b> {meta.unit}</div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ ...thS, textAlign: 'left', width: 34 }}>#</th>
                  <th style={{ ...thS, textAlign: 'left', minWidth: 280 }}>Jurnal nomi</th>
                  <th style={{ ...thS, minWidth: 120 }}>{meta.col}</th>
                  <th style={{ ...thS, minWidth: 120 }}>Ulushi</th>
                  <th style={{ ...thS, minWidth: 90 }}>Trend</th>
                  <th style={{ ...thS, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.map((j, i) => {
                  const share = sum ? (j.statValue / sum) * 100 : 0;
                  return (
                    <tr key={j.id} onClick={() => onOpenJournal(j.id)} style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...tdS, color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                      <td style={tdS}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{j.statValue.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>{meta.unit}</span>
                      </td>
                      <td style={{ ...tdS }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 7, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                            <div style={{ height: '100%', width: `${Math.min(100, share * 3)}%`, background: 'var(--blue)', borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, minWidth: 34 }}>{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><Sparkline data={j.trend} color="#2563eb" width={64} height={22} /></div></td>
                      <td style={{ ...tdS, textAlign: 'center' }}><span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronRight" size={15} /></span></td>
                    </tr>
                  );
                })}
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
