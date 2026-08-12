import { useEffect, useMemo, useState } from 'react';
import { FaMagic, FaTrashAlt } from 'react-icons/fa';
import {
  crearCategoria,
  crearProducto,
  crearSabor,
  createSkuCompleto,
  eliminarPrecio,
  updateSku,
  upsertPrecios,
} from '../../../services/catalogoAdmin';
import ImagenUploader from './ImagenUploader';
import { formatCOP, parsePrecio, sugerirPrecioUnidad } from './utils';

// Valor centinela del <select> cuando el admin quiere dar de alta un maestro nuevo.
const NUEVO = '__nuevo__';

const vacio = () => ({
  codigoSku: '',
  idCategoria: '',
  nombreCategoriaNueva: '',
  idProducto: '',
  nombreProductoNueva: '',
  idSabor: '',
  nombreSaborNueva: '',
  gramajeG: '',
  unidadesPorPaquete: '',
  orden: '',
  badgeDescripcion: '',
  urlImage: '',
  activo: true,
});

const desdeItem = (item) => ({
  codigoSku: item.codigoSku,
  idCategoria: item.idCategoria ?? '',
  nombreCategoriaNueva: '',
  idProducto: item.idProducto ?? '',
  nombreProductoNueva: '',
  idSabor: item.idSabor ?? '',
  nombreSaborNueva: '',
  gramajeG: item.gramajeG ?? '',
  unidadesPorPaquete: item.unidadesPorPaquete ?? '',
  orden: item.orden ?? '',
  badgeDescripcion: item.badgeDescripcion ?? '',
  urlImage: item.urlImage ?? '',
  activo: !!item.activo,
});

// Los precios se editan como texto para no pelear con el formateo mientras se escribe.
const preciosDesdeItem = (item, listas) => {
  const mapa = {};
  for (const lista of listas) {
    const precio = item?.precios?.[lista.idLista];
    mapa[lista.idLista] = {
      idPrecio: precio?.idPrecio ?? null,
      precioPaquete: precio ? String(Math.round(precio.precioPaquete)) : '',
      precioPorUnidad: precio ? String(Math.round(precio.precioPorUnidad)) : '',
      margen: precio?.margen != null ? String(precio.margen) : '',
    };
  }
  return mapa;
};

/** Select de maestro con opción de crear uno nuevo escribiendo el nombre. */
function SelectCreable({ label, requerido, opciones, valorId, nombreNuevo, onChangeId, onChangeNombre, placeholder, disabled, ayuda }) {
  return (
    <div className="pform__field">
      <span className="pform__label">
        {label}
        {requerido && <span className="pform__req"> *</span>}
      </span>
      <select
        className="pform__input"
        value={valorId}
        disabled={disabled}
        onChange={(e) => onChangeId(e.target.value)}
      >
        <option value="">Selecciona…</option>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>{o.nombre}</option>
        ))}
        <option value={NUEVO}>+ Crear nuevo…</option>
      </select>

      {valorId === NUEVO && (
        <input
          className="pform__input pform__input--nuevo"
          type="text"
          autoFocus
          placeholder={placeholder}
          value={nombreNuevo}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
      )}
      {ayuda && <span className="pform__hint">{ayuda}</span>}
    </div>
  );
}

