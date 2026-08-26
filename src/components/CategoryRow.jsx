import { useState } from 'react';
import Icon from './Icon';
import { STATUS } from '../data/criteria';
import { journalsByCategoryStatus, categoryBreakdown } from '../data/categories';
import { StatusPill, Sparkline } from './ui';

// To'liq kenglikdagi kengayuvchi kategoriya qatori.
// Statusga bosilsa shu yerning o'zida jurnallar ro'yxati ochiladi.
export default function CategoryRow({ index, category, onOpenJournal }) {
  const [openStatus, setOpenStatus] = useState(null); // 'green'|'yellow'|'red'|'all'|null
  const bd = categoryBreakdown(category.id);
  const total = bd.total;
  const pct = (v) => (total ? (v / total) * 100 : 0);

  const chips = [
    { key: 'green', label: 'Yaxshi', v: bd.green, color: '#16a34a', bg: '#dcfce7', dot: '#22c55e', grad: 'linear-gradient(90deg,#22c55e,#16a34a)' },
    { key: 'yellow', label: "O'rtacha", v: bd.yellow, color: '#d97706', bg: '#fef3c7', dot: '#f59e0b', grad: 'linear-gradient(90deg,#fbbf24,#f59e0b)' },
    { key: 'red', label: 'Faol emas', v: bd.red, color: '#dc2626', bg: '#fee2e2', dot: '#ef4444', grad: 'linear-gradient(90deg,#f87171,#ef4444)' },
  ];

  const toggle = (key) => setOpenStatus((cur) => (cur === key ? null : key));
  const list = openStatus ? journalsByCategoryStatus(category.id, openStatus) : [];

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 16,
      animation: `fadeUp 0.45s ease ${index * 0.06}s both`,
    }}>
      {/* Top strip: category + status chips */}
      <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
        {/* Left: gradient category badge */}
        <div style={{ background: category.grad, color: '#fff', padding: '20px 24px', minWidth: 300, flex: '1 1 320px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -25, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', right: 40, bottom: -30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
            <div style={{ width: 52, height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
              <Icon name={category.icon} size={26} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>{index + 1}-KATEGORIYA</div>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, marginTop: 2 }}>{category.title}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 12, position: 'relative', lineHeight: 1.45, maxWidth: 460 }}>{category.hint}</div>
          {/* stacked bar */}
          <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', gap: 3, marginTop: 14, position: 'relative', maxWidth: 460 }}>
            <div style={{ width: `${pct(bd.green)}%`, background: 'rgba(255,255,255,0.95)', borderRadius: 4 }} />
            <div style={{ width: `${pct(bd.yellow)}%`, background: 'rgba(255,255,255,0.6)', borderRadius: 4 }} />
            <div style={{ width: `${pct(bd.red)}%`, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
          </div>
        </div>

        {/* Right: 3 clickable status chips */}
        <div style={{ display: 'flex', gap: 12, padding: '18px 24px', flex: '2 1 480px', alignItems: 'center', flexWrap: 'wrap' }}>
          {chips.map((c) => {
            const active = openStatus === c.key;
            return (
              <button key={c.key} onClick={() => toggle(c.key)}
                style={{
                  flex: '1 1 140px', minWidth: 140, textAlign: 'left', padding: '14px 16px', borderRadius: 8,
                  background: active ? c.bg : 'var(--surface-2)',
                  border: `2px solid ${active ? c.color : 'transparent'}`,
                  transition: 'all 0.15s', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = c.bg; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{c.label}</span>
                  <span style={{ marginLeft: 'auto', display: 'inline-flex', color: c.color, transform: active ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}><Icon name="chevronRight" size={16} /></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.v}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600 }}>ta · {pct(c.v).toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct(c.v)}%`, background: c.grad, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded journal list (in-place) */}
      {openStatus && (
        <div style={{ borderTop: '1px solid var(--surface-3)', background: 'var(--surface-2)', animation: 'fadeUp 0.25s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700 }}>
              <StatusPill status={openStatus === 'all' ? 'green' : openStatus} size="sm">
                {openStatus === 'all' ? 'Barchasi' : STATUS[openStatus].label}
              </StatusPill>
              <span style={{ color: 'var(--text-3)' }}>{list.length} ta jurnal · {category.title}</span>
            </div>
            <button onClick={() => setOpenStatus(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: 'var(--text-3)', padding: '6px 10px', borderRadius: 8, background: 'var(--surface-3)' }}>
              <Icon name="x" size={14} /> Yopish
            </button>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 440, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ background: 'var(--surface-3)' }}>
                  <th style={{ ...thS, textAlign: 'left', width: 34 }}>#</th>
                  <th style={{ ...thS, textAlign: 'left', minWidth: 260 }}>Jurnal nomi</th>
                  <th style={{ ...thS, minWidth: 140 }}>{category.short} holati</th>
                  <th style={{ ...thS, minWidth: 130 }}>Ko'rsatkich</th>
                  <th style={{ ...thS, minWidth: 84 }}>Trend</th>
                  <th style={{ ...thS, minWidth: 96 }}>Oxirgi faollik</th>
                  <th style={{ ...thS, width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.map((j, i) => {
                  const cat = j.cats[category.id];
                  const sc = STATUS[cat.status];
                  return (
                    <tr key={j.id} onClick={() => onOpenJournal(j.id)} style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer', background: 'var(--surface)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}>
                      <td style={{ ...tdS, color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                      <td style={tdS}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          <div style={{ width: 4, height: 30, borderRadius: 3, background: sc.color, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700, maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{j.issn ? `ISSN: ${j.issn}` : j.studyField}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                          <StatusPill status={cat.status} size="sm" />
                          <div style={{ width: 100, height: 6, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${cat.pct}%`, background: sc.color, borderRadius: 4 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdS, textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--text-2)' }}>{category.metric(cat)}</td>
                      <td style={{ ...tdS, textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><Sparkline data={j.trend} color={sc.color} width={64} height={22} /></div></td>
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
      )}
    </div>
  );
}

const thS = { padding: '10px 10px', fontSize: 10.5, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', whiteSpace: 'nowrap' };
const tdS = { padding: '9px 10px', verticalAlign: 'middle' };
