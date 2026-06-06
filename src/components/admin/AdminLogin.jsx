import { useState } from 'react';
import { login } from '../../services/auth';

function AdminLogin({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = await login(username.trim(), password);
      onLoggedIn(session);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="admin-login__logo" />
        <h1 className="admin-login__title">Portal administrativo</h1>
        <p className="admin-login__subtitle">Ingresa tus credenciales para continuar</p>

        <label className="admin-login__field">
          <span>Usuario</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            autoFocus
          />
        </label>

        <label className="admin-login__field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="admin-login__error">{error}</p>}

        <button type="submit" className="admin-login__submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
