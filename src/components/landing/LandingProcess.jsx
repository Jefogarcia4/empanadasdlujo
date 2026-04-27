import { motion } from 'framer-motion';
import { FaCog, FaIndustry, FaLeaf } from 'react-icons/fa';

const differentiators = [
  {
    icon: <FaIndustry />,
    tag: 'Ventaja injusta',
    title: 'Maquinaria propia diseñada desde cero',
    desc: 'Nuestra máquina para fabricar empanadas fue construida internamente. No dependemos de terceros para producir. Eso nos da control real sobre calidad, tiempo y capacidad.',
    detail: 'Alta capacidad · Proceso repetible · Cero improvisación',
    gradient: 'lp-process__card--burgundy',
  },
  {
    icon: <FaCog />,
    tag: 'Estandarización',
    title: 'Proceso industrial controlado',
    desc: 'Cada lote sale igual al anterior. Masa calibrada, relleno pesado, pre-fritura controlada. La consistencia no es promesa: es el resultado de tener proceso real.',
    detail: 'Control de calidad · Trazabilidad · Lote uniforme',
    gradient: 'lp-process__card--orange',
  },
  {
    icon: <FaLeaf />,
    tag: 'Pre-fritura responsable',
    title: 'Sin aceite. Sin conservantes. Sin trampa.',
    desc: 'Nuestros productos salen libres de grasas saturadas y conservantes. El cliente final decide cómo terminar el producto: aceite, horno o calor. Tu negocio vende salud.',
    detail: 'Libre de conservantes · Sin grasas reutilizadas · Más rentable',
    gradient: 'lp-process__card--gold',
  },
];

function LandingProcess() {
  return (
    <section className="lp-process">
      <div className="lp-process__bg" aria-hidden="true" />
      <div className="lp-container">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag lp-section-tag--light">Proceso serio</p>
          <h2 className="lp-section-title lp-section-title--light">
            La calidad no se promete.<br />
            <span className="lp-highlight--gold">Se construye.</span>
          </h2>
          <p className="lp-section-sub lp-section-sub--light">
            Aquí no hay improvisación. Hay método, maquinaria e infraestructura real.
          </p>
        </motion.div>

        <div className="lp-process__grid">
          {differentiators.map((d, i) => (
            <motion.div
              key={i}
              className={`lp-process__card ${d.gradient}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="lp-process__tag">{d.tag}</div>
              <div className="lp-process__icon">{d.icon}</div>
              <h3 className="lp-process__title">{d.title}</h3>
              <p className="lp-process__desc">{d.desc}</p>
              <div className="lp-process__detail">{d.detail}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="lp-process__footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="lp-process__slogan">
            "Empanadas vende cualquiera.<br />
            <strong>Proceso serio, no cualquiera.</strong>"
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingProcess;
