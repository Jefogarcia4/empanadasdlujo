import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { fetchCombos } from '../../services/api';
import { useCart } from '../../context/CartContext';

const RIBBONS = ['Primera prueba', 'Más variedad', 'Mejor ahorro'];
const FALLBACK_IMAGES = [
  '/pollo_carne.jpg',
  '/img_products/pastel_coctelero.png',
  '/img_products/emp_carne.jpg',
];

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);

function LandingStarterCombos({ onNavigate }) {
  const [combos, setCombos] = useState([]);
  const [status, setStatus] = useState('loading');
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    let mounted = true;
    fetchCombos()
      .then((data) => {
        if (mounted) {
          setCombos(data.slice(0, 3));
          setStatus('ready');
        }
      })
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  const handleChoose = (combo) => {
    addToCart(combo);
    openCart();
  };

  if (status === 'error' || (status === 'ready' && combos.length === 0)) {
    return null;
  }

  return (
    <section className="lp-starter">
      <div className="lp-starter__inner">
        <motion.div
          className="lp-starter__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-starter__badge">
            <FaBoxOpen /> Combos para empezar
          </span>
          <h2 className="lp-starter__title">
            Prueba, <span className="lp-starter__title-gold">comparte</span>{' '}
            o{' '}
            <span className="lp-starter__title-red">empieza a vender</span>
          </h2>
          <p className="lp-starter__subtitle">
            Empieza con productos seleccionados y ahorro incluido. Una forma
            práctica de conocer la marca, surtir tu casa o dar tus primeros
            pasos vendiendo.
          </p>
        </motion.div>

        {status === 'loading' ? (
          <p className="lp-starter__status">Cargando combos...</p>
        ) : (
          <>
            <div className="lp-starter__grid">
              {combos.map((combo, i) => (
                <motion.article
                  key={combo.id}
                  className="lp-starter__card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <span className="lp-starter__ribbon">
                    {combo.badge || RIBBONS[i] || 'Combo'}
                  </span>
                  <div className="lp-starter__card-img-wrap">
                    <img
                      src={combo.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                      alt={combo.name}
                      className="lp-starter__card-img"
                    />
                  </div>
                  <h3 className="lp-starter__card-name">{combo.name}</h3>
                  <div className="lp-starter__card-price-row">
                    <span className="lp-starter__card-price">
                      {formatPrice(combo.price)}
                    </span>
                    {combo.unitsTotal > 0 && (
                      <span className="lp-starter__card-units">
                        <FaBoxOpen /> {combo.unitsTotal} unidades
                      </span>
                    )}
                  </div>
                  {combo.normalPrice > combo.price && (
                    <p className="lp-starter__card-normal">
                      Valor individual:{' '}
                      <s>{formatPrice(combo.normalPrice)}</s>
                    </p>
                  )}
                  {combo.savings > 0 && (
                    <p className="lp-starter__card-savings">
                      ★ Ahorras {formatPrice(combo.savings)}
                    </p>
                  )}
                  {combo.shortDescription && (
                    <p className="lp-starter__card-desc">
                      {combo.shortDescription}
                    </p>
                  )}
                  <button
                    className="lp-btn lp-starter__card-btn"
                    onClick={() => handleChoose(combo)}
                  >
                    Elegir combo <FaArrowRight />
                  </button>
                </motion.article>
              ))}
            </div>

            <motion.div
              className="lp-starter__footer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="lp-btn lp-starter__cta"
                onClick={() => onNavigate('tienda')}
              >
                Ver todos los productos <FaArrowRight />
              </button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

export default LandingStarterCombos;
