import {
  FaFire,
  FaBoxOpen,
  FaPepperHot,
  FaWeightHanging,
  FaRulerCombined,
  FaTag,
  FaChartLine,
  FaArrowRight,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { trackAddToCart } from '../services/metaPixel';

function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    trackAddToCart(product);
  };

  const handleDetailsClick = (e) => {
    e.preventDefault();
    if (onSelectProduct) onSelectProduct(product);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const weightLabel =
    product.weight >= 1000
      ? `${product.weight / 1000} kg`
      : `${product.weight} g`;

  const nameParts = product.name?.split(' ') ?? [];
  const nameFirst = nameParts[0] ?? '';
  const nameRest = nameParts.slice(1).join(' ');
  const sizeWord = nameRest || product.category;

  const isMasa = product.category === 'Masa';
  const fillingLabel = isMasa ? 'Tipo' : 'Relleno';

  const suggestedRetailUnit = product.suggestedRetailUnit ?? 0;
  const estimatedMargin = product.estimatedMargin;

  const hasWholesale =
    product.wholesalePrice > 0 && product.wholesalePrice < product.price;

  const badge = product.badge ?? null;

  return (
    <article className="pcard">
      <header className="pcard__header">
        <div className="pcard__header-text">
          <h3 className="pcard__name">
            <span>{nameFirst}</span>
            {nameRest && <span>{nameRest}</span>}
          </h3>
        </div>
        {badge && (
          <span className="pcard__badge">
            <FaFire aria-hidden="true" /> {badge}
          </span>
        )}
      </header>

      <div className="pcard__img-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="pcard__img" />
        ) : (
          <div className="pcard__img-placeholder">
            <span>Imagen del producto</span>
          </div>
        )}
      </div>

      <ul className="pcard__info-grid">
        <li className="pcard__info">
          <FaBoxOpen className="pcard__info-icon" aria-hidden="true" />
          <div>
            <strong>{product.unitsPerPackage} unidades</strong>
            <span>listas para vender</span>
          </div>
        </li>
        <li className="pcard__info">
          <FaPepperHot className="pcard__info-icon" aria-hidden="true" />
          <div>
            <span>{fillingLabel}:</span>
            <strong>{product.flavor}</strong>
          </div>
        </li>
        <li className="pcard__info">
          <FaWeightHanging className="pcard__info-icon" aria-hidden="true" />
          <div>
            <span>Peso:</span>
            <strong>{weightLabel} por unidad</strong>
          </div>
        </li>
        <li className="pcard__info">
          <FaRulerCombined className="pcard__info-icon" aria-hidden="true" />
          <div>
            <span>Tamaño:</span>
            <strong>{sizeWord}</strong>
          </div>
        </li>
      </ul>

      <div className="pcard__prices">
        <div className="pcard__price-col">
          <span className="pcard__price-label">Precio por menor:</span>
          <span className="pcard__price-value">{formatPrice(product.price)}</span>
        </div>
        {hasWholesale && (
          <div className="pcard__price-col pcard__price-col--mayor">
            <span className="pcard__price-label">Precio por mayor:</span>
            <span className="pcard__price-value">{formatPrice(product.wholesalePrice)}</span>
          </div>
        )}
      </div>

      {!isMasa && (
        <div className="pcard__resell">
          <span className="pcard__resell-item">
            <FaTag className="pcard__resell-icon" aria-hidden="true" />
            Vende desde <strong>{formatPrice(suggestedRetailUnit)} c/u</strong>
          </span>
          {estimatedMargin != null && (
            <span className="pcard__resell-item">
              <FaChartLine className="pcard__resell-icon" aria-hidden="true" />
              Margen estimado <strong className="pcard__margin">+{estimatedMargin}%</strong>
            </span>
          )}
        </div>
      )}

      <div className="pcard__actions">
        <a className="pcard__details" href="#" onClick={handleDetailsClick}>
          Ver detalles <FaArrowRight aria-hidden="true" />
        </a>
        <button className="pcard__btn" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
