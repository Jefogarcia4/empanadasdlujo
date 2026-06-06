import { useState } from 'react';
import { updateEstadoOrden } from '../../services/admin';

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'ENTREGADA', 'ANULADA'];

const ESTADO_META = {
  PENDIENTE:  { label: 'Pendiente',  tone: 'pending' },
  CONFIRMADA: { label: 'Confirmada', tone: 'confirmed' },
  ENTREGADA:  { label: 'Entregada',  tone: 'delivered' },
  ANULADA:    { label: 'Anulada',    tone: 'cancelled' },
};

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
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

function AdminOrderRow({ orden, products, onEstadoChanged, onSessionExpired }) {
  const [expanded, setExpanded] = useState(false);
  const [estado, setEstado] = useState(orden.estado);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const meta = ESTADO_META[estado] ?? { label: estado, tone: 'pending' };
  const totalUnidades = orden.detalles?.reduce((s, d) => s + d.cantidadPaquetes, 0) ?? 0;

  const handleEstadoChange = async (nuevoEstado) => {
    const anterior = estado;
    setEstado(nuevoEstado);
    setSaving(true);
    setError(null);
    try {
      await updateEstadoOrden(orden.idOrden, nuevoEstado);
      onEstadoChanged?.(orden.idOrden, nuevoEstado);
    } catch (err) {
      setEstado(anterior);
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setError(err.message || 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className="admin-row">
        <td className="admin-row__id">#{orden.idOrden}</td>
        <td>{orden.nombreCliente || `Cliente ${orden.idCliente}`}</td>
        <td className="admin-row__date">{formatDate(orden.fechaOrden)}</td>
        <td className="admin-row__qty">{totalUnidades}</td>
        <td className="admin-row__total">{formatPrice(orden.total)}</td>
        <td>
          <span className={`admin-badge admin-badge--${meta.tone}`}>{meta.label}</span>
        </td>
        <td>
          <select
            className="admin-row__select"
            value={estado}
            disabled={saving}
            onChange={(e) => handleEstadoChange(e.target.value)}
          >
            {ESTADOS.map((es) => (
              <option key={es} value={es}>{ESTADO_META[es].label}</option>
            ))}
          </select>
          {saving && <span className="admin-row__saving">Guardando…</span>}
          {error && <span className="admin-row__error">{error}</span>}
        </td>
        <td>
          <button
            type="button"
            className="admin-row__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Ocultar' : 'Ver detalle'}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="admin-detail-row">
          <td colSpan={8}>
            <div className="admin-detail">
              <table className="admin-detail__table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio paq.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.detalles?.map((d) => {
                    const prod = products[d.codigoSku];
                    const nombre = d.esCombo
                      ? d.nombreCombo || d.codigoCombo || 'Combo'
                      : prod?.name || d.codigoSku;
                    const sub = d.subtotal ?? d.cantidadPaquetes * d.precioPaquete;
                    return (
                      <tr key={d.idDetalle}>
                        <td>
                          <span className="admin-detail__name">{nombre}</span>
                          {(d.esCombo || prod?.flavor) && (
                            <span className="admin-detail__flavor">
                              {d.esCombo ? 'Combo' : prod?.flavor}
                            </span>
                          )}
                          {d.aplicaMayorista && (
                            <span className="admin-detail__tag">PVxM</span>
                          )}
                        </td>
                        <td>{d.cantidadPaquetes}</td>
                        <td>{formatPrice(d.precioPaquete)}</td>
                        <td>{formatPrice(sub)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="admin-detail__totals">
                <span>Subtotal: <strong>{formatPrice(orden.subtotal)}</strong></span>
                {orden.descuento > 0 && (
                  <span>Descuento: <strong>−{formatPrice(orden.descuento)}</strong></span>
                )}
                <span>Total: <strong>{formatPrice(orden.total)}</strong></span>
              </div>

              {orden.observaciones && (
                <p className="admin-detail__obs">
                  <strong>Observaciones:</strong> {orden.observaciones}
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export { ESTADOS, ESTADO_META };
export default AdminOrderRow;
