import { motion } from 'framer-motion';
import {
  FaSnowflake,
  FaArrowRight,
  FaImage,
  FaBoxOpen,
  FaUtensils,
  FaClipboardList,
} from 'react-icons/fa';

const steps = [
  {
    num: 1,
    title: 'Preparación',
    desc: 'Organizamos materias primas y rellenos según cada referencia.',
  },
  {
    num: 2,
    title: 'Formado',
    desc: 'Utilizamos procesos y maquinaria especializados para dar forma y presentación al producto.',
  },
  {
    num: 3,
    title: 'Revisión',
    desc: 'Verificamos aspectos visibles como forma, cierre y presentación antes de continuar.',
  },
  {
    num: 4,
    title: 'Congelación y empaque',
    desc: 'El producto se congela y empaca para protegerlo durante su almacenamiento y entrega.',
  },
  {
    num: 5,
    title: 'Conservación y despacho',
    desc: 'Mantenemos las condiciones necesarias para que llegue congelado y listo para preparar.',
  },
];

const trust = [
  { icon: <FaSnowflake />, text: 'Conservación a -18 °C' },
  { icon: <FaBoxOpen />, text: 'Empaque rotulado' },
  { icon: <FaUtensils />, text: 'Producto congelado listo para freír' },
  { icon: <FaClipboardList />, text: 'Instrucciones de preparación y conservación' },
];

function LandingQualityProcess({ onNavigate }) {
  return (
    <section className="lp-quality">
      <div className="lp-quality__inner">
        <motion.div
          className="lp-quality__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-quality__badge">
            <FaSnowflake /> Proceso y calidad
          </span>
          <h2 className="lp-quality__title">
            La calidad también se construye{' '}
            <span className="lp-quality__title-em">antes de freír</span>
          </h2>
          <p className="lp-quality__subtitle">
            Detrás de cada paquete hay preparación, formado, revisión,
            congelación y empaque. Etapas organizadas para entregar
            productos listos para preparar y conservar correctamente.
          </p>
        </motion.div>

        <div className="lp-quality__steps">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="lp-quality__step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Placeholder: falta la fotografía real de esta etapa del proceso. */}
              <div className="lp-quality__step-img-wrap">
                <FaImage className="lp-quality__step-img-icon" />
              </div>
              <span className="lp-quality__step-num">{s.num}</span>
              <h3 className="lp-quality__step-title">{s.title}</h3>
              <p className="lp-quality__step-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="lp-quality__trust"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-quality__trust-label">
            Elementos de confianza
          </span>
          <div className="lp-quality__trust-grid">
            {trust.map((t) => (
              <span key={t.text} className="lp-quality__trust-item">
                <span className="lp-quality__trust-icon">{t.icon}</span>
                {t.text}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="lp-quality__cta-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="lp-btn lp-quality__cta"
            onClick={() => onNavigate('tienda')}
          >
            Conocer nuestro proceso <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingQualityProcess;
