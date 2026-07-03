import { useEffect, useState } from 'react';
import { fetchPedido } from '../services/pedidos';
import { fetchProducts } from '../services/api';
import { DELIVERY_FEE } from '../config/constants';
import '../styles/PedidoDetail.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const ESTADO_LABEL = {
  PENDIENTE:  { label: 'Pendiente',   tone: 'pending'   },
  CONFIRMADA: { label: 'Confirmada',  tone: 'confirmed' },
  ENTREGADA:  { label: 'Entregada',   tone: 'delivered' },
  ANULADA:    { label: 'Anulada',     tone: 'cancelled' },
};

function PedidoDetailPage({ pedidoId, onNavigate }) {
  const [pedido, setPedido] = useState(null);
  const [products, setProducts] = useState({});
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');

    Promise.all([fetchPedido(pedidoId), fetchProducts().catch(() => [])])
      .then(([order, prodList]) => {
        if (!active) return;
        if (!order) {
          setStatus('notfound');
          return;
        }
        const map = {};
        for (const p of prodList) map[p.id] = p;
        setProducts(map);
        setPedido(order);
        setStatus('ok');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Error desconocido');
        setStatus('error');
      });

    return () => { active = false; };
  }, [pedidoId]);

  if (status === 'loading') {
    return (
      <main className="pedido-page">
        <p className="pedido-page__loading">Cargando pedido…</p>
      </main>
    );
  }

  if (status === 'notfound') {
    return (
      <main className="pedido-page">
        <div className="pedido-page__empty">
          <h2>Pedido no encontrado</h2>
          <p>El pedido #{pedidoId} no existe o fue eliminado.</p>
          <button className="pedido-page__back-btn" onClick={() => onNavigate('tienda')}>
            ← Volver a la tienda
          </button>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="pedido-page">
        <div className="pedido-page__empty">
          <h2>No se pudo cargar el pedido</h2>
          <p>{error}</p>
          <button className="pedido-page__back-btn" onClick={() => onNavigate('tienda')}>
            ← Volver a la tienda
          </button>
        </div>
      </main>
    );
  }

  const estado = ESTADO_LABEL[pedido.estado] ?? { label: pedido.estado, tone: 'pending' };
  const totalUnidades = pedido.detalles?.reduce((s, d) => s + d.cantidadPaquetes, 0) ?? 0;

  return (
    <main className="pedido-page">
      <header className="pedido-page__header">
        <button className="pedido-page__back" onClick={() => onNavigate('tienda')}>
          ← Volver a la tienda
        </button>
        <div className="pedido-page__title-row">
          <h1 className="pedido-page__title">Pedido #{pedido.idOrden}</h1>
          <span className={`pedido-page__badge pedido-page__badge--${estado.tone}`}>
            {estado.label}
          </span>
        </div>
        <p className="pedido-page__meta">
          Recibido el {formatDate(pedido.fechaOrden)} · {totalUnidades} paquete{totalUnidades === 1 ? '' : 's'}
        </p>
      </header>

      <section className="pedido-page__card">
        <h2 className="pedido-page__section-title">Productos</h2>
        <ul className="pedido-page__items">
          {pedido.detalles.map((d) => {
            const prod = products[d.codigoSku];
            const displayName = d.esCombo
              ? d.nombreCombo || d.codigoCombo || 'Combo'
              : prod?.name || d.codigoSku;
            const displaySubtitle = d.esCombo ? 'Combo' : prod?.flavor;
            return (
              <li key={d.idDetalle} className="pedido-item">
                <img
                  className="pedido-item__img"
                  src={prod?.image || '/pollo_carne.jpg'}
                  alt={displayName}
                />
                <div className="pedido-item__info">
                  <span className="pedido-item__name">
                    {displayName}
                  </span>
                  {displaySubtitle && (
                    <span className="pedido-item__flavor">{displaySubtitle}</span>
                  )}
                  <span className="pedido-item__qty">
                    {d.cantidadPaquetes} × {formatPrice(d.precioPaquete)}
                    {d.aplicaMayorista && (
                      <span className="pedido-item__tag">PVxM</span>
                    )}
                  </span>
                </div>
                <div className="pedido-item__amount">
                  {d.aplicaMayorista && d.precioPaqueteDetal > d.precioPaquete && (
                    <span className="pedido-item__amount-old">
                      {formatPrice(d.cantidadPaquetes * d.precioPaqueteDetal)}
                    </span>
                  )}
                  <span className="pedido-item__amount-final">
                    {formatPrice(d.subtotal ?? d.cantidadPaquetes * d.precioPaquete)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pedido-page__totals">
          <div className="pedido-page__totals-row">
            <span>Subtotal</span>
            <span>{formatPrice(pedido.subtotal)}</span>
          </div>
          {pedido.descuento > 0 && (
            <div className="pedido-page__totals-row pedido-page__totals-row--discount">
              <span>Descuento mayorista</span>
              <span>−{formatPrice(pedido.descuento)}</span>
            </div>
          )}
          <div className="pedido-page__totals-row">
            <span>Valor domicilio</span>
            <span>{formatPrice(DELIVERY_FEE)}</span>
          </div>
          <div className="pedido-page__totals-row pedido-page__totals-row--total">
            <span>Total pagado</span>
            {/* pedido.total ya incluye el domicilio (el backend lo suma al guardar). */}
            <span>{formatPrice(pedido.total)}</span>
          </div>
        </div>
      </section>

      {pedido.observaciones && (
        <section className="pedido-page__card">
          <h2 className="pedido-page__section-title">Comentarios</h2>
          <p className="pedido-page__obs">{pedido.observaciones}</p>
        </section>
      )}

      <section className="pedido-page__card pedido-page__next">
        <h2 className="pedido-page__section-title">¿Qué sigue?</h2>
        <p>
          Recibimos tu pedido y un asesor te contactará por WhatsApp para confirmar
          los datos de entrega y el método de pago.
        </p>
        <p className="pedido-page__share">
          Guarda este enlace para consultar el estado del pedido más adelante.
        </p>
      </section>
    </main>
  );
}

export default PedidoDetailPage;
