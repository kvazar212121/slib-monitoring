import { useMemo, useState } from 'react';
import { JOURNALS } from '../data/journals';
import { CRITERIA, STATUS } from '../data/criteria';
import { StatusPill, Sparkline } from './ui';
import Icon, { CRITERIA_ICON, GROUP_ICON } from './Icon';

// Kategoriya (fan yo'nalishi) bo'yicha jurnallarni alohida oynada ko'rish
export default function CategoryDetailView({ group, onClose, onOpenJournal }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null); // ochilgan kategoriya
  const [sortBy, setSortBy] = useState('score');

  const groupCriteria = CRITERIA.filter((c) => c.group === group.id);

  // Jurnallarni fan yo'nalishi bo'yicha guruhlash
  const categories = useMemo(() => {
    const map = {};
    JOURNALS.forEach((j) => {
      const key = j.studyField;
      if (!map[key]) map[key] = [];
      // guruhga xos ball asosida holat
      const gStatus = j.groupStatus[group.id];
      const gScore = j.groupScore[group.id];
      const gMax = j.groupMax[group.id];
      map[key].push({ ...j, gStatus, gScore, gMax });
    });
    let arr = Object.entries(map).map(([name, items]) => {
      const green = items.filter((i) => i.gStatus === 'green').length;
      const yellow = items.filter((i) => i.gStatus === 'yellow').length;
      const red = items.filter((i) => i.gStatus === 'red').length;
      const avg = Math.round(items.reduce((s, i) => s + (i.gScore / i.gMax) * 100, 0) / items.length);
      return { name, items, green, yellow, red, total: items.length, avg };
    });
    arr.sort((a, b) => (sortBy === 'score' ? b.avg - a.avg : sortBy === 'count' ? b.total - a.total : a.name.localeCompare(b.name)));
    return arr;
  }, [group.id, sortBy]);

  const filteredCats = useMemo(() => {
    return categories
      .map((cat) => {
        let items = cat.items;
        if (statusFilter !== 'all') items = items.filter((i) => i.gStatus === statusFilter);
        if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || cat.name.toLowerCase().includes(search.toLowerCase()));
        return { ...cat, visibleItems: items };
      })
      .filter((cat) => cat.visibleItems.length > 0);
  }, [categories, statusFilter, search]);

  const grandTotal = JOURNALS.length;
  const totals = useMemo(() => {
    const g = JOURNALS.filter((j) => j.groupStatus[group.id] === 'green').length;
    const y = JOURNALS.filter((j) => j.groupStatus[group.id] === 'yellow').length;
    const r = JOURNALS.filter((j) => j.groupStatus[group.id] === 'red').length;
    return { g, y, r };
  }, [group.id]);

  const GRAD = { data: 'linear-gradient(135deg,#0ea5e9,#2563eb)', tools: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', activity: 'linear-gradient(135deg,#f59e0b,#ea580c)' }[group.id];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'var(--surface-3)', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: GRAD, color: '#fff', padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: 40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 10, background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
          <Icon name="chevronLeft" size={16} /> Orqaga
        </button>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={GROUP_ICON[group.id]} size={24} />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4 }}>KATEGORIYALAR BO'YICHA KATALOG</div>
          <h1 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800 }}>{group.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
          {[{ l: 'Yaxshi', v: totals.g, c: '#dcfce7' }, { l: "O'rtacha", v: totals.y, c: '#fef3c7' }, { l: 'Faol emas', v: totals.r, c: '#fee2e2' }].map((t) => (
            <div key={t.l} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '8px 16px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{t.v}</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>{t.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: '14px 28px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--surface-3)', borderRadius: 10 }}>
          <Icon name="search" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kategoriya yoki jurnal qidirish..."
            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ id: 'all', l: 'Barchasi' }, { id: 'green', l: 'Yaxshi' }, { id: 'yellow', l: "O'rtacha" }, { id: 'red', l: 'Faol emas' }].map((f) => {
            const on = statusFilter === f.id;
            const col = f.id === 'green' ? '#16a34a' : f.id === 'yellow' ? '#d97706' : f.id === 'red' ? '#dc2626' : 'var(--text)';
            return (
              <button key={f.id} onClick={() => setStatusFilter(f.id)}
                style={{ padding: '9px 14px', borderRadius: 9, fontSize: 13, fontWeight: 700,
                  background: on ? col : 'var(--surface-3)', color: on ? '#fff' : 'var(--text-2)',
                  display: 'flex', alignItems: 'center', gap: 6 }}>
                {f.id !== 'all' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: on ? '#fff' : col }} />}
                {f.l}
              </button>
            );
          })}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 13px', background: 'var(--surface-3)', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>
          <option value="score">Reyting bo'yicha</option>
          <option value="count">Jurnal soni bo'yicha</option>
          <option value="name">Nom bo'yicha</option>
        </select>
      </div>

      {/* Sub-criteria legend */}
      <div style={{ padding: '10px 28px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-3)' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-2)' }}>Bu guruh kriteriyalari:</span>
        {groupCriteria.map((c) => (
          <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name={CRITERIA_ICON[c.id]} size={14} /> {c.name}
          </span>
        ))}
      </div>

      {/* Categories list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
          {filteredCats.map((cat, ci) => {
            const isOpen = expanded === cat.name;
            const catStatus = cat.avg >= 70 ? 'green' : cat.avg >= 45 ? 'yellow' : 'red';
            return (
              <div key={cat.name} style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', animation: `fadeUp 0.4s ease ${ci * 0.04}s both`, gridColumn: isOpen ? '1 / -1' : 'auto' }}>
                {/* Category header */}
                <button onClick={() => setExpanded(isOpen ? null : cat.name)}
                  style={{ width: '100%', textAlign: 'left', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0 }}>
                    <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="26" cy="26" r="22" fill="none" stroke="var(--surface-3)" strokeWidth="5" />
                      <circle cx="26" cy="26" r="22" fill="none" stroke={STATUS[catStatus].color} strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - cat.avg / 100)} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: STATUS[catStatus].color }}>{cat.avg}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 800, lineHeight: 1.25 }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{cat.total} ta jurnal · o'rtacha {cat.avg}/100</div>
                    <div style={{ display: 'flex', height: 6, borderRadius: 4, overflow: 'hidden', gap: 2, marginTop: 8 }}>
                      <div style={{ width: `${(cat.green / cat.total) * 100}%`, background: '#22c55e' }} />
                      <div style={{ width: `${(cat.yellow / cat.total) * 100}%`, background: '#f59e0b' }} />
                      <div style={{ width: `${(cat.red / cat.total) * 100}%`, background: '#ef4444' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <span style={badge('#16a34a', '#dcfce7')}>{cat.green}</span>
                      <span style={badge('#d97706', '#fef3c7')}>{cat.yellow}</span>
                      <span style={badge('#dc2626', '#fee2e2')}>{cat.red}</span>
                    </div>
                    <span style={{ color: 'var(--text-3)', display: 'inline-flex', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><Icon name="chevronDown" size={16} /></span>
                  </div>
                </button>

                {/* Expanded journal list */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--surface-3)', background: 'var(--surface-2)' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
                        <thead>
                          <tr style={{ background: 'var(--surface-3)' }}>
                            <th style={thS}>#</th>
                            <th style={{ ...thS, textAlign: 'left' }}>Jurnal</th>
                            <th style={thS}>Guruh bali</th>
                            {groupCriteria.map((c) => (
                              <th key={c.id} style={thS} title={c.name}><span style={{ display: 'inline-flex', justifyContent: 'center' }}><Icon name={CRITERIA_ICON[c.id]} size={15} /></span></th>
                            ))}
                            <th style={thS}>Trend</th>
                            <th style={thS}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.visibleItems.map((j, i) => (
                            <tr key={j.id} onClick={() => onOpenJournal(j)} style={{ borderTop: '1px solid var(--surface-3)', cursor: 'pointer' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ ...tdS, color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                              <td style={tdS}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                  <div style={{ width: 3, height: 26, borderRadius: 2, background: STATUS[j.gStatus].color }} />
                                  <div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.name}</div>
                                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{j.issn ? `ISSN: ${j.issn}` : `Umumiy: ${j.total}/100`}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...tdS, textAlign: 'center' }}>
                                <StatusPill status={j.gStatus} size="sm">{j.gScore}/{j.gMax}</StatusPill>
                              </td>
                              {groupCriteria.map((c) => {
                                const val = j.scores[c.id];
                                const ratio = val / c.max;
                                const cs = ratio >= 0.7 ? 'green' : ratio >= 0.4 ? 'yellow' : 'red';
                                return (
                                  <td key={c.id} style={{ ...tdS, textAlign: 'center' }}>
                                    <span title={`${c.name}: ${val}/${c.max}`} style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 7, background: STATUS[cs].soft, color: STATUS[cs].color, alignItems: 'center', justifyContent: 'center' }}>
                                      <Icon name={cs === 'green' ? 'check' : cs === 'yellow' ? 'warn' : 'x'} size={13} strokeWidth={2.6} />
                                    </span>
                                  </td>
                                );
                              })}
                              <td style={{ ...tdS, textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}><Sparkline data={j.trend} color={STATUS[j.gStatus].color} width={60} height={22} /></div>
                              </td>
                              <td style={{ ...tdS, textAlign: 'center' }}><span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronRight" size={15} /></span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredCats.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
              <Icon name="search" size={32} /><div style={{ marginTop: 8 }}>Hech narsa topilmadi</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function badge(color, bg) {
  return { minWidth: 22, padding: '2px 6px', borderRadius: 6, background: bg, color, fontSize: 11, fontWeight: 800, textAlign: 'center' };
}
const thS = { padding: '9px 8px', fontSize: 10.5, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center', whiteSpace: 'nowrap' };
const tdS = { padding: '9px 8px', verticalAlign: 'middle' };
