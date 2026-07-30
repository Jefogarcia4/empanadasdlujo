import { motion } from 'framer-motion';
import { FaArrowRight, FaMotorcycle, FaFire, FaSnowflake } from 'react-icons/fa';

function LandingHero({ onNavigate }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero__inner">
        <div className="lp-hero__text">
          <motion.span
            className="lp-hero__label"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fábrica de empanadas y pasteles congelados en Medellín
          </motion.span>

          <motion.h1
            className="lp-hero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Empanadas y pasteles{' '}
            <span className="lp-hero__title-em">congelados</span> para
            disfrutar en casa o vender en tu negocio
          </motion.h1>

          <motion.p
            className="lp-hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Compra desde 2 paquetes, elige combos desde{' '}
            <strong>$55.000</strong>{' '}
            <br className="lp-hero__br" />
            o accede a precios mayoristas por volumen.
          </motion.p>

          <motion.div
            className="lp-hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              className="lp-btn lp-btn--primary"
              onClick={() => onNavigate('tienda')}
            >
              Ver productos <FaArrowRight />
            </button>
            <button
              className="lp-btn lp-btn--outline"
              onClick={() => onNavigate('tienda')}
            >
              Opciones para negocios
            </button>
          </motion.div>

          <motion.div
            className="lp-hero__trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="lp-hero__trust-item">
              <FaMotorcycle aria-hidden="true" /> Entregas en Medellín y el Valle de Aburrá
            </span>
            <span className="lp-hero__trust-item">
              <FaFire aria-hidden="true" /> Listos para freír
            </span>
            <span className="lp-hero__trust-item">
              <FaSnowflake aria-hidden="true" /> Conservación a -18 °C
            </span>
          </motion.div>
        </div>

        <motion.div
          className="lp-hero__visual"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 80 }}
        >
          <div className="lp-hero__image-wrap">
            <img
              src="/pollo_carne.jpg"
              alt="Plato de empanadas D'lujo listas para servir"
              className="lp-hero__image"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingHero;
