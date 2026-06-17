import { useCallback, useEffect, useState } from 'react';
import { fetchWhatsAppLogs } from '../../services/admin';

const FILTROS = [
  { key: 'TODOS', label: 'Todos', estado: undefined },
  { key: 'EXITOSO', label: 'Exitosos', estado: 'EXITOSO' },
  { key: 'FALLIDO', label: 'Fallidos', estado: 'FALLIDO' },
];

const TIPO_LABEL = { NEGOCIO: 'Negocio', CLIENTE: 'Cliente' };

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

function AdminLogsPage({ onSessionExpired }) {
  const [logs, setLogs] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const cargar = useCallback(() => {
    setStatus('loading');
    setError(null);
    const estado = FILTROS.find((f) => f.key === filtro)?.estado;
    fetchWhatsAppLogs({ estado, take: 300 })
      .then((data) => {
        setLogs(data);
        setStatus('ok');
      })
      .catch((err) => {
        if (err.message === 'SESSION_EXPIRED') {
          onSessionExpired?.();
          return;
        }
        setError(err.message || 'Error desconocido');
        setStatus('error');
      });
  }, [filtro, onSessionExpired]);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <main className="admin__main">
      <div className="admin__toolbar">
        <div className="admin__filters">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`admin__filter${filtro === f.key ? ' admin__filter--active' : ''}`}
              onClick={() => setFiltro(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" className="admin__refresh" onClick={cargar}>
          ↻ Actualizar
        </button>
      </div>

      {status === 'loading' && <p className="admin__status">Cargando logs…</p>}

      {status === 'error' && (
        <div className="admin__status admin__status--error">
          <p>No se pudieron cargar los logs: {error}</p>
          <button type="button" onClick={cargar}>Reintentar</button>
        </div>
      )}

      {status === 'ok' && logs.length === 0 && (
        <p className="admin__status">No hay registros de envíos de WhatsApp.</p>
      )}

      {status === 'ok' && logs.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Pedido</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Destinatario</th>
                <th>Plantilla</th>
                <th>HTTP</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.idLog} className="admin-row">
                  <td className="admin-row__date" data-label="Fecha">{formatDate(l.fechaIntento)}</td>
                  <td data-label="Pedido">{l.idOrden != null ? `#${l.idOrden}` : '—'}</td>
                  <td data-label="Tipo">{TIPO_LABEL[l.tipo] ?? l.tipo ?? '—'}</td>
                  <td data-label="Estado">
                    <span
                      className={`admin-badge admin-badge--${l.estado === 'EXITOSO' ? 'delivered' : 'cancelled'}`}
                    >
                      {l.estado === 'EXITOSO' ? 'Exitoso' : 'Fallido'}
                    </span>
                  </td>
                  <td data-label="Destinatario">{l.destinatario || '—'}</td>
                  <td data-label="Plantilla">{l.plantilla || '—'}</td>
                  <td className="admin-row__qty" data-label="HTTP">{l.codigoHttp ?? '—'}</td>
                  <td data-label="Detalle">
                    <span className="admin-log__detail" title={l.mensajeError || ''}>
                      {l.mensajeError || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminLogsPage;
