import { useEffect, useMemo, useState } from 'react';
import { FaMagic, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { actualizarCombo, crearCombo } from '../../../services/catalogoAdmin';
import ImagenUploader from './ImagenUploader';
import { formatCOP, formatNumero, parsePrecio } from './utils';

const vacio = () => ({
  codigoCombo: '',
  nombre: '',
  subcategoria: '',
  descripcionCorta: '',
  descripcionLarga: '',
  precioNormal: '',
  precioCombo: '',
  pesoTotalG: '',
  unidadesTotales: '',
  orden: '',
  badgeDescripcion: '',
  urlImage: '',
  activo: true,
});

const desdeCombo = (combo) => ({
  codigoCombo: combo.codigoCombo ?? '',
  nombre: combo.nombre ?? '',
  subcategoria: combo.subcategoria ?? '',
  descripcionCorta: combo.descripcionCorta ?? '',
  descripcionLarga: combo.descripcionLarga ?? '',
  precioNormal: combo.precioNormal != null ? String(Math.round(combo.precioNormal)) : '',
  precioCombo: combo.precioCombo != null ? String(Math.round(combo.precioCombo)) : '',
  pesoTotalG: combo.pesoTotalG != null ? String(combo.pesoTotalG) : '',
  unidadesTotales: combo.unidadesTotales != null ? String(combo.unidadesTotales) : '',
  orden: combo.orden ?? '',
  badgeDescripcion: combo.badgeDescripcion ?? '',
  urlImage: combo.urlImage ?? '',
  activo: !!combo.activo,
});

const componentesDesdeCombo = (combo) =>
  (combo?.componentes ?? []).map((c) => ({
    codigoSku: c.codigoSku,
    cantidadPaquetes: String(c.cantidadPaquetes ?? 1),
  }));

function ComboModal({ modo, combo, catalogo, listaWeb, onCerrar, onGuardado, onSessionExpired }) {
  const esCrear = modo === 'crear';
  const { items } = catalogo;

  const [form, setForm] = useState(() => (esCrear ? vacio() : desdeCombo(combo)));
  const [componentes, setComponentes] = useState(() => componentesDesdeCombo(combo));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const [inicial] = useState(() => ({
    form: esCrear ? vacio() : desdeCombo(combo),
    componentes: componentesDesdeCombo(combo),
  }));

  const setCampo = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const sucio = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(inicial.form) ||
      JSON.stringify(componentes) !== JSON.stringify(inicial.componentes),
    [form, componentes, inicial]
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

  // Solo se ofrecen SKUs que no estén ya en el combo (el índice único los rechazaría).
  const itemPorSku = useMemo(() => new Map(items.map((i) => [i.codigoSku, i])), [items]);
  const yaUsados = useMemo(() => new Set(componentes.map((c) => c.codigoSku)), [componentes]);

  const disponibles = useMemo(
    () => items.filter((i) => !yaUsados.has(i.codigoSku)),
    [items, yaUsados]
  );

  // Totales derivados de los componentes: sirven para los botones de autocálculo.
  const calculado = useMemo(() => {
    let precio = 0;
    let peso = 0;
    let unidades = 0;
    let completo = true;

    for (const comp of componentes) {
      const item = itemPorSku.get(comp.codigoSku);
      const cantidad = Number(comp.cantidadPaquetes) || 0;
      if (!item || cantidad <= 0) { completo = false; continue; }

      const precioWeb = listaWeb ? item.precios?.[listaWeb.idLista]?.precioPaquete : null;
      if (precioWeb == null) completo = false;
      else precio += precioWeb * cantidad;

      peso += (item.gramajeG ?? 0) * cantidad;
      unidades += (item.unidadesPorPaquete ?? 0) * cantidad;
    }

    return { precio: Math.round(precio), peso, unidades, completo };
  }, [componentes, itemPorSku, listaWeb]);

  const precioNormal = parsePrecio(form.precioNormal) ?? 0;
  const precioCombo = parsePrecio(form.precioCombo) ?? 0;
  const ahorro = precioNormal - precioCombo;
  const porcentaje = precioNormal > 0 ? Math.round((ahorro / precioNormal) * 100) : 0;

  const agregarComponente = () => {
    const primero = disponibles[0];
    if (!primero) return;
    setComponentes((prev) => [...prev, { codigoSku: primero.codigoSku, cantidadPaquetes: '1' }]);
  };

  const setComponente = (idx, key, value) =>
    setComponentes((prev) => prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c)));

  const quitarComponente = (idx) =>
    setComponentes((prev) => prev.filter((_, i) => i !== idx));

  const validar = () => {
    if (esCrear && !form.codigoCombo.trim()) return 'El código del combo es obligatorio.';
    if (esCrear && form.codigoCombo.trim().length > 20) return 'El código no puede superar 20 caracteres.';
    if (!form.nombre.trim()) return 'El nombre es obligatorio.';

    const codigos = componentes.map((c) => c.codigoSku);
    if (codigos.length !== new Set(codigos).size) return 'Hay productos repetidos en el combo.';
    if (componentes.some((c) => !(Number(c.cantidadPaquetes) >= 1))) {
      return 'Cada producto del combo debe tener al menos 1 paquete.';
    }
    if (parsePrecio(form.precioNormal) === null) return 'Indica el precio normal.';
    if (parsePrecio(form.precioCombo) === null) return 'Indica el precio del combo.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }

    setGuardando(true);
    setError(null);

    const payload = {
      nombre: form.nombre.trim(),
      subcategoria: form.subcategoria.trim() || null,
      descripcionCorta: form.descripcionCorta.trim() || null,
      descripcionLarga: form.descripcionLarga.trim() || null,
      precioNormal,
      precioCombo,
      pesoTotalG: form.pesoTotalG === '' ? null : Number(form.pesoTotalG),
      unidadesTotales: form.unidadesTotales === '' ? null : Number(form.unidadesTotales),
      activo: form.activo,
      orden: form.orden === '' ? null : Number(form.orden),
      urlImage: form.urlImage.trim() || null,
      badgeDescripcion: form.badgeDescripcion.trim() || null,
      componentes: componentes.map((c) => ({
        codigoSku: c.codigoSku,
        cantidadPaquetes: Number(c.cantidadPaquetes),
      })),
    };

    try {
      const guardado = esCrear
        ? await crearCombo({ ...payload, codigoCombo: form.codigoCombo.trim().toUpperCase() })
        : await actualizarCombo(combo.idCombo, payload);

      onGuardado(guardado);
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
        aria-label={esCrear ? 'Nuevo combo' : `Editar ${combo.codigoCombo}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title">{esCrear ? 'Nuevo combo' : 'Editar combo'}</h3>
            {!esCrear && <p className="pform__subtitle">{combo.codigoCombo} · {combo.nombre}</p>}
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
                    Código del combo{esCrear && <span className="pform__req"> *</span>}
                  </span>
                  <input
                    className="pform__input pform__input--mono"
                    type="text"
                    maxLength={20}
                    autoFocus={esCrear}
                    placeholder="DLJ-COMBO-001"
                    value={form.codigoCombo}
                    disabled={!esCrear}
                    onChange={(e) => setCampo('codigoCombo', e.target.value.toUpperCase())}
                  />
                  <span className="pform__hint">
                    {esCrear ? 'Identificador único, no se puede cambiar después.' : 'El código no se puede modificar.'}
                  </span>
                </div>

                <div className="pform__field">
                  <span className="pform__label">Nombre<span className="pform__req"> *</span></span>
                  <input
                    className="pform__input"
                    type="text"
                    maxLength={100}
                    placeholder="Combo Familiar"
                    value={form.nombre}
                    onChange={(e) => setCampo('nombre', e.target.value)}
                  />
                </div>

                <div className="pform__field">
                  <span className="pform__label">Subcategoría</span>
                  <input
                    className="pform__input"
                    type="text"
                    maxLength={50}
                    placeholder="Ej. Para compartir"
                    value={form.subcategoria}
                    onChange={(e) => setCampo('subcategoria', e.target.value)}
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
              </div>
            </section>

            {/* ── Componentes ────────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">
                Productos incluidos
                {componentes.length > 0 && <span className="pmasivo__contador">{componentes.length}</span>}
              </h4>

              {componentes.length === 0 && (
                <p className="pform__section-hint">
                  Este combo no tiene productos vinculados. Puedes guardarlo así — la web arma
                  el «incluye» a partir de la descripción larga — pero al vincularlos se habilitan
                  los cálculos automáticos de precio, peso y unidades.
                </p>
              )}

              {componentes.length > 0 && (
                <div className="pform__precios">
                  <div className="pcombo__comp-head">
                    <span>Producto</span>
                    <span>Paquetes</span>
                    <span>Subtotal</span>
                    <span />
                  </div>

                  {componentes.map((comp, idx) => {
                    const item = itemPorSku.get(comp.codigoSku);
                    const cantidad = Number(comp.cantidadPaquetes) || 0;
                    const precioWeb = item && listaWeb
                      ? item.precios?.[listaWeb.idLista]?.precioPaquete
                      : null;

                    return (
                      <div className="pcombo__comp-row" key={`${comp.codigoSku}-${idx}`}>
                        <select
                          className="pform__input"
                          value={comp.codigoSku}
                          aria-label={`Producto ${idx + 1} del combo`}
                          onChange={(e) => setComponente(idx, 'codigoSku', e.target.value)}
                        >
                          {/* El SKU actual siempre debe estar en la lista aunque ya esté usado */}
                          {item && (
                            <option value={item.codigoSku}>
                              {item.nombreProducto} {item.nombreSabor} · {item.codigoSku}
                            </option>
                          )}
                          {!item && <option value={comp.codigoSku}>{comp.codigoSku} (no encontrado)</option>}
                          {disponibles.map((d) => (
                            <option key={d.codigoSku} value={d.codigoSku}>
                              {d.nombreProducto} {d.nombreSabor} · {d.codigoSku}
                            </option>
                          ))}
                        </select>

                        <input
                          className="pform__input"
                          type="number"
                          min="1"
                          step="1"
                          value={comp.cantidadPaquetes}
                          aria-label={`Paquetes del producto ${idx + 1}`}
                          onChange={(e) => setComponente(idx, 'cantidadPaquetes', e.target.value)}
                        />

                        <span className="pcombo__comp-subtotal">
                          {precioWeb != null ? formatCOP(precioWeb * cantidad) : '—'}
                        </span>

                        <button
                          type="button"
                          className="pform__quitar"
                          title="Quitar del combo"
                          onClick={() => quitarComponente(idx)}
                        >
                          <FaTrashAlt aria-hidden="true" />
                          <span className="visually-hidden">Quitar producto {idx + 1}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                className="admin-btn admin-btn--ghost pcombo__agregar"
                onClick={agregarComponente}
                disabled={disponibles.length === 0}
              >
                <FaPlus aria-hidden="true" /> Agregar producto
              </button>

              {disponibles.length === 0 && componentes.length > 0 && (
                <span className="pform__hint">Ya agregaste todos los productos del catálogo.</span>
              )}
            </section>

            {/* ── Precios ────────────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Precio</h4>

              <div className="pform__grid">
                <div className="pform__field">
                  <span className="pform__label">Precio normal<span className="pform__req"> *</span></span>
                  <label className="pform__money">
                    <span className="pform__money-prefix">$</span>
                    <input
                      className="pform__input"
                      type="text"
                      inputMode="numeric"
                      value={form.precioNormal}
                      placeholder="0"
                      onChange={(e) => setCampo('precioNormal', e.target.value)}
                    />
                    <button
                      type="button"
                      className="pform__calc"
                      title="Sumar el precio web de los productos incluidos"
                      disabled={calculado.precio <= 0}
                      onClick={() => setCampo('precioNormal', String(calculado.precio))}
                    >
                      <FaMagic aria-hidden="true" />
                      <span className="visually-hidden">Calcular precio normal</span>
                    </button>
                  </label>
                  <span className="pform__hint">
                    {calculado.precio > 0
                      ? `Suma de los incluidos: ${formatCOP(calculado.precio)}${calculado.completo ? '' : ' (algún producto no tiene precio web)'}`
                      : 'Lo que costarían por separado.'}
                  </span>
                </div>

                <div className="pform__field">
                  <span className="pform__label">Precio del combo<span className="pform__req"> *</span></span>
                  <label className="pform__money">
                    <span className="pform__money-prefix">$</span>
                    <input
                      className="pform__input"
                      type="text"
                      inputMode="numeric"
                      value={form.precioCombo}
                      placeholder="0"
                      onChange={(e) => setCampo('precioCombo', e.target.value)}
                    />
                  </label>
                  <span className="pform__hint">Precio fijo: no aplica la regla mayorista.</span>
                </div>
              </div>

              <div className={`pcombo__ahorro${ahorro < 0 ? ' pcombo__ahorro--negativo' : ''}`}>
                {ahorro > 0 && (
                  <>El cliente ahorra <strong>{formatCOP(ahorro)}</strong> ({porcentaje}% de descuento)</>
                )}
                {ahorro === 0 && <>Sin ahorro: el combo cuesta lo mismo que comprar por separado.</>}
                {ahorro < 0 && (
                  <>Ojo: el combo cuesta <strong>{formatCOP(Math.abs(ahorro))}</strong> más que comprar por separado.</>
                )}
              </div>
            </section>

            {/* ── Presentación ───────────────────────────────── */}
            <section className="pform__section">
              <h4 className="pform__section-title">Presentación</h4>

              <div className="pform__grid">
                <div className="pform__field">
                  <span className="pform__label">Peso total (g)</span>
                  <label className="pform__money">
                    <input
                      className="pform__input pcombo__input-plano"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Sin definir"
                      value={form.pesoTotalG}
                      onChange={(e) => setCampo('pesoTotalG', e.target.value)}
                    />
                    <button
                      type="button"
                      className="pform__calc"
                      title="Sumar el peso de los productos incluidos"
                      disabled={calculado.peso <= 0}
                      onClick={() => setCampo('pesoTotalG', String(calculado.peso))}
                    >
                      <FaMagic aria-hidden="true" />
                      <span className="visually-hidden">Calcular peso total</span>
                    </button>
                  </label>
                  {calculado.peso > 0 && (
                    <span className="pform__hint">Según los incluidos: {formatNumero(calculado.peso, 0)} g</span>
                  )}
                </div>

                <div className="pform__field">
                  <span className="pform__label">Unidades totales</span>
                  <label className="pform__money">
                    <input
                      className="pform__input pcombo__input-plano"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Sin definir"
                      value={form.unidadesTotales}
                      onChange={(e) => setCampo('unidadesTotales', e.target.value)}
                    />
                    <button
                      type="button"
                      className="pform__calc"
                      title="Sumar las unidades de los productos incluidos"
                      disabled={calculado.unidades <= 0}
                      onClick={() => setCampo('unidadesTotales', String(calculado.unidades))}
                    >
                      <FaMagic aria-hidden="true" />
                      <span className="visually-hidden">Calcular unidades totales</span>
                    </button>
                  </label>
                  {calculado.unidades > 0 && (
                    <span className="pform__hint">Según los incluidos: {calculado.unidades} unidades</span>
                  )}
                </div>
              </div>

              <div className="pform__field">
                <span className="pform__label">Etiqueta</span>
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

              <div className="pform__field pcombo__desc">
                <span className="pform__label">Descripción corta</span>
                <textarea
                  className="pform__input pform__textarea"
                  rows={2}
                  maxLength={255}
                  placeholder="Una línea que resuma el combo."
                  value={form.descripcionCorta}
                  onChange={(e) => setCampo('descripcionCorta', e.target.value)}
                />
                <span className="pform__hint">
                  Aparece bajo el nombre en la tarjeta. {form.descripcionCorta.length}/255
                </span>
              </div>

              <div className="pform__field pcombo__desc">
                <span className="pform__label">Descripción larga</span>
                <textarea
                  className="pform__input pform__textarea"
                  rows={4}
                  maxLength={1000}
                  placeholder="Incluye: 2 paquetes de empanadas de carne, 1 de pastel de pollo…"
                  value={form.descripcionLarga}
                  onChange={(e) => setCampo('descripcionLarga', e.target.value)}
                />
                <span className="pform__hint">
                  La web parte esta descripción por comas para listar qué incluye. {form.descripcionLarga.length}/1000
                </span>
              </div>

              <ImagenUploader
                url={form.urlImage}
                onChange={(valor) => setCampo('urlImage', valor)}
                onSessionExpired={onSessionExpired}
                etiqueta="Imagen del combo"
              />
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
                  {componentes.length > 0
                    ? `${componentes.length} ${componentes.length === 1 ? 'producto' : 'productos'} incluidos`
                    : 'Sin productos incluidos'}
                </span>
                <div className="pform__footer-actions">
                  <button type="button" className="admin-btn admin-btn--ghost" onClick={intentarCerrar} disabled={guardando}>
                    Cancelar
                  </button>
                  <button type="submit" className="admin-btn" disabled={guardando || (!esCrear && !sucio)}>
                    {guardando ? 'Guardando…' : esCrear ? 'Crear combo' : 'Guardar cambios'}
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

export default ComboModal;
