import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaExclamationTriangle, FaSyncAlt, FaTrashAlt } from 'react-icons/fa';
import { deleteOrdenesAnuladas, fetchOrdenes } from '../../services/admin';
import { fetchProducts } from '../../services/api';
import { getSession } from '../../services/auth';
import AdminOrderRow, { ESTADOS, ESTADO_META } from './AdminOrderRow';

const FILTROS = ['TODOS', ...ESTADOS];

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0);

function AdminPage({ onSessionExpired }) {
  const [ordenes, setOrdenes] = useState([]);
  const [products, setProducts] = useState({});
  const [filtro, setFiltro] = useState('TODOS');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState(null);

  // El borrado definitivo de pedidos queda reservado al rol Admin (el API responde 403
  // a los demás usuarios); para 'ventas' el botón ni siquiera se muestra.
  const puedeEliminar = getSession()?.role === 'Admin';

  const handleSessionExpired = useCallback(() => {
    onSessionExpired?.();
  }, [onSessionExpired]);

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

  const handleEliminarAnulados = async () => {
    setEliminando(true);
    setErrorBorrado(null);
    try {
      const { ids = [], eliminadas = 0 } = await deleteOrdenesAnuladas();

      if (ids.length) {
        const borrados = new Set(ids);
        setOrdenes((prev) => prev.filter((o) => !borrados.has(o.idOrden)));
      } else if (eliminadas > 0) {
        cargar();
      }

      setConfirmandoBorrado(false);
      if (filtro === 'ANULADA') setFiltro('TODOS');
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        handleSessionExpired();
        return;
      }
      setErrorBorrado(err.message || 'No se pudieron eliminar los pedidos.');
    } finally {
      setEliminando(false);
    }
  };

  const conteos = useMemo(() => {
    const c = { TODOS: ordenes.length };
    for (const es of ESTADOS) c[es] = 0;
    for (const o of ordenes) c[o.estado] = (c[o.estado] ?? 0) + 1;
    return c;
  }, [ordenes]);

  // Resumen por estado: cantidad de pedidos y total en dinero, para las cards superiores.
  const resumen = useMemo(() => {
    const r = {};
    for (const es of ESTADOS) r[es] = { count: 0, total: 0 };
    for (const o of ordenes) {
      if (!r[o.estado]) r[o.estado] = { count: 0, total: 0 };
      r[o.estado].count += 1;
      r[o.estado].total += o.total ?? 0;
    }
    return r;
  }, [ordenes]);

  const visibles = useMemo(() => {
    const list = filtro === 'TODOS'
      ? ordenes
      : ordenes.filter((o) => o.estado === filtro);
    return [...list].sort((a, b) => b.idOrden - a.idOrden);
  }, [ordenes, filtro]);

  return (
    <main className="admin__main">
        {status === 'ok' && (
          <section className="admin__cards">
            {ESTADOS.map((es) => (
              <button
                key={es}
                type="button"
                className={`admin-card admin-card--${ESTADO_META[es].tone}${filtro === es ? ' admin-card--active' : ''}`}
                onClick={() => setFiltro((f) => (f === es ? 'TODOS' : es))}
              >
                <span className="admin-card__label">{ESTADO_META[es].label}</span>
                <span className="admin-card__total">{formatPrice(resumen[es].total)}</span>
                <span className="admin-card__count">
                  {resumen[es].count} {resumen[es].count === 1 ? 'pedido' : 'pedidos'}
                </span>
              </button>
            ))}
          </section>
        )}

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
          <div className="admin__toolbar-right">
            {puedeEliminar && (conteos.ANULADA ?? 0) > 0 && (
              <button
                type="button"
                className="admin__danger"
                onClick={() => { setErrorBorrado(null); setConfirmandoBorrado(true); }}
              >
                <FaTrashAlt aria-hidden="true" /> Eliminar anulados ({conteos.ANULADA})
              </button>
            )}
            <button type="button" className="admin__refresh" onClick={cargar}>
              <FaSyncAlt aria-hidden="true" /> Actualizar
            </button>
          </div>
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

        {confirmandoBorrado && (
          <div
            className="admin-modal__backdrop"
            onClick={() => { if (!eliminando) setConfirmandoBorrado(false); }}
          >
            <div
              className="admin-modal admin-modal--confirm"
              role="dialog"
              aria-modal="true"
              aria-label="Eliminar pedidos anulados"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal__header">
                <h3 className="admin-modal__title">Eliminar pedidos anulados</h3>
                <button
                  type="button"
                  className="admin-modal__close"
                  onClick={() => setConfirmandoBorrado(false)}
                  disabled={eliminando}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="admin-modal__body">
                <p className="admin-confirm__texto">
                  Se borrarán <strong>{conteos.ANULADA} {conteos.ANULADA === 1 ? 'pedido' : 'pedidos'}</strong>
                  {' '}en estado Anulada, junto con todo su detalle.
                </p>

                <p className="admin-confirm__alerta">
                  <FaExclamationTriangle aria-hidden="true" />
                  <span>
                    Esta acción no se puede deshacer. Los logs de WhatsApp de esos pedidos se
                    conservan, pero quedarán apuntando a un pedido que ya no existe.
                  </span>
                </p>

                {errorBorrado && <p className="admin-form__error">{errorBorrado}</p>}

                <div className="admin-modal__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => setConfirmandoBorrado(false)}
                    disabled={eliminando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--peligro"
                    onClick={handleEliminarAnulados}
                    disabled={eliminando}
                  >
                    {eliminando ? 'Eliminando…' : `Sí, eliminar ${conteos.ANULADA}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}

export default AdminPage;
