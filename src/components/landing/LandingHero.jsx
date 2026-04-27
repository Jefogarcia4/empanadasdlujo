import { motion } from 'framer-motion';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

function LandingHero({ onNavigate }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero__bg-blobs">
        <div className="lp-blob lp-blob--1" />
        <div className="lp-blob lp-blob--2" />
        <div className="lp-blob lp-blob--3" />
      </div>

      <div className="lp-hero__content">
        <motion.div
          className="lp-hero__badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🏭 Fábrica B2B · Medellín · Valle de Aburrá
        </motion.div>

        <motion.h1
          className="lp-hero__title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          El problema no es<br />
          la empanada.<br />
          <span className="lp-hero__title--highlight">Es la fabricación.</span>
        </motion.h1>

        <motion.p
          className="lp-hero__subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Somos fábrica especializada en empanadas y pasteles congelados para negocios.
          Proceso estandarizado, calidad constante y un proveedor que cumple.
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
            Ver Catálogo <FaArrowRight />
          </button>
          <a
            className="lp-btn lp-btn--whatsapp"
            href="https://wa.me/573000000000?text=Hola!%20Quiero%20cotizar%20empanadas%20D'Lujo%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Cotizar por WhatsApp
          </a>
        </motion.div>

        <motion.div
          className="lp-hero__trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span>✅ Desde 1 paquete</span>
          <span>✅ Calidad consistente</span>
          <span>✅ Cumplimiento real</span>
        </motion.div>
      </div>

      <motion.div
        className="lp-hero__visual"
        initial={{ opacity: 0, scale: 0.85, x: 40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 80 }}
      >
        <div className="lp-hero__plate">
          <span className="lp-hero__emoji">🥟</span>
          <div className="lp-hero__floating lp-hero__floating--1">Proveedor serio</div>
          <div className="lp-hero__floating lp-hero__floating--2">x50 / paquete</div>
          <div className="lp-hero__floating lp-hero__floating--3">⚙️ Proceso estándar</div>
        </div>
      </motion.div>
    </section>
  );
}

export default LandingHero;
