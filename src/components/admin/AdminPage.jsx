import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchOrdenes } from '../../services/admin';
import { fetchProducts } from '../../services/api';
import { getSession, logout } from '../../services/auth';
import AdminOrderRow, { ESTADOS, ESTADO_META } from './AdminOrderRow';

const FILTROS = ['TODOS', ...ESTADOS];

function AdminPage({ onLogout }) {
  const session = getSession();
  const [ordenes, setOrdenes] = useState([]);
  const [products, setProducts] = useState({});
  const [filtro, setFiltro] = useState('TODOS');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const handleSessionExpired = useCallback(() => {
    logout();
    onLogout?.();
  }, [onLogout]);

  const cargar = useCallback(() => {
    setStatus('loading');
    setError(null);
    Promise.all([fetchOrdenes(), fetchProducts().catch(() => [])])
      .then(([orders, prodList]) => {
        const map = {};
        for (const p of prodList) map[p.id] = p;
        setProducts(map);
        setOrdenes(orders);
        setStatus('ok');
      })
      .catch((err) => {
        if (err.message === 'SESSION_EXPIRED') {
          handleSessionExpired();
          return;
        }
        setError(err.message || 'Error desconocido');
        setStatus('error');
      });
  }, [handleSessionExpired]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleEstadoChanged = (idOrden, nuevoEstado) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.idOrden === idOrden ? { ...o, estado: nuevoEstado } : o))
    );
  };

  const conteos = useMemo(() => {
    const c = { TODOS: ordenes.length };
    for (const es of ESTADOS) c[es] = 0;
    for (const o of ordenes) c[o.estado] = (c[o.estado] ?? 0) + 1;
    return c;
  }, [ordenes]);

  const visibles = useMemo(() => {
    const list = filtro === 'TODOS'
      ? ordenes
      : ordenes.filter((o) => o.estado === filtro);
    return [...list].sort((a, b) => b.idOrden - a.idOrden);
  }, [ordenes, filtro]);

  return (
    <div className="admin">
      <header className="admin__topbar">
        <div className="admin__brand">
          <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="admin__logo" />
          <span className="admin__title">Pedidos</span>
        </div>
        <div className="admin__user">
          <span className="admin__user-name">
            {session?.username} · {session?.role}
          </span>
          <button type="button" className="admin__logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin__main">
        <div className="admin__toolbar">
          <div className="admin__filters">
            {FILTROS.map((f) => (
              <button
                key={f}
                type="button"
                className={`admin__filter${filtro === f ? ' admin__filter--active' : ''}`}
                onClick={() => setFiltro(f)}
              >
                {f === 'TODOS' ? 'Todos' : ESTADO_META[f].label}
                <span className="admin__filter-count">{conteos[f] ?? 0}</span>
              </button>
            ))}
          </div>
          <button type="button" className="admin__refresh" onClick={cargar}>
            ↻ Actualizar
          </button>
        </div>

        {status === 'loading' && <p className="admin__status">Cargando pedidos…</p>}

        {status === 'error' && (
          <div className="admin__status admin__status--error">
            <p>No se pudieron cargar los pedidos: {error}</p>
            <button type="button" onClick={cargar}>Reintentar</button>
          </div>
        )}

        {status === 'ok' && visibles.length === 0 && (
          <p className="admin__status">No hay pedidos {filtro !== 'TODOS' ? `en estado ${ESTADO_META[filtro].label.toLowerCase()}` : ''}.</p>
        )}

        {status === 'ok' && visibles.length > 0 && (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Paq.</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Cambiar a</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((orden) => (
                  <AdminOrderRow
                    key={orden.idOrden}
                    orden={orden}
                    products={products}
                    onEstadoChanged={handleEstadoChanged}
                    onSessionExpired={handleSessionExpired}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;
