import { motion } from 'framer-motion';
import { FaImage, FaArrowRight } from 'react-icons/fa';

const milestones = [
  {
    title: 'Conocer el negocio desde la venta',
    desc: 'Vivimos de primera mano lo que exige atender clientes, controlar costos y mantener un producto disponible todos los días.',
  },
  {
    title: 'Aprender fabricando',
    desc: 'Los procesos manuales, las pruebas y los errores nos ayudaron a entender dónde hacía falta más orden, conocimiento y especialización.',
  },
  {
    title: 'Construir una forma propia',
    desc: 'La experiencia acumulada nos llevó a desarrollar maquinaria, organizar procesos y convertir lo aprendido en Empanadas D\'lujo.',
  },
];

function PlaceholderPhoto({ label, className = '' }) {
  return (
    <div className={`lp-story__photo lp-story__photo--placeholder ${className}`}>
      <FaImage className="lp-story__photo-icon" />
      <span className="lp-story__photo-label">Recreación visual / imagen referencial</span>
      <span className="lp-story__photo-sub">{label}</span>
    </div>
  );
}

function LandingOurStory({ onNavigate }) {
  return (
    <section className="lp-story">
      <div className="lp-story__inner">
        <motion.div
          className="lp-story__gallery"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PlaceholderPhoto label="Fachada / punto de venta original" />
          <PlaceholderPhoto label="Preparación en cocina" />
        </motion.div>

        <div className="lp-story__text">
          <motion.h2
            className="lp-story__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Aprendimos el negocio desde el{' '}
            <span className="lp-story__title-em">punto de venta</span> hasta
            la <span className="lp-story__title-em">fabricación</span>
          </motion.h2>

          <motion.p
            className="lp-story__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Empanadas D'lujo nació de la experiencia de un padre y un hijo que
            conocieron de cerca la venta, la fabricación y los retos de
            sostener un negocio de empanadas. Cada prueba fue dando forma a
            una manera más organizada de producir.
          </motion.p>

          <div className="lp-story__milestones">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                className="lp-story__milestone"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                <span className="lp-story__milestone-num">{i + 1}</span>
                <div>
                  <h3 className="lp-story__milestone-title">{m.title}</h3>
                  <p className="lp-story__milestone-desc">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            className="lp-story__quote"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            "Nuestra historia no se construyó en un solo intento, sino
            aprendiendo, corrigiendo y avanzando."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <button
              className="lp-btn lp-story__cta"
              onClick={() => onNavigate('tienda')}
            >
              Conoce nuestra historia <FaArrowRight />
            </button>
          </motion.div>
        </div>

        <motion.div
          className="lp-story__team-photo"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PlaceholderPhoto label="Fundadores con producto D'lujo" />
        </motion.div>
      </div>
    </section>
  );
}

export default LandingOurStory;
