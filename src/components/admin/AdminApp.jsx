import { useState } from 'react';
import { isAuthenticated, logout, getSession } from '../../services/auth';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';
import AdminLogsPage from './AdminLogsPage';
import AdminClientesPage from './AdminClientesPage';
import AdminProductosPage from './AdminProductosPage';
import '../../styles/Admin.css';

const TABS = [
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'productos', label: 'Productos' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'logs', label: 'Logs WhatsApp' },
];

function AdminApp() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [view, setView] = useState('pedidos');
  const session = getSession();

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />;
  }

  return (
    <div className="admin">
      <header className="admin__topbar">
        <div className="admin__brand">
          <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="admin__logo" />
          <span className="admin__title">Admin</span>
        </div>

        <nav className="admin__nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`admin__nav-link${view === t.key ? ' admin__nav-link--active' : ''}`}
              onClick={() => setView(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin__user">
          <span className="admin__user-name">
            {session?.username} · {session?.role}
          </span>
          <button type="button" className="admin__logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {view === 'pedidos' && <AdminPage onSessionExpired={handleLogout} />}
      {view === 'productos' && <AdminProductosPage onSessionExpired={handleLogout} />}
      {view === 'clientes' && <AdminClientesPage onSessionExpired={handleLogout} />}
      {view === 'logs' && <AdminLogsPage onSessionExpired={handleLogout} />}
    </div>
  );
}

export default AdminApp;
