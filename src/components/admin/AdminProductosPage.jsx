import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEyeSlash,
  FaImage,
  FaPlus,
  FaSyncAlt,
  FaTags,
} from 'react-icons/fa';
import {
  fetchCatalogoAdmin,
  setSkuActivo,
  upsertPrecios,
} from '../../services/catalogoAdmin';
import PrecioInline from './productos/PrecioInline';
import PreciosMasivosModal from './productos/PreciosMasivosModal';
import ProductoModal from './productos/ProductoModal';
import { describirPresentacion, sugerirPrecioUnidad } from './productos/utils';
import '../../styles/AdminProductos.css';

// Lista que define el precio que ve el cliente en la web (ver CatalogoController).
const LISTA_WEB = 'Web';

const ESTADOS = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ACTIVOS', label: 'Visibles' },
  { key: 'INACTIVOS', label: 'Ocultos' },
  { key: 'SIN_PRECIO', label: 'Sin precio web' },
];

const ORDEN_INICIAL = { campo: 'catalogo', dir: 'asc' };

function AdminProductosPage({ onSessionExpired }) {
  const [data, setData] = useState({ items: [], productos: [], categorias: [], sabores: [], listas: [] });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('TODAS');
  const [estado, setEstado] = useState('TODOS');
  const [orden, setOrden] = useState(ORDEN_INICIAL);

  const [seleccion, setSeleccion] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { modo: 'crear' | 'editar', item }
  const [masivoAbierto, setMasivoAbierto] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: 'ok' | 'error', texto }

  const handleSessionExpired = useCallback(() => {
    onSessionExpired?.();
  }, [onSessionExpired]);

  const notificar = useCallback((tipo, texto) => {
    setAviso({ tipo, texto });
  }, []);

  useEffect(() => {
    if (!aviso) return undefined;
    const id = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(id);
  }, [aviso]);

  const cargar = useCallback(() => {
    setStatus('loading');
    setError(null);
    fetchCatalogoAdmin()
      .then((resultado) => {
        setData(resultado);
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

  const listaWeb = useMemo(
    () => data.listas.find((l) => l.nombre === LISTA_WEB) ?? data.listas[0] ?? null,
    [data.listas]
  );

  const tienePrecioWeb = useCallback(
    (item) => !!(listaWeb && item.precios?.[listaWeb.idLista]?.precioPaquete > 0),
    [listaWeb]
  );

  // ─── Filtro + orden ─────────────────────────────────────────
  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    let list = data.items.filter((item) => {
      if (categoria !== 'TODAS' && String(item.idCategoria) !== String(categoria)) return false;
      if (estado === 'ACTIVOS' && !item.activo) return false;
      if (estado === 'INACTIVOS' && item.activo) return false;
      if (estado === 'SIN_PRECIO' && tienePrecioWeb(item)) return false;
      if (!q) return true;
      return [item.codigoSku, item.nombreProducto, item.nombreSabor, item.nombreCategoria, item.badgeDescripcion]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(q));
    });

    const dir = orden.dir === 'asc' ? 1 : -1;
    const precioDe = (item, idLista) => item.precios?.[idLista]?.precioPaquete ?? -1;

    list = [...list].sort((a, b) => {
      if (orden.campo === 'catalogo') {
        const oa = a.orden ?? Number.MAX_SAFE_INTEGER;
        const ob = b.orden ?? Number.MAX_SAFE_INTEGER;
        if (oa !== ob) return (oa - ob) * dir;
        return a.codigoSku.localeCompare(b.codigoSku) * dir;
      }
      if (orden.campo === 'producto') {
        return `${a.nombreProducto} ${a.nombreSabor}`.localeCompare(`${b.nombreProducto} ${b.nombreSabor}`, 'es') * dir;
      }
      if (orden.campo === 'presentacion') {
        return ((a.gramajeG ?? 0) - (b.gramajeG ?? 0)) * dir;
      }
      if (orden.campo === 'estado') {
        return ((a.activo ? 1 : 0) - (b.activo ? 1 : 0)) * dir;
      }
      if (typeof orden.campo === 'number') {
        return (precioDe(a, orden.campo) - precioDe(b, orden.campo)) * dir;
      }
      return 0;
    });

    return list;
  }, [data.items, busqueda, categoria, estado, orden, tienePrecioWeb]);

  const resumen = useMemo(() => {
    const total = data.items.length;
    const activos = data.items.filter((i) => i.activo).length;
    const sinPrecio = data.items.filter((i) => !tienePrecioWeb(i)).length;
    const sinImagen = data.items.filter((i) => !i.urlImage).length;
    return { total, activos, ocultos: total - activos, sinPrecio, sinImagen };
  }, [data.items, tienePrecioWeb]);

  // Solo se conservan seleccionados los que siguen visibles tras filtrar.
  const seleccionados = useMemo(
    () => visibles.filter((i) => seleccion.has(i.codigoSku)),
    [visibles, seleccion]
  );

  const todosSeleccionados = visibles.length > 0 && seleccionados.length === visibles.length;

  const alternarSeleccion = (codigoSku) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(codigoSku)) next.delete(codigoSku);
      else next.add(codigoSku);
      return next;
    });
  };

  const alternarTodos = () => {
    setSeleccion(todosSeleccionados ? new Set() : new Set(visibles.map((i) => i.codigoSku)));
  };

  const ordenarPor = (campo) => {
    setOrden((prev) => (prev.campo === campo ? { campo, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { campo, dir: 'asc' }));
  };

  const indicadorOrden = (campo) => (orden.campo === campo ? (orden.dir === 'asc' ? ' ▲' : ' ▼') : '');

  // ─── Mutaciones ─────────────────────────────────────────────
  const aplicarPrecios = useCallback((filas) => {
    setData((prev) => {
      const porSku = new Map();
      for (const p of filas) {
        if (!porSku.has(p.codigoSku)) porSku.set(p.codigoSku, {});
        porSku.get(p.codigoSku)[p.idLista] = {
          idPrecio: p.idPrecio,
          idLista: p.idLista,
          precioPaquete: p.precioPaquete,
          precioPorUnidad: p.precioPorUnidad,
          margen: p.margen ?? null,
        };
      }
      return {
        ...prev,
        items: prev.items.map((item) =>
          porSku.has(item.codigoSku)
            ? { ...item, precios: { ...item.precios, ...porSku.get(item.codigoSku) } }
            : item
        ),
      };
    });
  }, []);

  const guardarPrecioInline = async (item, lista, nuevoPaquete) => {
    const actual = item.precios?.[lista.idLista];
    const resultado = await upsertPrecios([
      {
        codigoSku: item.codigoSku,
        idLista: lista.idLista,
        precioPaquete: nuevoPaquete,
        precioPorUnidad: actual
          ? Math.round(actual.precioPorUnidad)
          : sugerirPrecioUnidad(nuevoPaquete, item.unidadesPorPaquete),
        margen: actual?.margen ?? null,
      },
    ]).catch((err) => {
      if (err.message === 'SESSION_EXPIRED') handleSessionExpired();
      throw err;
    });

    aplicarPrecios(resultado.precios ?? []);
  };

  const cambiarActivo = async (item, activo) => {
    // Optimista: la fila se actualiza al instante y se revierte si el API falla.
    setData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.codigoSku === item.codigoSku ? { ...i, activo } : i)),
    }));

    try {
      await setSkuActivo(item.codigoSku, activo);
    } catch (err) {
      setData((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.codigoSku === item.codigoSku ? { ...i, activo: !activo } : i)),
      }));
      if (err.message === 'SESSION_EXPIRED') {
        handleSessionExpired();
        return;
      }
      notificar('error', err.message);
    }
  };

  const cambiarActivoSeleccion = async (activo) => {
    const objetivo = seleccionados.filter((i) => i.activo !== activo);
    if (!objetivo.length) return;

    const resultados = await Promise.allSettled(
      objetivo.map((i) => setSkuActivo(i.codigoSku, activo))
    );

    const okCodigos = new Set(
      objetivo.filter((_, idx) => resultados[idx].status === 'fulfilled').map((i) => i.codigoSku)
    );

    if (okCodigos.size) {
      setData((prev) => ({
        ...prev,
        items: prev.items.map((i) => (okCodigos.has(i.codigoSku) ? { ...i, activo } : i)),
      }));
    }

    const fallidos = objetivo.length - okCodigos.size;
    if (fallidos > 0) {
      const expirada = resultados.some(
        (r) => r.status === 'rejected' && r.reason?.message === 'SESSION_EXPIRED'
      );
      if (expirada) {
        handleSessionExpired();
        return;
      }
      notificar('error', `${fallidos} ${fallidos === 1 ? 'producto no se pudo' : 'productos no se pudieron'} actualizar.`);
    } else {
      notificar('ok', `${okCodigos.size} ${okCodigos.size === 1 ? 'producto' : 'productos'} ${activo ? 'publicados' : 'ocultados'}.`);
    }
  };

  const handleGuardadoModal = ({ item, recargar }) => {
    setModal(null);
    if (recargar) {
      cargar();
      notificar('ok', 'Catálogo actualizado.');
      return;
    }
    setData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.codigoSku === item.codigoSku ? item : i)),
    }));
    notificar('ok', `${item.codigoSku} guardado.`);
  };

  const handleMasivoAplicado = (resultado, lista) => {
    aplicarPrecios(resultado.precios ?? []);
    setMasivoAbierto(false);
    const total = (resultado.creados ?? 0) + (resultado.actualizados ?? 0);
    notificar('ok', `${total} ${total === 1 ? 'precio actualizado' : 'precios actualizados'} en ${lista.nombre}.`);
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <main className="admin__main admin__main--ancho">
      <div className="prod__header">
        <div>
          <h2 className="prod__title">Productos y precios</h2>
          <p className="prod__subtitle">
            Administra el catálogo que ven los clientes: precios por lista, presentación y disponibilidad.
          </p>
        </div>
        <div className="prod__header-actions">
          <button type="button" className="admin__refresh" onClick={cargar} disabled={status === 'loading'}>
            <FaSyncAlt aria-hidden="true" /> Actualizar
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => setModal({ modo: 'crear' })}
            disabled={status !== 'ok'}
          >
            <FaPlus aria-hidden="true" /> Nuevo producto
          </button>
        </div>
      </div>

      {status === 'ok' && (
        <section className="prod__stats">
          <button
            type="button"
            className={`prod-stat${estado === 'TODOS' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('TODOS')}
          >
            <FaBoxOpen className="prod-stat__icon prod-stat__icon--neutro" aria-hidden="true" />
            <span className="prod-stat__valor">{resumen.total}</span>
            <span className="prod-stat__label">Productos</span>
          </button>
          <button
            type="button"
            className={`prod-stat${estado === 'ACTIVOS' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('ACTIVOS')}
          >
            <FaCheckCircle className="prod-stat__icon prod-stat__icon--ok" aria-hidden="true" />
            <span className="prod-stat__valor">{resumen.activos}</span>
            <span className="prod-stat__label">Visibles en la tienda</span>
          </button>
          <button
            type="button"
            className={`prod-stat${estado === 'INACTIVOS' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('INACTIVOS')}
          >
            <FaEyeSlash className="prod-stat__icon prod-stat__icon--muted" aria-hidden="true" />
            <span className="prod-stat__valor">{resumen.ocultos}</span>
            <span className="prod-stat__label">Ocultos</span>
          </button>
          <button
            type="button"
            className={`prod-stat${estado === 'SIN_PRECIO' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('SIN_PRECIO')}
          >
            <FaExclamationTriangle className="prod-stat__icon prod-stat__icon--alerta" aria-hidden="true" />
            <span className="prod-stat__valor">{resumen.sinPrecio}</span>
            <span className="prod-stat__label">Sin precio {LISTA_WEB}</span>
          </button>
        </section>
      )}

      <div className="admin__toolbar prod__toolbar">
        <input
          type="search"
          className="admin__search"
          placeholder="Buscar por SKU, producto, sabor o etiqueta…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="prod__select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="TODAS">Todas las categorías</option>
          {data.categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
          ))}
        </select>

        <div className="admin__filters">
          {ESTADOS.map((e) => (
            <button
              key={e.key}
              type="button"
              className={`admin__filter${estado === e.key ? ' admin__filter--active' : ''}`}
              onClick={() => setEstado(e.key)}
            >
              {e.label}
            </button>
          ))}
        </div>

        <span className="admin__count-label">
          {visibles.length} {visibles.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {seleccionados.length > 0 && (
        <div className="prod__bulk">
          <span className="prod__bulk-count">
            {seleccionados.length} {seleccionados.length === 1 ? 'seleccionado' : 'seleccionados'}
          </span>
          <div className="prod__bulk-actions">
            <button type="button" className="admin-btn" onClick={() => setMasivoAbierto(true)}>
              <FaTags aria-hidden="true" /> Ajustar precios
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => cambiarActivoSeleccion(true)}>
              Publicar
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => cambiarActivoSeleccion(false)}>
              Ocultar
            </button>
            <button type="button" className="prod__bulk-clear" onClick={() => setSeleccion(new Set())}>
              Limpiar selección
            </button>
          </div>
        </div>
      )}

      {status === 'loading' && <p className="admin__status">Cargando catálogo…</p>}

      {status === 'error' && (
        <div className="admin__status admin__status--error">
          <p>No se pudo cargar el catálogo: {error}</p>
          <button type="button" onClick={cargar}>Reintentar</button>
        </div>
      )}

      {status === 'ok' && visibles.length === 0 && (
        <div className="prod__vacio">
          <FaBoxOpen aria-hidden="true" />
          <p>No hay productos que coincidan con los filtros.</p>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={() => { setBusqueda(''); setCategoria('TODAS'); setEstado('TODOS'); }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {status === 'ok' && visibles.length > 0 && (
        <div className="admin__table-wrap prod__table-wrap">
          <table className="admin__table prod__table">
            <thead>
              <tr>
                <th className="prod__col-check">
                  <input
                    type="checkbox"
                    checked={todosSeleccionados}
                    onChange={alternarTodos}
                    aria-label="Seleccionar todos los productos visibles"
                  />
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('producto')}>
                    Producto{indicadorOrden('producto')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('presentacion')}>
                    Presentación{indicadorOrden('presentacion')}
                  </button>
                </th>
                {data.listas.map((lista) => (
                  <th key={lista.idLista}>
                    <button type="button" className="prod__th-btn" onClick={() => ordenarPor(lista.idLista)}>
                      {lista.nombre}{indicadorOrden(lista.idLista)}
                    </button>
                  </th>
                ))}
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('estado')}>
                    Estado{indicadorOrden('estado')}
                  </button>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibles.map((item) => (
                <tr
                  className={`admin-row prod-row${seleccion.has(item.codigoSku) ? ' prod-row--sel' : ''}${item.activo ? '' : ' prod-row--oculto'}`}
                  key={item.codigoSku}
                >
                  <td className="prod__col-check" data-label="">
                    <input
                      type="checkbox"
                      checked={seleccion.has(item.codigoSku)}
                      onChange={() => alternarSeleccion(item.codigoSku)}
                      aria-label={`Seleccionar ${item.codigoSku}`}
                    />
                  </td>

                  <td data-label="Producto">
                    <div className="prod-row__producto">
                      <div className="prod-row__thumb">
                        {item.urlImage ? (
                          <img src={item.urlImage} alt="" loading="lazy" />
                        ) : (
                          <FaImage aria-hidden="true" />
                        )}
                      </div>
                      <div className="prod-row__info">
                        <span className="prod-row__nombre">
                          {item.nombreProducto}
                          <span className="prod-row__sabor">{item.nombreSabor}</span>
                        </span>
                        <span className="prod-row__meta">
                          <code>{item.codigoSku}</code>
                          {item.nombreCategoria && <span className="prod-row__cat">{item.nombreCategoria}</span>}
                        </span>
                        {item.badgeDescripcion && (
                          <span className="prod-row__badge">{item.badgeDescripcion}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td data-label="Presentación" className="prod-row__presentacion">
                    {describirPresentacion(item)}
                  </td>

                  {data.listas.map((lista) => (
                    <td key={lista.idLista} data-label={lista.nombre} className="prod-row__precio">
                      <PrecioInline
                        precio={item.precios?.[lista.idLista]}
                        lista={lista}
                        codigoSku={item.codigoSku}
                        onGuardar={(nuevo) => guardarPrecioInline(item, lista, nuevo)}
                      />
                    </td>
                  ))}

                  <td data-label="Estado">
                    <label className="prod-switch" title={item.activo ? 'Visible en la tienda' : 'Oculto'}>
                      <input
                        type="checkbox"
                        checked={item.activo}
                        onChange={(e) => cambiarActivo(item, e.target.checked)}
                        aria-label={`${item.activo ? 'Ocultar' : 'Publicar'} ${item.codigoSku}`}
                      />
                      <span className="prod-switch__track" aria-hidden="true"><span className="prod-switch__thumb" /></span>
                      <span className="prod-switch__label">{item.activo ? 'Visible' : 'Oculto'}</span>
                    </label>
                  </td>

                  <td className="admin-row__toggle-cell">
                    <button
                      type="button"
                      className="admin-row__toggle"
                      onClick={() => setModal({ modo: 'editar', item })}
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

      {modal && (
        <ProductoModal
          modo={modal.modo}
          item={modal.item}
          catalogo={data}
          onCerrar={() => setModal(null)}
          onGuardado={handleGuardadoModal}
          onSessionExpired={handleSessionExpired}
        />
      )}

      {masivoAbierto && (
        <PreciosMasivosModal
          items={seleccionados}
          listas={data.listas}
          onCerrar={() => setMasivoAbierto(false)}
          onAplicado={handleMasivoAplicado}
          onSessionExpired={handleSessionExpired}
        />
      )}

      {aviso && (
        <div className={`prod-toast prod-toast--${aviso.tipo}`} role="status">
          {aviso.tipo === 'ok' ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationTriangle aria-hidden="true" />}
          <span>{aviso.texto}</span>
        </div>
      )}
    </main>
  );
}

export default AdminProductosPage;
