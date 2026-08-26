import { useState } from 'react';
import Icon from './Icon';

const NAV = [
  { id: 'dashboard', icon: 'home', label: 'Bosh sahifa' },
  {
    id: 'journals',
    icon: 'book',
    label: 'Jurnallar',
    children: [
      { id: 'journals-list', label: "Jurnallar ro'yxati" },
      { id: 'monitoring', label: 'Faollik monitoringi' },
    ],
  },
  { id: 'applications', icon: 'fileText', label: 'Arizalar' },
  { id: 'articles', icon: 'file', label: 'Maqolalar' },
  { id: 'publishers', icon: 'building', label: 'Nashriyot / Sonlar' },
  { id: 'users', icon: 'users', label: 'Foydalanuvchilar' },
  { id: 'payments', icon: 'card', label: "To'lovlar" },
  { id: 'statistics', icon: 'chart', label: 'Statistika' },
  { id: 'messages', icon: 'mail', label: 'Xabarlar' },
  { id: 'settings', icon: 'settings', label: 'Sozlamalar' },
  { id: 'logs', icon: 'logs', label: 'Tizim loglari' },
];

export default function Sidebar({ active, onNavigate }) {
  const [open, setOpen] = useState({ journals: true });

  return (
    <aside
      style={{
        width: 246,
        flexShrink: 0,
        background: 'var(--sidebar)',
        color: '#cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          }}
        ><Icon name="book" size={19} /></div>
        <div style={{ fontWeight: 800, letterSpacing: 0.4, fontSize: 15, color: '#fff' }}>
          ADMIN<span style={{ color: '#60a5fa' }}>.SLIB</span>.UZ
        </div>
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '0 0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#93c5fd' }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Admin</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Super Admin</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 20px' }}>
        {NAV.map((item) => {
          const isActiveParent = item.children?.some((c) => c.id === active);
          const isActive = active === item.id;
          const expanded = open[item.id];
          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) setOpen((o) => ({ ...o, [item.id]: !o[item.id] }));
                  else onNavigate(item.id);
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                  padding: '9px 11px', borderRadius: 9, marginBottom: 2,
                  color: isActive || isActiveParent ? '#fff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg,#2563eb,#1d4ed8)' : 'transparent',
                  fontSize: 13.5, fontWeight: isActive ? 700 : 500, textAlign: 'left',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ width: 20, display: 'inline-flex', justifyContent: 'center' }}><Icon name={item.icon} size={18} /></span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.children && <span style={{ display: 'inline-flex', opacity: 0.7, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><Icon name="chevronDown" size={14} /></span>}
              </button>
              {item.children && expanded && (
                <div style={{ marginLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 8, marginBottom: 4 }}>
                  {item.children.map((c) => {
                    const ca = active === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onNavigate(c.id)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '8px 11px', borderRadius: 8,
                          color: ca ? '#60a5fa' : '#94a3b8', background: ca ? 'rgba(37,99,235,0.14)' : 'transparent',
                          fontSize: 13, fontWeight: ca ? 700 : 500, marginBottom: 2,
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                        onMouseEnter={(e) => { if (!ca) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { if (!ca) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: ca ? '#60a5fa' : '#475569' }} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '12px 18px', fontSize: 11, color: '#475569', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        2026 © S-LIB.UZ
      </div>
    </aside>
  );
}
