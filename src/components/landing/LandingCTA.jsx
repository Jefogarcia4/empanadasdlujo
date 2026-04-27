import { motion } from 'framer-motion';
import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';

function LandingCTA({ onNavigate }) {
  return (
    <section className="lp-cta">
      <div className="lp-cta__bg-blobs">
        <div className="lp-cta-blob lp-cta-blob--1" />
        <div className="lp-cta-blob lp-cta-blob--2" />
        <div className="lp-cta-blob lp-cta-blob--3" />
      </div>
      <div className="lp-container">
        <motion.div
          className="lp-cta__content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-cta__tag">¿Listo para cambiar de proveedor?</p>
          <h2 className="lp-cta__title">
            ¿Tu proveedor actual<br />
            <span>te cumple o te improvisa?</span>
          </h2>
          <p className="lp-cta__sub">
            Empieza con 1 paquete de prueba. Mide la diferencia. Decide con números reales.
          </p>
          <div className="lp-cta__actions">
            <a
              className="lp-btn lp-btn--whatsapp lp-btn--lg"
              href="https://wa.me/573000000000?text=Hola!%20Quiero%20cotizar%20empanadas%20D'Lujo%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> Cotizar por WhatsApp
            </a>
            <button
              className="lp-btn lp-btn--outline lp-btn--lg"
              onClick={() => onNavigate('tienda')}
            >
              Ver catálogo <FaArrowRight />
            </button>
          </div>
          <p className="lp-cta__disclaimer">
            ✅ Desde 1 paquete &nbsp;·&nbsp; ✅ Valle de Aburrá &nbsp;·&nbsp; ✅ Proveedor serio
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingCTA;
