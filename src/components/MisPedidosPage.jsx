import { useCallback, useEffect, useState } from 'react';
import { fetchMisPedidos, getClienteSession, logoutCliente } from '../services/clienteAuth';
import '../styles/ClientePortal.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0);

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const ESTADO_META = {
  PENDIENTE:  { label: 'Pendiente',  tone: 'pending' },
  CONFIRMADA: { label: 'Confirmada', tone: 'confirmed' },
  ENTREGADA:  { label: 'Entregada',  tone: 'delivered' },
  ANULADA:    { label: 'Anulada',    tone: 'cancelled' },
};

function MisPedidosPage({ onNavigate }) {
  const [pedidos, setPedidos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const session = getClienteSession();

  const cargar = useCallback(() => {
    setStatus('loading');
    setError(null);
    fetchMisPedidos()
      .then((data) => {
        setPedidos(data);
        setStatus('ok');
      })
      .catch((err) => {
        if (err.message === 'SESSION_EXPIRED') {
          setStatus('expired');
          return;
        }
        setError(err.message || 'Error desconocido');
        setStatus('error');
      });
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleLogout = () => {
    logoutCliente();
    onNavigate?.('tienda');
  };

  return (
    <main className="mis-pedidos">
      <div className="mis-pedidos__header">
        <div>
          <h1 className="mis-pedidos__title">Mis pedidos</h1>
          {session?.nombre && (
            <p className="mis-pedidos__hello">Hola, {session.nombre} 👋</p>
          )}
        </div>
        <button type="button" className="mis-pedidos__logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {status === 'loading' && <p className="mis-pedidos__status">Cargando tus pedidos…</p>}

      {status === 'expired' && (
        <div className="mis-pedidos__status">
          <p>Tu sesión expiró. Vuelve a ingresar para ver tus pedidos.</p>
          <button type="button" className="mis-pedidos__cta" onClick={() => onNavigate?.('tienda')}>
            Volver a la tienda
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mis-pedidos__status mis-pedidos__status--error">
          <p>{error}</p>
          <button type="button" className="mis-pedidos__cta" onClick={cargar}>Reintentar</button>
        </div>
      )}

      {status === 'ok' && pedidos.length === 0 && (
        <div className="mis-pedidos__status">
          <p>Aún no tienes pedidos registrados con este número.</p>
          <button type="button" className="mis-pedidos__cta" onClick={() => onNavigate?.('tienda')}>
            Ir a la tienda
          </button>
        </div>
      )}

      {status === 'ok' && pedidos.length > 0 && (
        <ul className="mis-pedidos__list">
          {pedidos.map((p) => {
            const meta = ESTADO_META[p.estado] ?? { label: p.estado, tone: 'pending' };
            const totalPaq = p.detalles?.reduce((s, d) => s + d.cantidadPaquetes, 0) ?? 0;
            return (
              <li key={p.idOrden} className="mis-pedidos__card">
                <div className="mis-pedidos__card-top">
                  <span className="mis-pedidos__num">Pedido #{p.idOrden}</span>
                  <span className={`mis-pedidos__badge mis-pedidos__badge--${meta.tone}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mis-pedidos__date">{formatDate(p.fechaOrden)}</p>
                <div className="mis-pedidos__card-bottom">
                  <span className="mis-pedidos__meta">
                    {totalPaq} {totalPaq === 1 ? 'paquete' : 'paquetes'}
                  </span>
                  <span className="mis-pedidos__total">{formatPrice(p.total)}</span>
                </div>
                <button
                  type="button"
                  className="mis-pedidos__detail"
                  onClick={() => onNavigate?.('pedido_detail', { pedidoId: p.idOrden })}
                >
                  Ver detalle
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

export default MisPedidosPage;
