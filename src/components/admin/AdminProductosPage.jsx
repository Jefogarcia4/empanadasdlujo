import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEyeSlash,
  FaImage,
  FaLayerGroup,
  FaPlus,
  FaSyncAlt,
  FaTags,
} from 'react-icons/fa';
import {
  actualizarCombo,
  fetchCatalogoAdmin,
  setComboActivo,
  setSkuActivo,
  upsertPrecios,
} from '../../services/catalogoAdmin';
import ComboModal from './productos/ComboModal';
import PrecioInline from './productos/PrecioInline';
import PreciosMasivosModal from './productos/PreciosMasivosModal';
import ProductoModal from './productos/ProductoModal';
import {
  describirPresentacion,
  formatCOP,
  formatNumero,
  payloadCombo,
  sugerirPrecioUnidad,
} from './productos/utils';
import '../../styles/AdminProductos.css';

// Lista que define el precio que ve el cliente en la web (ver CatalogoController).
const LISTA_WEB = 'Web';

const VISTAS = [
  { key: 'productos', label: 'Productos', icon: FaBoxOpen },
  { key: 'combos', label: 'Combos', icon: FaLayerGroup },
];

const ESTADOS_BASE = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ACTIVOS', label: 'Visibles' },
  { key: 'INACTIVOS', label: 'Ocultos' },
];

const ORDEN_INICIAL = { campo: 'catalogo', dir: 'asc' };

