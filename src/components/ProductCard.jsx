import { useCart } from '../context/CartContext';

const getBadge = (product, index) => {
  if (index === 0) return 'Más vendido';
  if (product.category === 'Empanadas') return 'Alta rotación';
  if (product.category === 'Pasteles') return 'Destacado';
  return null;
};

function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const badge = getBadge(product, index);
  const weightLabel =
    product.weight >= 1000
      ? `${product.weight / 1000}kg`
      : `${product.weight}g`;

  return (
    <article className="pcard">
      <div className="pcard__img-wrap">
        {badge && <span className="pcard__badge">{badge}</span>}
        <img src="/pollo_carne.jpg" alt={product.name} className="pcard__img" />
      </div>

      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        {product.flavor && <p className="pcard__flavor">{product.flavor}</p>}
        <p className="pcard__specs">
          Paquete x{product.unitsPerPackage} unidades · {weightLabel} c/u
        </p>
        <p className="pcard__frozen">Producto congelado listo para freír</p>

        <div className="pcard__price-area">
          <span className="pcard__price">{formatPrice(product.price)}</span>
          <span className="pcard__bulk">Mayorista desde 10 paquetes</span>
        </div>

        <a className="pcard__details" href="#">Ver detalles →</a>

        <button className="pcard__btn" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
