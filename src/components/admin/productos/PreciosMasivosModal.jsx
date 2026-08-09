import { useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { upsertPrecios } from '../../../services/catalogoAdmin';
import { formatCOP, parsePrecio, redondear, sugerirPrecioUnidad } from './utils';

const MODOS = [
  { key: 'porcentaje', label: 'Porcentaje', sufijo: '%' },
  { key: 'monto', label: 'Monto fijo', sufijo: '$' },
  { key: 'exacto', label: 'Precio exacto', sufijo: '$' },
];

const REDONDEOS = [
  { valor: 0, label: 'Sin redondeo' },
  { valor: 50, label: 'Múltiplos de 50' },
  { valor: 100, label: 'Múltiplos de 100' },
  { valor: 500, label: 'Múltiplos de 500' },
  { valor: 1000, label: 'Múltiplos de 1.000' },
];

function calcular(actual, { modo, valor, direccion, paso }) {
  let nuevo;
  if (modo === 'porcentaje') nuevo = actual * (1 + (direccion * valor) / 100);
  else if (modo === 'monto') nuevo = actual + direccion * valor;
  else nuevo = valor;
  return Math.max(0, redondear(nuevo, paso));
}

/**
 * Ajuste masivo de precios sobre los items seleccionados. Siempre muestra el
 * antes → después antes de escribir nada: nada se guarda hasta confirmar.
 */
function PreciosMasivosModal({ items, listas, onCerrar, onAplicado, onSessionExpired }) {
  const [idLista, setIdLista] = useState(listas[0]?.idLista ?? '');
  const [modo, setModo] = useState('porcentaje');
  const [direccion, setDireccion] = useState(1); // 1 = aumentar, -1 = disminuir
  const [valorTexto, setValorTexto] = useState('');
  const [paso, setPaso] = useState(100);
  const [aplicarUnidad, setAplicarUnidad] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const lista = listas.find((l) => String(l.idLista) === String(idLista));
  const valor = parsePrecio(valorTexto);

  const { filas, omitidos } = useMemo(() => {
    if (!lista || valor === null) return { filas: [], omitidos: 0 };

    const config = { modo, valor, direccion, paso };
    const resultado = [];
    let sinPrecio = 0;

    for (const item of items) {
      const precio = item.precios?.[lista.idLista];

      // Sin precio previo no hay base para % ni monto: solo el modo exacto puede crearlo.
      if (!precio && modo !== 'exacto') {
        sinPrecio++;
        continue;
      }

      const actualPaquete = precio ? Math.round(precio.precioPaquete) : 0;
      const nuevoPaquete = calcular(actualPaquete, config);

      const actualUnidad = precio ? Math.round(precio.precioPorUnidad) : 0;
      let nuevoUnidad;
      if (!precio) nuevoUnidad = sugerirPrecioUnidad(nuevoPaquete, item.unidadesPorPaquete);
      else if (aplicarUnidad) nuevoUnidad = calcular(actualUnidad, { ...config, paso: paso >= 500 ? 100 : paso });
      else nuevoUnidad = actualUnidad;

      resultado.push({
        item,
        esNuevo: !precio,
        actualPaquete,
        nuevoPaquete,
        actualUnidad,
        nuevoUnidad,
        margen: precio?.margen ?? null,
      });
    }

    return { filas: resultado, omitidos: sinPrecio };
  }, [items, lista, modo, valor, direccion, paso, aplicarUnidad]);

  const cambian = filas.filter((f) => f.nuevoPaquete !== f.actualPaquete || f.nuevoUnidad !== f.actualUnidad);

  const handleAplicar = async () => {
    if (!lista || !cambian.length) return;
    setGuardando(true);
    setError(null);

    try {
      const payload = cambian.map((f) => ({
        codigoSku: f.item.codigoSku,
        idLista: lista.idLista,
        precioPaquete: f.nuevoPaquete,
        precioPorUnidad: f.nuevoUnidad,
        margen: f.margen,
      }));
      const resultado = await upsertPrecios(payload);
      onAplicado(resultado, lista);
    } catch (err) {
      if (err.message === 'SESSION_EXPIRED') {
        onSessionExpired?.();
        return;
      }
      setError(err.message || 'No se pudieron aplicar los precios.');
    } finally {
      setGuardando(false);
    }
  };

  const sufijo = MODOS.find((m) => m.key === modo)?.sufijo;

  return (
    <div className="admin-modal__backdrop" onClick={onCerrar}>
      <div
        className="admin-modal admin-modal--ancho"
        role="dialog"
        aria-modal="true"
        aria-label="Ajustar precios"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <div>
            <h3 className="admin-modal__title">Ajustar precios</h3>
            <p className="pform__subtitle">
              {items.length} {items.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
            </p>
          </div>
          <button type="button" className="admin-modal__close" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>

        <div className="pform__body">
          <section className="pform__section">
            <div className="pform__grid">
              <div className="pform__field">
                <span className="pform__label">Lista de precios<span className="pform__req"> *</span></span>
                <select className="pform__input" value={idLista} onChange={(e) => setIdLista(e.target.value)}>
                  {listas.map((l) => (
                    <option key={l.idLista} value={l.idLista}>{l.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="pform__field">
                <span className="pform__label">Redondear a</span>
                <select className="pform__input" value={paso} onChange={(e) => setPaso(Number(e.target.value))}>
                  {REDONDEOS.map((r) => (
                    <option key={r.valor} value={r.valor}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pmasivo__modos" role="group" aria-label="Tipo de ajuste">
              {MODOS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`pmasivo__modo${modo === m.key ? ' pmasivo__modo--activo' : ''}`}
                  onClick={() => setModo(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="pmasivo__valor">
              {modo !== 'exacto' && (
                <div className="pmasivo__signo">
                  <button
                    type="button"
                    className={`pmasivo__signo-btn${direccion === 1 ? ' pmasivo__signo-btn--activo' : ''}`}
                    onClick={() => setDireccion(1)}
                  >
                    Aumentar
                  </button>
                  <button
                    type="button"
                    className={`pmasivo__signo-btn${direccion === -1 ? ' pmasivo__signo-btn--activo' : ''}`}
                    onClick={() => setDireccion(-1)}
                  >
                    Disminuir
                  </button>
                </div>
              )}

              <label className="pform__money pmasivo__money">
                <span className="pform__money-prefix">{sufijo}</span>
                <input
                  className="pform__input"
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  placeholder={modo === 'porcentaje' ? '10' : '1.000'}
                  value={valorTexto}
                  onChange={(e) => setValorTexto(e.target.value)}
                  aria-label="Valor del ajuste"
                />
              </label>
            </div>

            <label className="admin-form__checkbox">
              <input
                type="checkbox"
                checked={aplicarUnidad}
                onChange={(e) => setAplicarUnidad(e.target.checked)}
              />
              <span>Aplicar también al precio por unidad</span>
            </label>

            {omitidos > 0 && (
              <p className="pmasivo__aviso">
                {omitidos} {omitidos === 1 ? 'producto no tiene' : 'productos no tienen'} precio en
                {' '}{lista?.nombre}: se {omitidos === 1 ? 'omitirá' : 'omitirán'}. Usa «Precio exacto» para asignárselo.
              </p>
            )}
          </section>

          <section className="pform__section">
            <h4 className="pform__section-title">
              Vista previa {cambian.length > 0 && <span className="pmasivo__contador">{cambian.length} cambios</span>}
            </h4>

            {valor === null && <p className="pmasivo__vacio">Escribe un valor para ver el resultado.</p>}

            {valor !== null && filas.length === 0 && (
              <p className="pmasivo__vacio">Ningún producto seleccionado aplica para este ajuste.</p>
            )}

            {filas.length > 0 && (
              <div className="pmasivo__tabla-wrap">
                <table className="pmasivo__tabla">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Paquete</th>
                      <th>Por unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((f) => {
                      const delta = f.nuevoPaquete - f.actualPaquete;
                      return (
                        <tr key={f.item.codigoSku}>
                          <td>
                            <span className="pmasivo__nombre">{f.item.nombreProducto} {f.item.nombreSabor}</span>
                            <span className="pmasivo__sku">{f.item.codigoSku}</span>
                          </td>
                          <td>
                            <span className="pmasivo__antes">
                              {f.esNuevo ? 'Sin precio' : formatCOP(f.actualPaquete)}
                            </span>
                            <FaArrowRight className="pmasivo__flecha" aria-hidden="true" />
                            <span className="pmasivo__despues">{formatCOP(f.nuevoPaquete)}</span>
                            {!f.esNuevo && delta !== 0 && (
                              <span className={`pmasivo__delta pmasivo__delta--${delta > 0 ? 'sube' : 'baja'}`}>
                                {delta > 0 ? '+' : '−'}{formatCOP(Math.abs(delta))}
                              </span>
                            )}
                          </td>
                          <td className="pmasivo__unidad">
                            {f.esNuevo ? '—' : formatCOP(f.actualUnidad)}
                            {f.nuevoUnidad !== f.actualUnidad && (
                              <> <FaArrowRight className="pmasivo__flecha" aria-hidden="true" /> {formatCOP(f.nuevoUnidad)}</>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {error && <p className="pform__error">{error}</p>}

        <div className="pform__footer">
          <span className="pform__footer-info">
            {cambian.length > 0
              ? `Se actualizarán ${cambian.length} ${cambian.length === 1 ? 'precio' : 'precios'} en ${lista?.nombre}`
              : 'Nada por aplicar todavía'}
          </span>
          <div className="pform__footer-actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </button>
            <button type="button" className="admin-btn" onClick={handleAplicar} disabled={guardando || !cambian.length}>
              {guardando ? 'Aplicando…' : `Aplicar a ${cambian.length}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreciosMasivosModal;