function AdminProductosPage({ onSessionExpired }) {
  const [data, setData] = useState({
    items: [], combos: [], productos: [], categorias: [], sabores: [], listas: [],
  });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const [vista, setVista] = useState('productos');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('TODAS');
  const [subcategoria, setSubcategoria] = useState('TODAS');
  const [estado, setEstado] = useState('TODOS');
  const [orden, setOrden] = useState(ORDEN_INICIAL);

  const [seleccion, setSeleccion] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { tipo: 'producto'|'combo', modo, item }
  const [masivoAbierto, setMasivoAbierto] = useState(false);
  const [aviso, setAviso] = useState(null);

  const esCombos = vista === 'combos';

  const handleSessionExpired = useCallback(() => {
    onSessionExpired?.();
  }, [onSessionExpired]);

  const notificar = useCallback((tipo, texto) => setAviso({ tipo, texto }), []);

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

  // Productos y combos no comparten clave (codigoSku vs idCombo) ni columnas:
  // al cambiar de vista se reinician selección, orden y filtro de estado.
  const cambiarVista = (nueva) => {
    setVista(nueva);
    setSeleccion(new Set());
    setOrden(ORDEN_INICIAL);
    setEstado('TODOS');
  };

  const estados = useMemo(
    () => [...ESTADOS_BASE, { key: 'INCOMPLETOS', label: esCombos ? 'Sin vincular' : 'Sin precio web' }],
    [esCombos]
  );

  const subcategorias = useMemo(
    () => [...new Set(data.combos.map((c) => c.subcategoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')),
    [data.combos]
  );

  // ─── Filtro + orden: productos ──────────────────────────────
  const productosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    const list = data.items.filter((item) => {
      if (categoria !== 'TODAS' && String(item.idCategoria) !== String(categoria)) return false;
      if (estado === 'ACTIVOS' && !item.activo) return false;
      if (estado === 'INACTIVOS' && item.activo) return false;
      if (estado === 'INCOMPLETOS' && tienePrecioWeb(item)) return false;
      if (!q) return true;
      return [item.codigoSku, item.nombreProducto, item.nombreSabor, item.nombreCategoria, item.badgeDescripcion]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(q));
    });

    const dir = orden.dir === 'asc' ? 1 : -1;
    const precioDe = (item, idLista) => item.precios?.[idLista]?.precioPaquete ?? -1;

    return [...list].sort((a, b) => {
      if (orden.campo === 'catalogo') {
        const oa = a.orden ?? Number.MAX_SAFE_INTEGER;
        const ob = b.orden ?? Number.MAX_SAFE_INTEGER;
        if (oa !== ob) return (oa - ob) * dir;
        return a.codigoSku.localeCompare(b.codigoSku) * dir;
      }
      if (orden.campo === 'producto') {
        return `${a.nombreProducto} ${a.nombreSabor}`.localeCompare(`${b.nombreProducto} ${b.nombreSabor}`, 'es') * dir;
      }
      if (orden.campo === 'presentacion') return ((a.gramajeG ?? 0) - (b.gramajeG ?? 0)) * dir;
      if (orden.campo === 'estado') return ((a.activo ? 1 : 0) - (b.activo ? 1 : 0)) * dir;
      if (typeof orden.campo === 'number') return (precioDe(a, orden.campo) - precioDe(b, orden.campo)) * dir;
      return 0;
    });
  }, [data.items, busqueda, categoria, estado, orden, tienePrecioWeb]);

  // ─── Filtro + orden: combos ─────────────────────────────────
  const combosVisibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    const list = data.combos.filter((combo) => {
      if (subcategoria !== 'TODAS' && (combo.subcategoria ?? '') !== subcategoria) return false;
      if (estado === 'ACTIVOS' && !combo.activo) return false;
      if (estado === 'INACTIVOS' && combo.activo) return false;
      if (estado === 'INCOMPLETOS' && (combo.componentes?.length ?? 0) > 0) return false;
      if (!q) return true;
      return [combo.codigoCombo, combo.nombre, combo.subcategoria, combo.descripcionCorta, combo.badgeDescripcion]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(q));
    });

    const dir = orden.dir === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      if (orden.campo === 'catalogo') {
        const oa = a.orden ?? Number.MAX_SAFE_INTEGER;
        const ob = b.orden ?? Number.MAX_SAFE_INTEGER;
        if (oa !== ob) return (oa - ob) * dir;
        return a.codigoCombo.localeCompare(b.codigoCombo) * dir;
      }
      if (orden.campo === 'combo') return a.nombre.localeCompare(b.nombre, 'es') * dir;
      if (orden.campo === 'incluye') return ((a.componentes?.length ?? 0) - (b.componentes?.length ?? 0)) * dir;
      if (orden.campo === 'precioNormal') return ((a.precioNormal ?? 0) - (b.precioNormal ?? 0)) * dir;
      if (orden.campo === 'precioCombo') return ((a.precioCombo ?? 0) - (b.precioCombo ?? 0)) * dir;
      if (orden.campo === 'ahorro') return ((a.ahorro ?? 0) - (b.ahorro ?? 0)) * dir;
      if (orden.campo === 'estado') return ((a.activo ? 1 : 0) - (b.activo ? 1 : 0)) * dir;
      return 0;
    });
  }, [data.combos, busqueda, subcategoria, estado, orden]);

  const visibles = esCombos ? combosVisibles : productosVisibles;
  const claveDe = useCallback((fila) => (esCombos ? fila.idCombo : fila.codigoSku), [esCombos]);

  const resumen = useMemo(() => {
    if (esCombos) {
      const total = data.combos.length;
      const activos = data.combos.filter((c) => c.activo).length;
      return {
        total,
        activos,
        ocultos: total - activos,
        incompletos: data.combos.filter((c) => (c.componentes?.length ?? 0) === 0).length,
      };
    }
    const total = data.items.length;
    const activos = data.items.filter((i) => i.activo).length;
    return {
      total,
      activos,
      ocultos: total - activos,
      incompletos: data.items.filter((i) => !tienePrecioWeb(i)).length,
    };
  }, [esCombos, data.items, data.combos, tienePrecioWeb]);

  const seleccionados = useMemo(
    () => visibles.filter((f) => seleccion.has(claveDe(f))),
    [visibles, seleccion, claveDe]
  );

  const todosSeleccionados = visibles.length > 0 && seleccionados.length === visibles.length;

  const alternarSeleccion = (clave) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(clave)) next.delete(clave);
      else next.add(clave);
      return next;
    });
  };

  const alternarTodos = () => {
    setSeleccion(todosSeleccionados ? new Set() : new Set(visibles.map(claveDe)));
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

  const reemplazarCombo = useCallback((actualizado) => {
    setData((prev) => ({
      ...prev,
      combos: prev.combos.map((c) => (c.idCombo === actualizado.idCombo ? actualizado : c)),
    }));
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

  // El API de combos no tiene PATCH de precio: se reenvía el combo completo.
  const guardarPrecioCombo = async (combo, campo, nuevo) => {
    const actualizado = await actualizarCombo(
      combo.idCombo,
      payloadCombo(combo, { [campo]: nuevo })
    ).catch((err) => {
      if (err.message === 'SESSION_EXPIRED') handleSessionExpired();
      throw err;
    });

    reemplazarCombo(actualizado);
  };

  const cambiarActivo = async (fila, activo) => {
    const clave = claveDe(fila);
    const parche = (lista, valor) =>
      lista.map((f) => (claveDe(f) === clave ? { ...f, activo: valor } : f));

    // Optimista: la fila se actualiza al instante y se revierte si el API falla.
    setData((prev) => (esCombos
      ? { ...prev, combos: parche(prev.combos, activo) }
      : { ...prev, items: parche(prev.items, activo) }));

    try {
      if (esCombos) await setComboActivo(fila.idCombo, activo);
      else await setSkuActivo(fila.codigoSku, activo);
    } catch (err) {
      setData((prev) => (esCombos
        ? { ...prev, combos: parche(prev.combos, !activo) }
        : { ...prev, items: parche(prev.items, !activo) }));

      if (err.message === 'SESSION_EXPIRED') {
        handleSessionExpired();
        return;
      }
      notificar('error', err.message);
    }
  };

  const cambiarActivoSeleccion = async (activo) => {
    const objetivo = seleccionados.filter((f) => f.activo !== activo);
    if (!objetivo.length) return;

    const resultados = await Promise.allSettled(
      objetivo.map((f) => (esCombos ? setComboActivo(f.idCombo, activo) : setSkuActivo(f.codigoSku, activo)))
    );

    const ok = new Set(
      objetivo.filter((_, idx) => resultados[idx].status === 'fulfilled').map(claveDe)
    );

    if (ok.size) {
      const parche = (lista) => lista.map((f) => (ok.has(claveDe(f)) ? { ...f, activo } : f));
      setData((prev) => (esCombos
        ? { ...prev, combos: parche(prev.combos) }
        : { ...prev, items: parche(prev.items) }));
    }

    const fallidos = objetivo.length - ok.size;
    if (fallidos > 0) {
      const expirada = resultados.some((r) => r.status === 'rejected' && r.reason?.message === 'SESSION_EXPIRED');
      if (expirada) {
        handleSessionExpired();
        return;
      }
      notificar('error', `${fallidos} ${fallidos === 1 ? 'item no se pudo' : 'items no se pudieron'} actualizar.`);
    } else {
      notificar('ok', `${ok.size} ${ok.size === 1 ? 'item' : 'items'} ${activo ? 'publicados' : 'ocultados'}.`);
    }
  };

  const handleGuardadoProducto = ({ item, recargar }) => {
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

  const handleGuardadoCombo = (guardado) => {
    const creando = modal?.modo === 'crear';
    setModal(null);
    setData((prev) => ({
      ...prev,
      combos: creando
        ? [...prev.combos, guardado]
        : prev.combos.map((c) => (c.idCombo === guardado.idCombo ? guardado : c)),
    }));
    notificar('ok', `${guardado.codigoCombo} guardado.`);
  };

  const handleMasivoAplicado = (resultado, lista) => {
    aplicarPrecios(resultado.precios ?? []);
    setMasivoAbierto(false);
    const total = (resultado.creados ?? 0) + (resultado.actualizados ?? 0);
    notificar('ok', `${total} ${total === 1 ? 'precio actualizado' : 'precios actualizados'} en ${lista.nombre}.`);
  };

  const abrirNuevo = () =>
    setModal({ tipo: esCombos ? 'combo' : 'producto', modo: 'crear' });

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('TODAS');
    setSubcategoria('TODAS');
    setEstado('TODOS');
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <main className="admin__main admin__main--ancho">
      <div className="prod__header">
        <div>
          <h2 className="prod__title">Productos y precios</h2>
          <p className="prod__subtitle">
            Administra el catálogo que ven los clientes: precios por lista, combos, presentación y disponibilidad.
          </p>
        </div>
        <div className="prod__header-actions">
          <button type="button" className="admin__refresh" onClick={cargar} disabled={status === 'loading'}>
            <FaSyncAlt aria-hidden="true" /> Actualizar
          </button>
          <button type="button" className="admin-btn" onClick={abrirNuevo} disabled={status !== 'ok'}>
            <FaPlus aria-hidden="true" /> {esCombos ? 'Nuevo combo' : 'Nuevo producto'}
          </button>
        </div>
      </div>

      <div className="prod__vistas" role="tablist" aria-label="Tipo de item">
        {VISTAS.map((v) => {
          const Icon = v.icon;
          const total = v.key === 'combos' ? data.combos.length : data.items.length;
          return (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={vista === v.key}
              className={`prod__vista${vista === v.key ? ' prod__vista--activa' : ''}`}
              onClick={() => cambiarVista(v.key)}
            >
              <Icon aria-hidden="true" />
              {v.label}
              {status === 'ok' && <span className="prod__vista-count">{total}</span>}
            </button>
          );
        })}
      </div>

      {status === 'ok' && (
        <section className="prod__stats">
          <button
            type="button"
            className={`prod-stat${estado === 'TODOS' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('TODOS')}
          >
            {esCombos
              ? <FaLayerGroup className="prod-stat__icon prod-stat__icon--neutro" aria-hidden="true" />
              : <FaBoxOpen className="prod-stat__icon prod-stat__icon--neutro" aria-hidden="true" />}
            <span className="prod-stat__valor">{resumen.total}</span>
            <span className="prod-stat__label">{esCombos ? 'Combos' : 'Productos'}</span>
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
            className={`prod-stat${estado === 'INCOMPLETOS' ? ' prod-stat--activo' : ''}`}
            onClick={() => setEstado('INCOMPLETOS')}
          >
            <FaExclamationTriangle className="prod-stat__icon prod-stat__icon--alerta" aria-hidden="true" />
            <span className="prod-stat__valor">{resumen.incompletos}</span>
            <span className="prod-stat__label">
              {esCombos ? 'Sin productos vinculados' : `Sin precio ${LISTA_WEB}`}
            </span>
          </button>
        </section>
      )}

      <div className="admin__toolbar prod__toolbar">
        <input
          type="search"
          className="admin__search"
          placeholder={esCombos
            ? 'Buscar por código, nombre o descripción…'
            : 'Buscar por SKU, producto, sabor o etiqueta…'}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {esCombos ? (
          subcategorias.length > 0 && (
            <select
              className="prod__select"
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value)}
              aria-label="Filtrar por subcategoría"
            >
              <option value="TODAS">Todas las subcategorías</option>
              {subcategorias.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )
        ) : (
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
        )}

        <div className="admin__filters">
          {estados.map((e) => (
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
            {!esCombos && (
              <button type="button" className="admin-btn" onClick={() => setMasivoAbierto(true)}>
                <FaTags aria-hidden="true" /> Ajustar precios
              </button>
            )}
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
          <p>No hay {esCombos ? 'combos' : 'productos'} que coincidan con los filtros.</p>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      )}

      {/* ── Tabla de productos ─────────────────────────────── */}
      {status === 'ok' && !esCombos && visibles.length > 0 && (
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
              {productosVisibles.map((item) => (
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
                        {item.urlImage ? <img src={item.urlImage} alt="" loading="lazy" /> : <FaImage aria-hidden="true" />}
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
                        {item.badgeDescripcion && <span className="prod-row__badge">{item.badgeDescripcion}</span>}
                      </div>
                    </div>
                  </td>

                  <td data-label="Presentación" className="prod-row__presentacion">
                    {describirPresentacion(item)}
                  </td>

                  {data.listas.map((lista) => {
                    const precio = item.precios?.[lista.idLista];
                    return (
                      <td key={lista.idLista} data-label={lista.nombre} className="prod-row__precio">
                        <PrecioInline
                          valor={precio?.precioPaquete ?? null}
                          subtitulo={precio
                            ? `${formatCOP(precio.precioPorUnidad)} / und${precio.margen != null ? ` · ${precio.margen}%` : ''}`
                            : null}
                          etiqueta={`precio ${lista.nombre} de ${item.codigoSku}`}
                          onGuardar={(nuevo) => guardarPrecioInline(item, lista, nuevo)}
                        />
                      </td>
                    );
                  })}

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
                      onClick={() => setModal({ tipo: 'producto', modo: 'editar', item })}
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

      {/* ── Tabla de combos ────────────────────────────────── */}
      {status === 'ok' && esCombos && visibles.length > 0 && (
        <div className="admin__table-wrap prod__table-wrap">
          <table className="admin__table prod__table">
            <thead>
              <tr>
                <th className="prod__col-check">
                  <input
                    type="checkbox"
                    checked={todosSeleccionados}
                    onChange={alternarTodos}
                    aria-label="Seleccionar todos los combos visibles"
                  />
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('combo')}>
                    Combo{indicadorOrden('combo')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('incluye')}>
                    Incluye{indicadorOrden('incluye')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('precioNormal')}>
                    Precio normal{indicadorOrden('precioNormal')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('precioCombo')}>
                    Precio combo{indicadorOrden('precioCombo')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('ahorro')}>
                    Ahorro{indicadorOrden('ahorro')}
                  </button>
                </th>
                <th>
                  <button type="button" className="prod__th-btn" onClick={() => ordenarPor('estado')}>
                    Estado{indicadorOrden('estado')}
                  </button>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {combosVisibles.map((combo) => {
                const ahorro = combo.ahorro ?? (combo.precioNormal - combo.precioCombo);
                const porcentaje = combo.precioNormal > 0 ? Math.round((ahorro / combo.precioNormal) * 100) : 0;
                const incluidos = combo.componentes ?? [];

                return (
                  <tr
                    className={`admin-row prod-row${seleccion.has(combo.idCombo) ? ' prod-row--sel' : ''}${combo.activo ? '' : ' prod-row--oculto'}`}
                    key={combo.idCombo}
                  >
                    <td className="prod__col-check" data-label="">
                      <input
                        type="checkbox"
                        checked={seleccion.has(combo.idCombo)}
                        onChange={() => alternarSeleccion(combo.idCombo)}
                        aria-label={`Seleccionar ${combo.codigoCombo}`}
                      />
                    </td>

                    <td data-label="Combo">
                      <div className="prod-row__producto">
                        <div className="prod-row__thumb">
                          {combo.urlImage ? <img src={combo.urlImage} alt="" loading="lazy" /> : <FaLayerGroup aria-hidden="true" />}
                        </div>
                        <div className="prod-row__info">
                          <span className="prod-row__nombre">{combo.nombre}</span>
                          <span className="prod-row__meta">
                            <code>{combo.codigoCombo}</code>
                            {combo.subcategoria && <span className="prod-row__cat">{combo.subcategoria}</span>}
                          </span>
                          {combo.badgeDescripcion && <span className="prod-row__badge">{combo.badgeDescripcion}</span>}
                        </div>
                      </div>
                    </td>

                    <td data-label="Incluye" className="prod-row__incluye">
                      {incluidos.length === 0 ? (
                        // Estado válido: la web arma el "incluye" desde descripcionLarga.
                        <span className="prod-row__sin-vinculo">Sin productos vinculados</span>
                      ) : (
                        <>
                          <ul className="pcombo__lista">
                            {incluidos.slice(0, 3).map((c) => (
                              <li key={c.codigoSku}>
                                <strong>{c.cantidadPaquetes}×</strong> {c.producto ?? c.codigoSku} {c.sabor}
                              </li>
                            ))}
                          </ul>
                          {incluidos.length > 3 && (
                            <span className="pcombo__lista-mas">+{incluidos.length - 3} más</span>
                          )}
                          {(combo.pesoTotalG || combo.unidadesTotales) && (
                            <span className="pcombo__totales">
                              {combo.pesoTotalG ? `${formatNumero(combo.pesoTotalG, 0)} g` : ''}
                              {combo.pesoTotalG && combo.unidadesTotales ? ' · ' : ''}
                              {combo.unidadesTotales ? `${combo.unidadesTotales} und` : ''}
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    <td data-label="Precio normal" className="prod-row__precio">
                      <PrecioInline
                        valor={combo.precioNormal ?? null}
                        subtitulo="por separado"
                        etiqueta={`precio normal de ${combo.codigoCombo}`}
                        onGuardar={(nuevo) => guardarPrecioCombo(combo, 'precioNormal', nuevo)}
                      />
                    </td>

                    <td data-label="Precio combo" className="prod-row__precio">
                      <PrecioInline
                        valor={combo.precioCombo ?? null}
                        subtitulo="precio fijo"
                        etiqueta={`precio del combo ${combo.codigoCombo}`}
                        onGuardar={(nuevo) => guardarPrecioCombo(combo, 'precioCombo', nuevo)}
                      />
                    </td>

                    <td data-label="Ahorro">
                      {ahorro > 0 ? (
                        <span className="pcombo__ahorro-chip">
                          {formatCOP(ahorro)} <small>{porcentaje}%</small>
                        </span>
                      ) : (
                        <span className="pcombo__ahorro-chip pcombo__ahorro-chip--nulo">
                          {ahorro < 0 ? `−${formatCOP(Math.abs(ahorro))}` : 'Sin ahorro'}
                        </span>
                      )}
                    </td>

                    <td data-label="Estado">
                      <label className="prod-switch" title={combo.activo ? 'Visible en la tienda' : 'Oculto'}>
                        <input
                          type="checkbox"
                          checked={combo.activo}
                          onChange={(e) => cambiarActivo(combo, e.target.checked)}
                          aria-label={`${combo.activo ? 'Ocultar' : 'Publicar'} ${combo.codigoCombo}`}
                        />
                        <span className="prod-switch__track" aria-hidden="true"><span className="prod-switch__thumb" /></span>
                        <span className="prod-switch__label">{combo.activo ? 'Visible' : 'Oculto'}</span>
                      </label>
                    </td>

                    <td className="admin-row__toggle-cell">
                      <button
                        type="button"
                        className="admin-row__toggle"
                        onClick={() => setModal({ tipo: 'combo', modo: 'editar', item: combo })}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal?.tipo === 'producto' && (
        <ProductoModal
          modo={modal.modo}
          item={modal.item}
          catalogo={data}
          onCerrar={() => setModal(null)}
          onGuardado={handleGuardadoProducto}
          onSessionExpired={handleSessionExpired}
        />
      )}

      {modal?.tipo === 'combo' && (
        <ComboModal
          modo={modal.modo}
          combo={modal.item}
          catalogo={data}
          listaWeb={listaWeb}
          onCerrar={() => setModal(null)}
          onGuardado={handleGuardadoCombo}
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
