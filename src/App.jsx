import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MonitoringPage from './components/MonitoringPage';
import Icon from './components/Icon';

function TopBar() {
  return (
    <header style={{
      height: 60, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 26px', position: 'sticky', top: 0, zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-3)', fontSize: 13 }}>
        <span>Jurnallar</span>
        <span>/</span>
        <span style={{ color: 'var(--text)', fontWeight: 700 }}>Faollik monitoringi</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ position: 'relative', color: 'var(--text-2)', display: 'inline-flex' }}>
          <Icon name="bell" size={19} />
          <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'var(--red)', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>
        <div style={{ width: 1, height: 26, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>A</div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Super Admin</div>
          </div>
          <span style={{ color: 'var(--text-3)', display: 'inline-flex' }}><Icon name="chevronDown" size={15} /></span>
        </div>
      </div>
    </header>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>🚧</div>
      <h2 style={{ margin: 0, color: 'var(--text-2)' }}>{title}</h2>
      <p>Bu bo'lim demo doirasida hozircha ochilmagan.</p>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('monitoring');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-3)' }}>
      <Sidebar active={active} onNavigate={setActive} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ flex: 1 }}>
          {active === 'monitoring' ? <MonitoringPage /> : <Placeholder title={labelFor(active)} />}
        </div>
      </main>
    </div>
  );
}

function labelFor(id) {
  const map = {
    dashboard: 'Bosh sahifa', 'journals-list': "Jurnallar ro'yxati",
    applications: 'Arizalar', articles: 'Maqolalar', publishers: 'Nashriyot / Sonlar',
    users: 'Foydalanuvchilar', payments: "To'lovlar", statistics: 'Statistika',
    messages: 'Xabarlar', settings: 'Sozlamalar', logs: 'Tizim loglari',
  };
  return map[id] || 'Bo\'lim';
}
