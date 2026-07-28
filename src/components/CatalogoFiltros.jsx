import {
  FaSearch,
  FaSlidersH,
  FaInfoCircle,
  FaChevronDown,
  FaTimes,
  FaRegTrashAlt,
} from 'react-icons/fa';
import { COMBOS, TODOS_TAMANOS, etiquetaCategoria } from '../utils/catalogoFiltros';
import '../styles/CatalogoFiltros.css';

// Barra de filtros de la vitrina: pestañas de categoría, buscador por texto,
// selector de tamaño y resumen de resultados.

function CatalogoFiltros({
  categorias,
  categoria,
  onCategoriaChange,
  busqueda,
  onBusquedaChange,
  tamanos,
  tamano,
  onTamanoChange,
  resultCount,
}) {
  const soloCombos = categoria === COMBOS;
  const plural = resultCount === 1 ? '' : 's';

  return (
    <section className="cfiltros" aria-label="Filtros del catálogo">
      <div className="cfiltros__row">
        <div className="cfiltros__tabs" role="tablist" aria-label="Categorías">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={categoria === cat}
              className={`cfiltros__tab ${categoria === cat ? 'is-active' : ''}`}
              onClick={() => onCategoriaChange(cat)}
            >
              {etiquetaCategoria(cat)}
            </button>
          ))}
        </div>

        <div className="cfiltros__search">
          <FaSearch className="cfiltros__search-icon" aria-hidden="true" />
          <input
            type="search"
            className="cfiltros__search-input"
            placeholder="Buscar por producto o relleno"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            aria-label="Buscar por producto o relleno"
          />
          {busqueda && (
            <button
              type="button"
              className="cfiltros__search-clear"
              onClick={() => onBusquedaChange('')}
              aria-label="Limpiar búsqueda"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="cfiltros__size">
          <label className="cfiltros__size-label" htmlFor="cfiltros-tamano">
            Tamaño
          </label>
          <div className="cfiltros__select-wrap">
            <select
              id="cfiltros-tamano"
              className="cfiltros__select"
              value={tamano}
              onChange={(e) => onTamanoChange(e.target.value)}
              disabled={soloCombos}
            >
              <option value={TODOS_TAMANOS}>Todos los tamaños</option>
              {tamanos.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="cfiltros__select-caret" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="cfiltros__results">
        <p className="cfiltros__count">
          <FaSlidersH className="cfiltros__count-icon" aria-hidden="true" />
          <span>
            <strong>{resultCount}</strong> producto{plural} encontrado{plural}
          </span>
        </p>
        <p className="cfiltros__note">
          <FaInfoCircle className="cfiltros__note-icon" aria-hidden="true" />
          <span>
            La disponibilidad de las referencias y la fecha de despacho se confirman
            después de enviar el pedido.
          </span>
        </p>
      </div>
    </section>
  );
}

// Estado vacío: se muestra cuando ningún producto ni combo pasa los filtros.
export function CatalogoVacio({ onLimpiar }) {
  return (
    <div className="cat-vacio">
      <div className="cat-vacio__icon">
        <FaSearch aria-hidden="true" />
      </div>
      <div className="cat-vacio__content">
        <h3 className="cat-vacio__title">No encontramos productos con estos filtros</h3>
        <p className="cat-vacio__text">
          Prueba otra categoría, cambia el tamaño o elimina la búsqueda para volver a ver
          el portafolio.
        </p>
        <button type="button" className="cat-vacio__btn" onClick={onLimpiar}>
          <FaRegTrashAlt aria-hidden="true" />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

export default CatalogoFiltros;
