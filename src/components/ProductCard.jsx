import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductIcon = (category) => {
    switch (category) {
      case 'Empanadas':
        return '🥟';
      case 'Pasteles':
        return '🥧';
      case 'Masa':
        return '🌽';
      default:
        return '🍽️';
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <article className="product-card">
      <div className="product-image">
        {getProductIcon(product.category)}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-flavor">{product.flavor}</p>
        <p className="product-weight">
          ⚖️ {product.weight >= 1000 ? `${product.weight / 1000} kg` : `${product.weight}g`}
        </p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒 Agregar al Carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
