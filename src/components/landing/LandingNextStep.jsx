import { motion } from 'framer-motion';
import { FaStar, FaArrowRight, FaCalendarAlt, FaTruck, FaWhatsapp } from 'react-icons/fa';

function LandingNextStep({ onNavigate }) {
  return (
    <section className="lp-nextstep">
      <div className="lp-nextstep__inner">
        <motion.span
          className="lp-nextstep__badge"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <FaStar /> Tu siguiente paso
        </motion.span>

        <motion.h2
          className="lp-nextstep__title"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Elige cómo quieres empezar
        </motion.h2>

        <motion.p
          className="lp-nextstep__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Compra desde 2 paquetes, elige uno de nuestros combos o conoce las
          opciones disponibles para negocios y clientes recurrentes.
        </motion.p>

        <motion.div
          className="lp-nextstep__ctas"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            className="lp-btn lp-nextstep__btn lp-nextstep__btn--primary"
            onClick={() => onNavigate('tienda')}
          >
            Ver productos <FaArrowRight />
          </button>
          <button
            className="lp-btn lp-nextstep__btn lp-nextstep__btn--outline"
            onClick={() => onNavigate('tienda')}
          >
            Opciones para negocios <FaArrowRight />
          </button>
        </motion.div>

        <motion.div
          className="lp-nextstep__micro"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span>
            <FaCalendarAlt /> Pedidos con anticipación
          </span>
          <span>
            <FaTruck /> Entregas en el Valle de Aburrá
          </span>
          <span>
            <FaWhatsapp /> Atención disponible por WhatsApp
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingNextStep;
