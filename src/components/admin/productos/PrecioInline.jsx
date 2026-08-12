import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { formatCOP, parsePrecio } from './utils';

/**
 * Celda de precio editable. Click (o Enter) abre un input con el valor actual;
 * Enter guarda, Escape cancela y salir del campo también guarda si cambió.
 * `onGuardar` recibe el nuevo precio y devuelve una promesa.
 *
 * Sirve tanto para el precio de un SKU en una lista como para el precio fijo de un
 * combo: `subtitulo` es la línea pequeña de contexto (precio por unidad, ahorro…).
 */
function PrecioInline({ valor, subtitulo, etiqueta, onGuardar, textoVacio = 'Asignar' }) {
  const definido = valor != null;

  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | guardando | ok | error
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const cancelado = useRef(false);
  // Deshabilitar el input al guardar dispara un blur: sin esta guarda se enviaría dos veces.
  const enviando = useRef(false);

  useEffect(() => {
    if (editando) inputRef.current?.select();
  }, [editando]);

  // El check de confirmación se desvanece solo.
  useEffect(() => {
    if (estado !== 'ok') return undefined;
    const id = setTimeout(() => setEstado('idle'), 1600);
    return () => clearTimeout(id);
  }, [estado]);

  const abrir = () => {
    cancelado.current = false;
    setError(null);
    setTexto(definido ? String(Math.round(valor)) : '');
    setEditando(true);
  };

  const confirmar = async () => {
    if (cancelado.current || enviando.current) return;
    const nuevo = parsePrecio(texto);

    if (nuevo === null || nuevo < 0) {
      setError('Precio inválido');
      setEstado('error');
      inputRef.current?.focus();
      return;
    }
    if (definido && nuevo === Math.round(valor)) {
      setEditando(false);
      return;
    }

    enviando.current = true;
    setEstado('guardando');
    try {
      await onGuardar(nuevo);
      setEditando(false);
      setEstado('ok');
      setError(null);
    } catch (err) {
      setError(err.message || 'No se pudo guardar');
      setEstado('error');
    } finally {
      enviando.current = false;
    }
  };

  const cancelar = () => {
    cancelado.current = true;
    setEditando(false);
    setEstado('idle');
    setError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmar();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelar();
    }
  };

  if (editando) {
    return (
      <div className="precio-cell precio-cell--editando">
        <span className="precio-cell__prefix">$</span>
        <input
          ref={inputRef}
          className={`precio-cell__input${estado === 'error' ? ' precio-cell__input--error' : ''}`}
          type="text"
          inputMode="numeric"
          value={texto}
          disabled={estado === 'guardando'}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={confirmar}
          aria-label={etiqueta}
        />
        {estado === 'guardando' && <span className="precio-cell__spinner" aria-label="Guardando" />}
        {error && <span className="precio-cell__error">{error}</span>}
      </div>
    );
  }

  if (!definido) {
    return (
      <button type="button" className="precio-cell precio-cell--vacia" onClick={abrir}>
        <FaPlus aria-hidden="true" />
        <span>{textoVacio}</span>
        <span className="visually-hidden">{etiqueta}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`precio-cell precio-cell--valor${estado === 'ok' ? ' precio-cell--ok' : ''}`}
      onClick={abrir}
      title={`Editar ${etiqueta}`}
    >
      <span className="precio-cell__monto">{formatCOP(valor)}</span>
      {subtitulo && <span className="precio-cell__unidad">{subtitulo}</span>}
      {estado === 'ok' && <FaCheck className="precio-cell__check" aria-hidden="true" />}
    </button>
  );
}

export default PrecioInline;
