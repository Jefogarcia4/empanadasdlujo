import { useEffect, useState } from 'react';
import {
  updateEstadoOrden,
  fetchWhatsAppLogs,
  resendOrderToBusiness,
  resendOrderToClient,
} from '../../services/admin';

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

  // Reenvío de WhatsApp: estado por tipo ('NEGOCIO' | 'CLIENTE') → 'sending' | 'ok' | mensaje de error.
  const [resend, setResend] = useState({});
  const [lastFail, setLastFail] = useState(null);

  const meta = ESTADO_META[estado] ?? { label: estado, tone: 'pending' };
  const totalUnidades = orden.detalles?.reduce((s, d) => s + d.cantidadPaquetes, 0) ?? 0;
  const sinTelefono = !orden.telefonoCliente;

  // Al expandir, avisa solo si el ÚLTIMO intento de esta orden fue fallido
  // (si después hubo un reenvío exitoso, no hay nada que avisar).
  useEffect(() => {
    if (!expanded) return;
    let cancel = false;
    fetchWhatsAppLogs({ idOrden: orden.idOrden })
      .then((logs) => {
        if (cancel) return;
        const latest = logs?.[0];
        setLastFail(latest && latest.estado === 'FALLIDO' ? latest : null);
      })
      .catch((err) => {
        if (err.message === 'SESSION_EXPIRED') onSessionExpired?.();
      });
    return () => { cancel = true; };
  }, [expanded, orden.idOrden, onSessionExpired]);

  const handleResend = async (tipo, fn) => {
    setResend((prev) => ({ ...prev, [tipo]: 'sending' }));
    try {
      await fn(orden, products);
      setResend((prev) => ({ ...prev, [tipo]: 'ok' }));
      setLastFail(null);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setResend((prev) => ({ ...prev, [tipo]: err.message || 'No se pudo reenviar.' }));
    }
  };

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
        <td className="admin-row__id" data-label="Pedido">#{orden.idOrden}</td>
        <td data-label="Cliente">{orden.nombreCliente || `Cliente ${orden.idCliente}`}</td>
        <td className="admin-row__date" data-label="Fecha">{formatDate(orden.fechaOrden)}</td>
        <td className="admin-row__qty" data-label="Paq.">{totalUnidades}</td>
        <td className="admin-row__total" data-label="Total">{formatPrice(orden.total)}</td>
        <td data-label="Estado">
          <span className={`admin-badge admin-badge--${meta.tone}`}>{meta.label}</span>
        </td>
        <td data-label="Cambiar a">
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
        <td className="admin-row__toggle-cell">
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
              <div className="admin-detail__customer">
                <h4 className="admin-detail__customer-title">Datos del cliente</h4>
                <div className="admin-detail__customer-grid">
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Nombre</span>
                    <span className="admin-detail__field-value">
                      {[orden.nombreCliente, orden.apellidosCliente].filter(Boolean).join(' ') || '—'}
                    </span>
                  </div>
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Teléfono</span>
                    <span className="admin-detail__field-value">
                      {orden.telefonoCliente ? (
                        <a href={`tel:${orden.telefonoCliente}`}>{orden.telefonoCliente}</a>
                      ) : '—'}
                    </span>
                  </div>
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Email</span>
                    <span className="admin-detail__field-value">
                      {orden.emailCliente ? (
                        <a href={`mailto:${orden.emailCliente}`}>{orden.emailCliente}</a>
                      ) : '—'}
                    </span>
                  </div>
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Dirección</span>
                    <span className="admin-detail__field-value">
                      {[orden.direccionCliente, orden.casaApartamentoCliente].filter(Boolean).join(', ') || '—'}
                    </span>
                  </div>
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Ciudad / Depto.</span>
                    <span className="admin-detail__field-value">
                      {[orden.ciudadCliente, orden.departamentoCliente].filter(Boolean).join(', ') || '—'}
                    </span>
                  </div>
                  <div className="admin-detail__field">
                    <span className="admin-detail__field-label">Código postal</span>
                    <span className="admin-detail__field-value">{orden.codigoPostalCliente || '—'}</span>
                  </div>
                </div>
              </div>

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

              <div className="admin-wa">
                <div className="admin-wa__header">
                  <h4 className="admin-wa__title">WhatsApp</h4>
                  {lastFail && (
                    <span className="admin-wa__fail">
                      ⚠ Último envío falló
                      {lastFail.tipo ? ` (${lastFail.tipo === 'CLIENTE' ? 'cliente' : 'negocio'})` : ''}
                      {lastFail.fechaIntento ? ` · ${formatDate(lastFail.fechaIntento)}` : ''}
                      {lastFail.mensajeError ? `: ${lastFail.mensajeError}` : ''}
                    </span>
                  )}
                </div>
                <div className="admin-wa__actions">
                  <button
                    type="button"
                    className="admin-wa__btn"
                    disabled={resend.NEGOCIO === 'sending'}
                    onClick={() => handleResend('NEGOCIO', resendOrderToBusiness)}
                  >
                    {resend.NEGOCIO === 'sending' ? 'Enviando…'
                      : resend.NEGOCIO === 'ok' ? '✓ Reenviado al negocio'
                      : 'Reenviar al negocio'}
                  </button>
                  <button
                    type="button"
                    className="admin-wa__btn"
                    disabled={resend.CLIENTE === 'sending' || sinTelefono}
                    title={sinTelefono ? 'El pedido no tiene teléfono del cliente' : undefined}
                    onClick={() => handleResend('CLIENTE', resendOrderToClient)}
                  >
                    {resend.CLIENTE === 'sending' ? 'Enviando…'
                      : resend.CLIENTE === 'ok' ? '✓ Reenviado al cliente'
                      : 'Reenviar al cliente'}
                  </button>
                </div>
                {(resend.NEGOCIO && resend.NEGOCIO !== 'sending' && resend.NEGOCIO !== 'ok') && (
                  <p className="admin-wa__error">{resend.NEGOCIO}</p>
                )}
                {(resend.CLIENTE && resend.CLIENTE !== 'sending' && resend.CLIENTE !== 'ok') && (
                  <p className="admin-wa__error">{resend.CLIENTE}</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export { ESTADOS, ESTADO_META };
export default AdminOrderRow;