function ProductoModal({ modo, item, catalogo, onCerrar, onGuardado, onSessionExpired }) {
  const esCrear = modo === 'crear';
  const { categorias, productos, sabores, listas } = catalogo;

  const [form, setForm] = useState(() => (esCrear ? vacio() : desdeItem(item)));
  const [precios, setPrecios] = useState(() => preciosDesdeItem(item, listas));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  // Snapshot inmutable del estado inicial: sirve para saber si hay cambios sin guardar.
  const [inicial] = useState(() => ({
    form: esCrear ? vacio() : desdeItem(item),
    precios: preciosDesdeItem(item, listas),
  }));

  const setCampo = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setPrecio = (idLista, key, value) =>
    setPrecios((p) => ({ ...p, [idLista]: { ...p[idLista], [key]: value } }));

  const sucio = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(inicial.form) ||
      JSON.stringify(precios) !== JSON.stringify(inicial.precios),
    [form, precios, inicial]
  );

  const intentarCerrar = () => {
    if (sucio && !guardando) {
      setConfirmandoSalida(true);
      return;
    }
    onCerrar();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') intentarCerrar();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  // El producto depende de la categoría elegida: al cambiarla se limpia la selección.
  const productosDeCategoria = useMemo(() => {
    if (form.idCategoria === NUEVO || !form.idCategoria) return [];
    return productos.filter((p) => String(p.idCategoria) === String(form.idCategoria));
  }, [productos, form.idCategoria]);

  const handleCategoria = (valor) => {
    setForm((f) => ({
      ...f,
      idCategoria: valor,
      nombreCategoriaNueva: valor === NUEVO ? f.nombreCategoriaNueva : '',
      idProducto: valor === NUEVO ? NUEVO : '',
      nombreProductoNueva: '',
    }));
  };

  const unidades = Number(form.unidadesPorPaquete) || 0;

  // Al salir del precio de paquete se propone el precio por unidad si está vacío.
  const autocompletarUnidad = (idLista) => {
    const fila = precios[idLista];
    const paquete = parsePrecio(fila.precioPaquete);
    if (paquete === null || fila.precioPorUnidad.trim() !== '' || unidades <= 0) return;
    setPrecio(idLista, 'precioPorUnidad', String(sugerirPrecioUnidad(paquete, unidades)));
  };

  const recalcularUnidad = (idLista) => {
    const paquete = parsePrecio(precios[idLista].precioPaquete);
    if (paquete === null || unidades <= 0) return;
    setPrecio(idLista, 'precioPorUnidad', String(sugerirPrecioUnidad(paquete, unidades)));
  };

  const quitarPrecio = async (idLista) => {
    const fila = precios[idLista];
    if (fila.idPrecio) {
      try {
        await eliminarPrecio(fila.idPrecio);
      } catch (err) {
        if (err.message === 'SESSION_EXPIRED') return onSessionExpired?.();
        setError(err.message);
        return;
      }
    }
    setPrecios((p) => ({ ...p, [idLista]: { idPrecio: null, precioPaquete: '', precioPorUnidad: '', margen: '' } }));
  };

  const validar = () => {
    if (esCrear && !form.codigoSku.trim()) return 'El código SKU es obligatorio.';
    if (esCrear && form.codigoSku.trim().length > 20) return 'El código SKU no puede superar 20 caracteres.';
    if (!form.idCategoria) return 'Selecciona una categoría.';
    if (form.idCategoria === NUEVO && !form.nombreCategoriaNueva.trim()) return 'Escribe el nombre de la nueva categoría.';
    if (!form.idProducto) return 'Selecciona un producto.';
    if (form.idProducto === NUEVO && !form.nombreProductoNueva.trim()) return 'Escribe el nombre del nuevo producto.';
    if (!form.idSabor) return 'Selecciona un sabor.';
    if (form.idSabor === NUEVO && !form.nombreSaborNueva.trim()) return 'Escribe el nombre del nuevo sabor.';
    if (!(Number(form.gramajeG) > 0)) return 'El gramaje debe ser mayor que cero.';
    if (!(Number(form.unidadesPorPaquete) >= 1)) return 'Las unidades por paquete deben ser al menos 1.';

    for (const lista of listas) {
      const fila = precios[lista.idLista];
      if (fila.precioPaquete.trim() === '' && fila.precioPorUnidad.trim() === '') continue;
      const paquete = parsePrecio(fila.precioPaquete);
      if (paquete === null || paquete < 0) return `El precio de paquete de la lista ${lista.nombre} no es válido.`;
    }
    return null;
  };

  // Filas con precio diligenciado, listas para enviar al upsert.
  const preciosDiligenciados = () =>
    listas
      .map((lista) => {
        const fila = precios[lista.idLista];
        const paquete = parsePrecio(fila.precioPaquete);
        if (paquete === null) return null;
        const porUnidad = parsePrecio(fila.precioPorUnidad);
        const margen = fila.margen.trim() === '' ? null : Number.parseInt(fila.margen, 10);
        return {
          idLista: lista.idLista,
          precioPaquete: paquete,
          precioPorUnidad: porUnidad ?? sugerirPrecioUnidad(paquete, unidades),
          margen: Number.isFinite(margen) ? margen : null,
        };
      })
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      if (esCrear) {
        await createSkuCompleto({
          codigoSku: form.codigoSku.trim().toUpperCase(),
          idCategoria: form.idCategoria === NUEVO ? null : Number(form.idCategoria),
          nombreCategoria: form.idCategoria === NUEVO ? form.nombreCategoriaNueva.trim() : null,
          idProducto: form.idProducto === NUEVO ? null : Number(form.idProducto),
          nombreProducto: form.idProducto === NUEVO ? form.nombreProductoNueva.trim() : null,
          idSabor: form.idSabor === NUEVO ? null : Number(form.idSabor),
          nombreSabor: form.idSabor === NUEVO ? form.nombreSaborNueva.trim() : null,
          gramajeG: Number(form.gramajeG),
          unidadesPorPaquete: Number(form.unidadesPorPaquete),
          activo: form.activo,
          orden: form.orden === '' ? null : Number(form.orden),
          badgeDescripcion: form.badgeDescripcion.trim() || null,
          urlImage: form.urlImage.trim() || null,
          precios: preciosDiligenciados(),
        });
        onGuardado({ recargar: true });
        return;
      }

      // Edición: los maestros nuevos se crean antes porque el PUT del SKU solo acepta ids.
      let idCategoria = form.idCategoria;
      if (idCategoria === NUEVO) {
        idCategoria = (await crearCategoria(form.nombreCategoriaNueva.trim())).idCategoria;
      }
      let idProducto = form.idProducto;
      if (idProducto === NUEVO) {
        idProducto = (await crearProducto(form.nombreProductoNueva.trim(), Number(idCategoria))).idProducto;
      }
      let idSabor = form.idSabor;
      if (idSabor === NUEVO) {
        idSabor = (await crearSabor(form.nombreSaborNueva.trim())).idSabor;
      }

      const sku = {
        idProducto: Number(idProducto),
        idSabor: Number(idSabor),
        gramajeG: Number(form.gramajeG),
        unidadesPorPaquete: Number(form.unidadesPorPaquete),
        activo: form.activo,
        orden: form.orden === '' ? null : Number(form.orden),
        badgeDescripcion: form.badgeDescripcion.trim() || null,
        urlImage: form.urlImage.trim() || null,
      };

      await updateSku(item.codigoSku, sku);

      // Vaciar el campo de una lista que sí tenía precio equivale a sacarlo de esa lista.
      const borrados = listas.filter((l) => {
        const fila = precios[l.idLista];
        return fila.idPrecio != null && parsePrecio(fila.precioPaquete) === null;
      });
      for (const lista of borrados) {
        await eliminarPrecio(precios[lista.idLista].idPrecio);
      }

      const filas = preciosDiligenciados().map((p) => ({ ...p, codigoSku: item.codigoSku }));
      const resultado = await upsertPrecios(filas);

      // Se creó algún maestro nuevo → la lista de categorías/productos del padre quedó corta.
      const creoMaestros = form.idCategoria === NUEVO || form.idProducto === NUEVO || form.idSabor === NUEVO;
      if (creoMaestros) {
        onGuardado({ recargar: true });
        return;
      }

      const categoria = categorias.find((c) => String(c.idCategoria) === String(idCategoria));
      const producto = productos.find((p) => String(p.idProducto) === String(idProducto));
      const sabor = sabores.find((s) => String(s.idSabor) === String(idSabor));

      const preciosActualizados = {};
      for (const p of resultado.precios ?? []) {
        preciosActualizados[p.idLista] = {
          idPrecio: p.idPrecio,
          idLista: p.idLista,
          precioPaquete: p.precioPaquete,
          precioPorUnidad: p.precioPorUnidad,
          margen: p.margen ?? null,
        };
      }

      onGuardado({
        item: {
          ...item,
          ...sku,
          codigoSku: item.codigoSku,
          idCategoria: Number(idCategoria),
          nombreCategoria: categoria?.nombre ?? item.nombreCategoria,
          nombreProducto: producto?.nombre ?? item.nombreProducto,
          nombreSabor: sabor?.nombre ?? item.nombreSabor,
          badgeDescripcion: sku.badgeDescripcion ?? '',
          urlImage: sku.urlImage ?? '',
          precios: preciosActualizados,
        },
      });
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="admin-modal__backdrop" onClick={intentarCerrar}>
      <div
        className="admin-modal admin-modal--ancho"
        role="dialog"
        aria-modal="true"
        aria-label={esCrear ? 'Nuevo producto' : `Editar ${item.codigoSku}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title">{esCrear ? 'Nuevo producto' : 'Editar producto'}</h3>
            {!esCrear && <p className="pform__subtitle">{item.codigoSku} · {item.nombreProducto} {item.nombreSabor}</p>}
          </div>
          <button type="button" className="admin-modal__close" onClick={intentarCerrar} aria-label="Cerrar">×</button>
        </div>

        <form className="pform" onSubmit={handleSubmit}>
          <div className="pform__body">
            {/* ── Identificación ─────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Identificación</h4>
              <div className="pform__grid">
                <div className="pform__field">
                  <span className="pform__label">
                    Código SKU{esCrear && <span className="pform__req"> *</span>}
                  </span>
                  <input
                    className="pform__input pform__input--mono"
                    type="text"
                    maxLength={20}
                    autoFocus={esCrear}
                    placeholder="DLJ-EMP-001"
                    value={form.codigoSku}
                    disabled={!esCrear}
                    onChange={(e) => setCampo('codigoSku', e.target.value.toUpperCase())}
                  />
                  <span className="pform__hint">
                    {esCrear ? 'Identificador único, no se puede cambiar después.' : 'El código no se puede modificar.'}
                  </span>
                </div>

                <SelectCreable
                  label="Categoría"
                  requerido
                  opciones={categorias.map((c) => ({ id: c.idCategoria, nombre: c.nombre }))}
                  valorId={String(form.idCategoria)}
                  nombreNuevo={form.nombreCategoriaNueva}
                  onChangeId={handleCategoria}
                  onChangeNombre={(v) => setCampo('nombreCategoriaNueva', v)}
                  placeholder="Nombre de la categoría"
                />

                <SelectCreable
                  label="Producto"
                  requerido
                  opciones={productosDeCategoria.map((p) => ({ id: p.idProducto, nombre: p.nombre }))}
                  valorId={String(form.idProducto)}
                  nombreNuevo={form.nombreProductoNueva}
                  onChangeId={(v) => setCampo('idProducto', v)}
                  onChangeNombre={(v) => setCampo('nombreProductoNueva', v)}
                  placeholder="Ej. Empanada de carne"
                  disabled={!form.idCategoria}
                  ayuda={!form.idCategoria ? 'Elige primero una categoría.' : undefined}
                />

                <SelectCreable
                  label="Sabor"
                  requerido
                  opciones={sabores.map((s) => ({ id: s.idSabor, nombre: s.nombre }))}
                  valorId={String(form.idSabor)}
                  nombreNuevo={form.nombreSaborNueva}
                  onChangeId={(v) => setCampo('idSabor', v)}
                  onChangeNombre={(v) => setCampo('nombreSaborNueva', v)}
                  placeholder="Ej. Hawaiana"
                />
              </div>
            </section>

            {/* ── Presentación ───────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Presentación</h4>
              <div className="pform__grid">
                <div className="pform__field">
                  <span className="pform__label">Gramaje (g)<span className="pform__req"> *</span></span>
                  <input
                    className="pform__input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.gramajeG}
                    onChange={(e) => setCampo('gramajeG', e.target.value)}
                  />
                </div>

                <div className="pform__field">
                  <span className="pform__label">Unidades por paquete<span className="pform__req"> *</span></span>
                  <input
                    className="pform__input"
                    type="number"
                    min="1"
                    step="1"
                    value={form.unidadesPorPaquete}
                    onChange={(e) => setCampo('unidadesPorPaquete', e.target.value)}
                  />
                </div>

                <div className="pform__field">
                  <span className="pform__label">Orden en el catálogo</span>
                  <input
                    className="pform__input"
                    type="number"
                    step="1"
                    placeholder="Sin definir"
                    value={form.orden}
                    onChange={(e) => setCampo('orden', e.target.value)}
                  />
                  <span className="pform__hint">Menor número aparece primero en la web.</span>
                </div>

                <div className="pform__field">
                  <span className="pform__label">Etiqueta / descripción corta</span>
                  <input
                    className="pform__input"
                    type="text"
                    maxLength={100}
                    placeholder="Ej. El más pedido"
                    value={form.badgeDescripcion}
                    onChange={(e) => setCampo('badgeDescripcion', e.target.value)}
                  />
                  <span className="pform__hint">
                    Se muestra como sello sobre la foto. {form.badgeDescripcion.length}/100
                  </span>
                </div>
              </div>

              <ImagenUploader
                url={form.urlImage}
                onChange={(valor) => setCampo('urlImage', valor)}
                onSessionExpired={onSessionExpired}
                etiqueta="Imagen del producto"
              />
            </section>

            {/* ── Precios ────────────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Precios por lista</h4>
              <p className="pform__section-hint">
                Deja en blanco las listas en las que este producto no se vende.
              </p>

              <div className="pform__precios">
                <div className="pform__precios-head">
                  <span>Lista</span>
                  <span>Precio paquete</span>
                  <span>Precio por unidad</span>
                  <span>Margen %</span>
                  <span />
                </div>

                {listas.map((lista) => {
                  const fila = precios[lista.idLista];
                  const paquete = parsePrecio(fila.precioPaquete);
                  return (
                    <div className="pform__precios-row" key={lista.idLista}>
                      <span className="pform__precios-lista">
                        {lista.nombre}
                        {fila.idPrecio == null && fila.precioPaquete === '' && (
                          <span className="pform__precios-tag">sin precio</span>
                        )}
                      </span>

                      <label className="pform__money">
                        <span className="pform__money-prefix">$</span>
                        <input
                          className="pform__input"
                          type="text"
                          inputMode="numeric"
                          value={fila.precioPaquete}
                          placeholder="0"
                          aria-label={`Precio de paquete en ${lista.nombre}`}
                          onChange={(e) => setPrecio(lista.idLista, 'precioPaquete', e.target.value)}
                          onBlur={() => autocompletarUnidad(lista.idLista)}
                        />
                      </label>

                      <label className="pform__money">
                        <span className="pform__money-prefix">$</span>
                        <input
                          className="pform__input"
                          type="text"
                          inputMode="numeric"
                          value={fila.precioPorUnidad}
                          placeholder="0"
                          aria-label={`Precio por unidad en ${lista.nombre}`}
                          onChange={(e) => setPrecio(lista.idLista, 'precioPorUnidad', e.target.value)}
                        />
                        <button
                          type="button"
                          className="pform__calc"
                          title="Calcular desde el precio del paquete"
                          disabled={paquete === null || unidades <= 0}
                          onClick={() => recalcularUnidad(lista.idLista)}
                        >
                          <FaMagic aria-hidden="true" />
                          <span className="visually-hidden">Calcular precio por unidad</span>
                        </button>
                      </label>

                      <input
                        className="pform__input"
                        type="number"
                        step="1"
                        placeholder="—"
                        aria-label={`Margen en ${lista.nombre}`}
                        value={fila.margen}
                        onChange={(e) => setPrecio(lista.idLista, 'margen', e.target.value)}
                      />

                      <button
                        type="button"
                        className="pform__quitar"
                        title={`Quitar de la lista ${lista.nombre}`}
                        disabled={fila.idPrecio == null && fila.precioPaquete === ''}
                        onClick={() => quitarPrecio(lista.idLista)}
                      >
                        <FaTrashAlt aria-hidden="true" />
                        <span className="visually-hidden">Quitar precio de {lista.nombre}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {unidades > 0 && (
                <p className="pform__section-hint">
                  Referencia: un paquete trae {unidades} unidades, así que el sugerido por unidad
                  es el precio del paquete dividido {unidades}.
                </p>
              )}
            </section>

            {/* ── Publicación ────────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Publicación</h4>
              <label className="pform__switch">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setCampo('activo', e.target.checked)}
                />
                <span className="pform__switch-track" aria-hidden="true"><span className="pform__switch-thumb" /></span>
                <span className="pform__switch-text">
                  <strong>{form.activo ? 'Visible en la tienda' : 'Oculto en la tienda'}</strong>
                  <small>
                    {form.activo
                      ? 'Los clientes pueden verlo y agregarlo al carrito.'
                      : 'No aparece en el catálogo web ni en el flujo de WhatsApp.'}
                  </small>
                </span>
              </label>
            </section>
          </div>

          {error && <p className="pform__error">{error}</p>}

          <div className="pform__footer">
            {confirmandoSalida ? (
              <div className="pform__confirm">
                <span>Hay cambios sin guardar.</span>
                <button type="button" className="admin-btn admin-btn--ghost" onClick={onCerrar}>Descartar</button>
                <button type="button" className="admin-btn" onClick={() => setConfirmandoSalida(false)}>Seguir editando</button>
              </div>
            ) : (
              <>
                <span className="pform__footer-info">
                  {preciosDiligenciados().length > 0
                    ? `${preciosDiligenciados().length} de ${listas.length} listas con precio · desde ${formatCOP(
                        Math.min(...preciosDiligenciados().map((p) => p.precioPaquete))
                      )}`
                    : 'Sin precios asignados'}
                </span>
                <div className="pform__footer-actions">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={intentarCerrar} disabled={guardando}>
                    Cancelar
                  </button>
                  <button type="submit" className="admin-btn" disabled={guardando || (!esCrear && !sucio)}>
                    {guardando ? 'Guardando…' : esCrear ? 'Crear producto' : 'Guardar cambios'}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductoModal;
