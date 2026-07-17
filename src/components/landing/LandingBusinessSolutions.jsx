import { motion } from 'framer-motion';
import {
  FaTags,
  FaArrowRight,
  FaImage,
  FaBoxOpen,
  FaSearch,
  FaMoneyBillWave,
  FaStar,
  FaCoffee,
  FaUtensils,
  FaTruck,
  FaCampground,
  FaCalendarAlt,
  FaStore,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaBoxOpen />,
    title: 'Evita fabricar desde cero',
    desc: 'Incorpora productos listos para freír sin asumir directamente maquinaria, personal y procesos productivos.',
  },
  {
    icon: <FaSearch />,
    title: 'Prueba antes de aumentar volumen',
    desc: 'Comienza con 2 paquetes o un combo y conoce el producto antes de realizar pedidos mayores.',
  },
  {
    icon: <FaMoneyBillWave />,
    title: 'Accede a precios por volumen',
    desc: 'Desde 10 paquetes combinados puedes comprar con precio mayorista.',
  },
  {
    icon: <FaStar />,
    title: 'Beneficios especiales para clientes recurrentes',
    desc: 'Tu historial de compra puede darte acceso a condiciones especiales según tu recurrencia y perfil comercial.',
  },
];

const businessTypes = [
  { icon: <FaCoffee />, label: 'Cafeterías' },
  { icon: <FaUtensils />, label: 'Restaurantes' },
  { icon: <FaBoxOpen />, label: 'Puntos de fritos' },
  { icon: <FaTruck />, label: 'Distribuidores' },
  { icon: <FaCampground />, label: 'Catering' },
  { icon: <FaCalendarAlt />, label: 'Eventos' },
  { icon: <FaStore />, label: 'Comercios' },
];

function LandingBusinessSolutions({ onNavigate }) {
  return (
    <section className="lp-bizsolutions">
      <div className="lp-bizsolutions__inner">
        <div className="lp-bizsolutions__text">
          <motion.span
            className="lp-bizsolutions__badge"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FaTags /> Soluciones para negocios
          </motion.span>

          <motion.h2
            className="lp-bizsolutions__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Un portafolio pensado para vender, abastecer y crecer con{' '}
            <span className="lp-bizsolutions__title-em">orden</span>
          </motion.h2>

          <motion.p
            className="lp-bizsolutions__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Empieza con pocos paquetes, evalúa las referencias que mejor
            funcionan para tu negocio y accede a mejores condiciones a
            medida que aumenta tu volumen y recurrencia.
          </motion.p>

          <div className="lp-bizsolutions__features">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="lp-bizsolutions__feature"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              >
                <span className="lp-bizsolutions__feature-icon">{f.icon}</span>
                <div>
                  <h3 className="lp-bizsolutions__feature-title">{f.title}</h3>
                  <p className="lp-bizsolutions__feature-desc">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="lp-bizsolutions__types"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="lp-bizsolutions__types-label">
              Tipos de negocio
            </span>
            <div className="lp-bizsolutions__types-list">
              {businessTypes.map((t) => (
                <span key={t.label} className="lp-bizsolutions__type-tag">
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lp-bizsolutions__ctas"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <button
              className="lp-btn lp-bizsolutions__cta lp-bizsolutions__cta--solid"
              onClick={() => onNavigate('tienda')}
            >
              Conocer opciones para negocios <FaArrowRight />
            </button>
            <button
              className="lp-btn lp-bizsolutions__cta lp-bizsolutions__cta--outline"
              onClick={() => onNavigate('tienda')}
            >
              Ver productos para vender
            </button>
          </motion.div>
        </div>

        <motion.div
          className="lp-bizsolutions__visual lp-bizsolutions__visual--placeholder"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FaImage className="lp-bizsolutions__visual-icon" />
          <span>Asset pendiente: local/negocio con productos D'lujo</span>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingBusinessSolutions;
