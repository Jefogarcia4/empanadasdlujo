import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchClientes, updateCliente } from '../../services/admin';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

// Campos editables del formulario. `pais` y `guardarInfo` se conservan del registro original.
const CAMPOS = [
  { key: 'nombre', label: 'Nombre', required: true },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'telefono', label: 'Teléfono', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'casaApartamento', label: 'Casa / Apartamento' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'departamento', label: 'Departamento' },
  { key: 'codigoPostal', label: 'Código postal' },
  { key: 'nit', label: 'NIT' },
];

function ClienteEditModal({ cliente, onClose, onSaved, onSessionExpired }) {
  const [form, setForm] = useState(() => ({ ...cliente }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre?.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setSaving(true);
    setError(null);

    // El PUT reemplaza el registro: enviamos el DTO completo (incluye pais/guardarInfo/activo).
    const payload = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos || null,
      telefono: form.telefono || null,
      email: form.email || null,
      direccion: form.direccion || null,
      casaApartamento: form.casaApartamento || null,
      ciudad: form.ciudad || null,
      departamento: form.departamento || null,
      codigoPostal: form.codigoPostal || null,
      pais: form.pais || 'Colombia',
      nit: form.nit || null,
      activo: !!form.activo,
      guardarInfo: !!form.guardarInfo,
    };

    try {
      await updateCliente(cliente.idCliente, payload);
      onSaved({ ...cliente, ...payload });
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal__backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">Editar cliente #{cliente.idCliente}</h3>
          <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form className="admin-modal__body" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            {CAMPOS.map((c) => (
              <label key={c.key} className="admin-form__field">
                <span className="admin-form__label">
                  {c.label}{c.required && <span className="admin-form__req"> *</span>}
                </span>
                <input
                  className="admin-form__input"
                  type={c.type || 'text'}
                  value={form[c.key] ?? ''}
                  onChange={(e) => setField(c.key, e.target.value)}
                />
              </label>
            ))}
          </div>

          <label className="admin-form__checkbox">
            <input
              type="checkbox"
              checked={!!form.activo}
              onChange={(e) => setField('activo', e.target.checked)}
            />
            <span>Cliente activo</span>
          </label>

          {error && <p className="admin-form__error">{error}</p>}

          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminClientesPage({ onSessionExpired }) {
  const [clientes, setClientes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const handleSessionExpired = useCallback(() => {
    onSessionExpired?.();
  }, [onSessionExpired]);

  const cargar = useCallback(() => {
    setStatus('loading');
    setError(null);
    fetchClientes()
      .then((data) => {
        setClientes(data);
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

  const handleSaved = (updated) => {
    setClientes((prev) =>
      prev.map((c) => (c.idCliente === updated.idCliente ? { ...c, ...updated } : c))
    );
    setEditing(null);
  };

  const visibles = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = !q
      ? clientes
      : clientes.filter((c) =>
          [c.nombre, c.apellidos, c.telefono, c.email, c.ciudad]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(q))
        );
    return [...list].sort((a, b) => (b.totalPedidos ?? 0) - (a.totalPedidos ?? 0));
  }, [clientes, search]);

  return (
    <main className="admin__main">
      <div className="admin__toolbar">
        <input
          type="search"
          className="admin__search"
          placeholder="Buscar por nombre, teléfono, email o ciudad…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin__toolbar-right">
          <span className="admin__count-label">
            {visibles.length} {visibles.length === 1 ? 'cliente' : 'clientes'}
          </span>
          <button type="button" className="admin__refresh" onClick={cargar}>
            ↻ Actualizar
          </button>
        </div>
      </div>

      {status === 'loading' && <p className="admin__status">Cargando clientes…</p>}

      {status === 'error' && (
        <div className="admin__status admin__status--error">
          <p>No se pudieron cargar los clientes: {error}</p>
          <button type="button" onClick={cargar}>Reintentar</button>
        </div>
      )}

      {status === 'ok' && visibles.length === 0 && (
        <p className="admin__status">No hay clientes {search ? 'que coincidan con la búsqueda' : 'registrados'}.</p>
      )}

      {status === 'ok' && visibles.length > 0 && (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Pedidos</th>
                <th>Último pedido</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr className="admin-row" key={c.idCliente}>
                  <td data-label="Cliente">
                    {[c.nombre, c.apellidos].filter(Boolean).join(' ') || `Cliente ${c.idCliente}`}
                  </td>
                  <td data-label="Teléfono">
                    {c.telefono ? <a href={`tel:${c.telefono}`}>{c.telefono}</a> : '—'}
                  </td>
                  <td data-label="Email">
                    {c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : '—'}
                  </td>
                  <td data-label="Ciudad">{c.ciudad || '—'}</td>
                  <td className="admin-row__qty" data-label="Pedidos">{c.totalPedidos ?? 0}</td>
                  <td className="admin-row__date" data-label="Último pedido">{formatDate(c.ultimoPedido)}</td>
                  <td data-label="Estado">
                    <span className={`admin-badge admin-badge--${c.activo ? 'delivered' : 'cancelled'}`}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="admin-row__toggle-cell">
                    <button
                      type="button"
                      className="admin-row__toggle"
                      onClick={() => setEditing(c)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ClienteEditModal
          cliente={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
          onSessionExpired={handleSessionExpired}
        />
      )}
    </main>
  );
}

export default AdminClientesPage;
