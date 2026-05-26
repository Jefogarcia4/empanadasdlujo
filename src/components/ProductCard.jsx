import {
  FaFire,
  FaBoxOpen,
  FaPepperHot,
  FaWeightHanging,
  FaRulerCombined,
  FaMoneyBillAlt,
  FaTag,
  FaChartLine,
  FaCheck,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const TARGET_MARGIN = 0.6;

function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

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

  const sizeWord = product.name?.split(' ').slice(1).join(' ') || product.category;

  const isMasa = product.category === 'Masa';
  const fillingLabel = isMasa ? 'Tipo' : 'Relleno';

  const costPerUnit = product.unitsPerPackage > 0
    ? product.price / product.unitsPerPackage
    : 0;
  const rawRetailUnit = costPerUnit / (1 - TARGET_MARGIN);
  const suggestedRetailUnit = Math.ceil(rawRetailUnit / 100) * 100;
  const estimatedMargin = suggestedRetailUnit > 0
    ? Math.round(((suggestedRetailUnit - costPerUnit) / suggestedRetailUnit) * 100)
    : 0;

  const hasWholesale =
    product.wholesalePrice > 0 && product.wholesalePrice < product.price;

  const badge = product.badge ?? null;

  return (
    <article className="pcard">
      <header className="pcard__header">
        <div className="pcard__header-text">
          <h3 className="pcard__name">{product.name}</h3>
          <p className="pcard__subtitle">
            Sabor {product.flavor} • Perfectas para eventos
          </p>
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

      <div className="pcard__price-block">
        <FaMoneyBillAlt className="pcard__price-icon" aria-hidden="true" />
        <div>
          <p className="pcard__price">
            {formatPrice(product.price)}
            <span className="pcard__price-suffix"> por paquete</span>
          </p>
          <p className="pcard__price-note">(precio por menor)</p>
        </div>
      </div>

      {hasWholesale && (
        <div className="pcard__promo">
          <FaCheck className="pcard__promo-icon" aria-hidden="true" />
          <div>
            <p className="pcard__promo-title">
              Ahorra y paga solo {formatPrice(product.wholesalePrice)}
            </p>
            <p className="pcard__promo-sub">Compra 10 paquetes o más</p>
          </div>
        </div>
      )}

      {!isMasa && (
        <div className="pcard__resell">
          <div className="pcard__resell-item">
            <FaTag className="pcard__resell-icon" aria-hidden="true" />
            <div>
              <span>Vende desde</span>
              <strong>{formatPrice(suggestedRetailUnit)} c/u</strong>
            </div>
          </div>
          <div className="pcard__resell-item">
            <FaChartLine className="pcard__resell-icon" aria-hidden="true" />
            <div>
              <span>Margen estimado</span>
              <strong className="pcard__margin">+{estimatedMargin}%</strong>
            </div>
          </div>
        </div>
      )}

      <div className="pcard__actions">
        <a className="pcard__details" href="#" onClick={handleDetailsClick}>
          Ver detalles →
        </a>
        <button className="pcard__btn" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
