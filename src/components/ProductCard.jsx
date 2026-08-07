import { useEffect, useRef, useState } from 'react';
import {
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCamera,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { WHOLESALE_THRESHOLD } from '../config/constants';
import { trackAddToCart } from '../services/metaPixel';
import { comboIncludes, comboPackages } from '../utils/combos';

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const formatWeight = (w) => (w >= 1000 ? `${w / 1000} kg` : `${w} g`);

// Etiqueta corta de la esquina: "Empanada coctelera" → "Coctelera". Solo se
// recorta el prefijo "Empanada" porque en pasteles y masas el nombre completo
// ya es la etiqueta corta ("Mini pastel", "Pastel grande").
function tagLabel(product) {
  if (product.isCombo) return 'Combo';
  const name = String(product.name ?? '').trim();
  const label = name.replace(/^empanadas?\s+/i, '') || name || product.category || '';
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const plural = (n, singular, plural_) => (n === 1 ? singular : plural_);

function ProductCard({ product, onSelectProduct }) {
  const { addToCart, cartItems, qualifiesWholesale } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('idle'); // 'idle' | 'adding' | 'error'
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const isCombo = Boolean(product.isCombo);
  const inCart = cartItems.find((item) => item.id === product.id)?.quantity ?? 0;

  const hasWholesale =
    !isCombo && product.wholesalePrice > 0 && product.wholesalePrice < product.price;
  // El carrito ya superó el umbral: esta referencia se está cobrando a mayorista.
  const wholesaleApplied = hasWholesale && qualifiesWholesale;

  const includes = isCombo ? comboIncludes(product) : [];
  const packages = isCombo ? comboPackages(product) : 0;

  const canOpenDetail = !isCombo && typeof onSelectProduct === 'function';
  const openDetail = () => canOpenDetail && onSelectProduct(product);
  const openDetailOnKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    openDetail();
  };

  const handleAdd = () => {
    if (status === 'adding') return;
    setStatus('adding');
    // La escritura del carrito es local e instantánea; el retardo corto solo
    // hace visible el estado "Agregando…" del diseño.
    timerRef.current = window.setTimeout(() => {
      try {
        addToCart(product, quantity);
        trackAddToCart(product, quantity);
        setStatus('idle');
      } catch {
        setStatus('error');
      }
    }, 320);
  };

  let buttonLabel = isCombo ? 'Agregar combo' : 'Agregar al carrito';
  if (inCart > 0) buttonLabel = `Agregar ${quantity} más`;
  if (status === 'adding') buttonLabel = 'Agregando...';
  if (status === 'error') buttonLabel = 'Intentar nuevamente';

  const cardClass = [
    'pcard',
    isCombo && 'pcard--combo',
    wholesaleApplied && 'pcard--wholesale',
    status === 'error' && 'pcard--error',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={cardClass}>
      <div className="pcard__top">
        <span className="pcard__tag">{tagLabel(product)}</span>
        <div className="pcard__flags">
          {inCart > 0 && <span className="pcard__chip">En tu carrito</span>}
          {wholesaleApplied && (
            <FaCheckCircle
              className="pcard__flag pcard__flag--ok"
              title="Precio mayorista aplicado"
            />
          )}
          {status === 'adding' && <span className="pcard__spinner" aria-hidden="true" />}
          {status === 'error' && (
            <FaExclamationTriangle
              className="pcard__flag pcard__flag--error"
              title="No pudimos agregarlo"
            />
          )}
        </div>
      </div>

      {/* La foto llega del backend; si aún no existe se muestra el marcador. */}
      <div
        className={`pcard__media${canOpenDetail ? ' pcard__media--link' : ''}`}
        onClick={canOpenDetail ? openDetail : undefined}
        role={canOpenDetail ? 'button' : undefined}
        tabIndex={canOpenDetail ? 0 : undefined}
        onKeyDown={canOpenDetail ? openDetailOnKey : undefined}
        aria-label={canOpenDetail ? `Ver detalles de ${product.name}` : undefined}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="pcard__img" />
        ) : (
          <div className="pcard__img-placeholder">
            <FaCamera aria-hidden="true" />
            <span>Imagen pendiente</span>
          </div>
        )}
      </div>

      <h3 className="pcard__name">
        <span>{product.name}</span>
        {!isCombo && product.flavor && (
          <span className="pcard__name-flavor">de {product.flavor}</span>
        )}
      </h3>

      {isCombo ? (
        <>
          {packages > 0 && (
            <p className="pcard__meta">
              Incluye {packages} {plural(packages, 'paquete', 'paquetes')}
            </p>
          )}
          <div className="pcard__combo-body">
            {includes.length > 0 && (
              <ul className="pcard__includes">
                {includes.map((item, i) => (
                  <li key={`${i}-${item}`}>{item}</li>
                ))}
              </ul>
            )}
            <div className="pcard__combo-price">
              <span className="pcard__price-label">Precio especial del combo</span>
              <span className="pcard__price-value">{formatPrice(product.price)}</span>
              <span className="pcard__price-note">por combo</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {(product.weight > 0 || product.unitsPerPackage > 0) && (
            <p className="pcard__meta">
              {[
                product.weight > 0 && `${formatWeight(product.weight)} por unidad`,
                product.unitsPerPackage > 0 &&
                  `${product.unitsPerPackage} unidades por paquete`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}

          {product.shortDescription && (
            <p className="pcard__desc">{product.shortDescription}</p>
          )}

          <div className="pcard__prices">
            {wholesaleApplied ? (
              <>
                <div className="pcard__price pcard__price--applied">
                  <span className="pcard__price-label pcard__price-label--ok">
                    Precio mayorista aplicado
                  </span>
                  <span className="pcard__price-value">
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span className="pcard__price-note">por paquete</span>
                </div>
                <div className="pcard__price pcard__price--muted">
                  <span className="pcard__price-label">Precio regular:</span>
                  <s className="pcard__price-strike">{formatPrice(product.price)}</s>
                </div>
              </>
            ) : (
              <>
                <div className="pcard__price">
                  <span className="pcard__price-label">Precio regular</span>
                  <span className="pcard__price-value">{formatPrice(product.price)}</span>
                  <span className="pcard__price-note">por paquete</span>
                </div>
                {hasWholesale && (
                  <div className="pcard__price pcard__price--bulk">
                    <span className="pcard__price-label pcard__price-label--bulk">
                      Precio mayorista
                    </span>
                    <span className="pcard__price-value">
                      {formatPrice(product.wholesalePrice)}
                    </span>
                    <span className="pcard__price-note">
                      Al completar {WHOLESALE_THRESHOLD} paquetes combinados
                      <FaInfoCircle
                        className="pcard__price-info"
                        title={`El precio mayorista se aplica a todo el carrito al sumar ${WHOLESALE_THRESHOLD} paquetes entre referencias. Los combos no suman.`}
                      />
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {inCart > 0 && (
        <p className="pcard__cart-line">
          {inCart}{' '}
          {isCombo
            ? plural(inCart, 'combo', 'combos')
            : plural(inCart, 'paquete', 'paquetes')}{' '}
          en tu carrito
        </p>
      )}

      <div className="pcard__actions">
        <div className="pcard__stepper">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Quitar uno"
          >
            −
          </button>
          <span className="pcard__stepper-value" aria-live="polite">
            {quantity}
          </span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Agregar uno">
            +
          </button>
        </div>

        <button
          type="button"
          className="pcard__btn"
          onClick={handleAdd}
          disabled={status === 'adding'}
        >
          {status === 'idle' && <FaShoppingCart aria-hidden="true" />}
          <span>{buttonLabel}</span>
        </button>
      </div>

      {status === 'error' && <p className="pcard__error">No pudimos agregarlo</p>}

      {isCombo && (
        <p className="pcard__note">
          <FaInfoCircle aria-hidden="true" />
          <span>
            El combo mantiene su precio especial y no suma paquetes al progreso mayorista.
          </span>
        </p>
      )}
    </article>
  );
}

export default ProductCard;
