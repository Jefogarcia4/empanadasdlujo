import { motion } from 'framer-motion';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

const featured = ['DLJ-EMP-001', 'DLJ-EMP-002', 'DLJ-EMP-004', 'DLJ-PAS-001', 'DLJ-PAS-002', 'DLJ-MASA-001'];
const featuredProducts = products.filter(p => featured.includes(p.id));

const EMOJI_MAP = {
  Empanadas: '🥟',
  Pasteles: '🥐',
  Masa: '🌽',
};

function LandingProducts({ onNavigate }) {
  const { addItem } = useCart();

  return (
    <section className="lp-products">
      <div className="lp-container">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag">Portafolio</p>
          <h2 className="lp-section-title">
            Productos para <span className="lp-highlight">negocios que quieren crecer</span>
          </h2>
          <p className="lp-section-sub">
            Empanadas y pasteles congelados con proceso estandarizado. Cada referencia pensada para rotar bien en tu tipo de negocio.
          </p>
        </motion.div>

        <div className="lp-products__grid">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              className="lp-product-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="lp-product-card__img">
                <span className="lp-product-card__emoji">
                  {EMOJI_MAP[product.category] || '🥟'}
                </span>
                <span className="lp-product-card__badge">{product.category}</span>
              </div>
              <div className="lp-product-card__body">
                <h3 className="lp-product-card__name">{product.name}</h3>
                <p className="lp-product-card__flavor">{product.flavor}</p>
                <div className="lp-product-card__meta">
                  <span>{product.weight}g c/u</span>
                  <span>x{product.unitsPerPackage} uds</span>
                </div>
                <div className="lp-product-card__footer">
                  <div className="lp-product-card__price">
                    ${product.price.toLocaleString('es-CO')}
                    <span className="lp-product-card__price-unit">/paquete</span>
                  </div>
                  <button
                    className="lp-btn lp-btn--sm"
                    onClick={() => addItem(product)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="lp-products__cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="lp-btn lp-btn--outline" onClick={() => onNavigate('tienda')}>
            Ver todos los productos →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingProducts;
