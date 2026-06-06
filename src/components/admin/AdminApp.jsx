import { useState } from 'react';
import { isAuthenticated, logout } from '../../services/auth';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';
import '../../styles/Admin.css';

function AdminApp() {
  const [authed, setAuthed] = useState(isAuthenticated());

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />;
  }

  return <AdminPage onLogout={handleLogout} />;
}

export default AdminApp;
