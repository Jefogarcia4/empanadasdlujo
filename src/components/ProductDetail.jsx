import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const FICHA_TECNICA = [
  {
    icon: '🌡️',
    title: 'Conservación',
    desc: 'Conservar en congelación',
  },
  {
    icon: '🍳',
    title: 'Preparación',
    desc: 'Freír sin descongelar',
  },
  {
    icon: '🔥',
    title: 'Temp. Aceite',
    desc: '180 °C',
  },
  {
    icon: '⏱️',
    title: 'Tiempo',
    desc: '3 a 5 minutos',
  },
  {
    icon: '📅',
    title: 'Vida útil',
    desc: '6 meses congelado',
  },
  {
    icon: '📦',
    title: 'Presentación',
    desc: 'Bolsa sellada',
  },
];

const TESTIMONIOS = [
  {
    title: 'Producto práctico para vender',
    text: 'Producto práctico para vender, relleno de papa y guiso, con masa amarilla.',
  },
  {
    title: 'Buen tamaño para rotación',
    text: 'Tamaño cocteler ideal, se consumen en una sola mordida y dejan al cliente con ganas de más.',
  },
  {
    title: 'Fácil de preparar',
    text: 'Fácil de preparar con tan solo freír. Masa de maíz amarillo colombiano con relleno tradicional.',
  },
];

const buildCaracteristicas = (flavor) => [
  'Masa amarilla de maíz',
  `Relleno de ${flavor?.toLowerCase() || 'sabor tradicional'}`,
  'Producto congelado',
  'Listo para freír',
  'Ideal para alta rotación',
];

function ProductDetail({ product, onNavigate }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="pdetail">
        <div className="pdetail__empty">
          <p>No se ha seleccionado ningún producto.</p>
          <button className="pdetail__back-btn" onClick={() => onNavigate('tienda')}>
            ← Volver a la tienda
          </button>
        </div>
      </main>
    );
  }

  const weightLabel =
    product.weight >= 1000 ? `${product.weight / 1000}kg` : `${product.weight}g`;

  const bulkPrice =
    product.wholesalePrice && product.wholesalePrice > 0
      ? product.wholesalePrice
      : Math.round((product.price * 0.8) / 500) * 500;
  const caracteristicas = buildCaracteristicas(product.flavor);

  const badge = product.badge ?? null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  return (
    <main className="pdetail">
      <div className="pdetail__container">
        {/* ── Top: imagen + info en 2 columnas ─────────── */}
        <div className="pdetail__top">
          <section className="pdetail__hero">
            {badge && (
              <>
                <span className="pdetail__hero-badge pdetail__hero-badge--left">
                  <small>Badge:</small>
                  <strong>{badge}</strong>
                </span>
                <span className="pdetail__hero-badge pdetail__hero-badge--right">
                  <small>Badge:</small>
                  <strong>{badge}</strong>
                </span>
              </>
            )}
            <img
              src={product.image || '/pollo_carne.jpg'}
              alt={product.name}
              className="pdetail__hero-img"
            />
          </section>

          <div className="pdetail__main">
            <h1 className="pdetail__title">{product.name}</h1>
            <p className="pdetail__specs">
              Paquete x{product.unitsPerPackage} unidades · {weightLabel} c/u
            </p>
            {product.flavor && (
              <p className="pdetail__description">
                {product.name} {product.flavor}, masa de maíz amarillo
                colombiano con relleno tradicional, lista para freír.
              </p>
            )}

            <div className="pdetail__price-box">
              <div className="pdetail__price-main">
                <span className="pdetail__price-amount">
                  {formatPrice(product.price)}
                </span>
                <span className="pdetail__price-tag">minorista</span>
              </div>
              <div className="pdetail__price-bulk">
                <strong>Precio por mayor: {formatPrice(bulkPrice)}</strong>
                <small>desde 10 paquetes combinados</small>
              </div>
            </div>

            <div className="pdetail__chips">
              <span className="pdetail__chip">Desde 2 paquetes</span>
              <span className="pdetail__chip">Mayorista desde 10 paquetes</span>
              {badge && <span className="pdetail__chip">{badge}</span>}
              <span className="pdetail__chip">Listo para freír</span>
            </div>

            <div className="pdetail__actions">
              <div className="pdetail__qty">
                <button
                  type="button"
                  onClick={decrement}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={increment}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="pdetail__add-btn"
                onClick={handleAddToCart}
              >
                🛒 Agregar al carrito ({quantity})
              </button>
              <button
                type="button"
                className="pdetail__back-btn"
                onClick={() => onNavigate('tienda')}
              >
                Volver a la tienda
              </button>
            </div>
          </div>
        </div>

        {/* ── Banner mayorista ─────────────────────────── */}
        <aside className="pdetail__aside-card pdetail__aside-card--banner">
          <div className="pdetail__aside-text">
            <h4>¿Compras para vender?</h4>
            <p>
              Compra al mayorista desde <strong>10 paquetes combinados</strong> y
              accede al mejor precio.
            </p>
            <a className="pdetail__aside-link" href="#">
              Consulta precios y volumen
            </a>
          </div>
          <button
            type="button"
            className="pdetail__add-btn pdetail__add-btn--sm"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </aside>

        {/* ── Ficha técnica ────────────────────────────── */}
        <section className="pdetail__section">
          <h2 className="pdetail__section-title">Ficha técnica</h2>
          <div className="pdetail__ficha">
            {FICHA_TECNICA.map((item) => (
              <div key={item.title} className="pdetail__ficha-item">
                <span className="pdetail__ficha-icon">{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.desc}</small>
              </div>
            ))}
            <div className="pdetail__ficha-item">
              <span className="pdetail__ficha-icon">⚖️</span>
              <strong>Peso</strong>
              <small>{weightLabel} por unidad</small>
            </div>
          </div>
        </section>

        {/* ── Descripción y características ─────────────── */}
        <section className="pdetail__section pdetail__two-col">
          <div>
            <h2 className="pdetail__section-title">Descripción del producto</h2>
            <p className="pdetail__paragraph">
              {product.name}
              {product.flavor ? ` ${product.flavor}` : ''}, elaborada con masa
              de maíz amarillo colombiano y relleno tradicional. Producto
              congelado, listo para freír. Ideal para reventa, eventos o
              consumo en el hogar.
            </p>
          </div>
          <div>
            <h2 className="pdetail__section-title">
              Maíz amarillo colombiano y relleno tradicional
            </h2>
            <ul className="pdetail__list">
              {caracteristicas.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="pdetail__highlight">
              El lujo no está en el precio. Está en el producto.
            </p>
          </div>
        </section>

        {/* ── Testimonios ───────────────────────────────── */}
        <section className="pdetail__section">
          <h2 className="pdetail__section-title">Testimonios / beneficios</h2>
          <p className="pdetail__paragraph">
            Lo que más valoran nuestros clientes
          </p>
          <div className="pdetail__testimonios">
            {TESTIMONIOS.map((t) => (
              <article key={t.title} className="pdetail__testimonio">
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetail;
