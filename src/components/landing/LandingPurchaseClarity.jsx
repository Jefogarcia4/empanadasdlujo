import { motion } from 'framer-motion';
import {
  FaInfoCircle,
  FaCheck,
  FaArrowRight,
  FaImage,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSnowflake,
  FaBoxOpen,
  FaCreditCard,
  FaClipboardList,
} from 'react-icons/fa';

const items = [
  {
    icon: <FaMapMarkerAlt />,
    title: 'Cobertura local',
    desc: 'Realizamos entregas en Medellín y municipios del Área Metropolitana del Valle de Aburrá.',
  },
  {
    icon: <FaCalendarAlt />,
    title: 'Pedidos programados',
    desc: 'Trabajamos con pedidos anticipados para organizar la fabricación y despacho correctamente.',
  },
  {
    icon: <FaSnowflake />,
    title: 'Conservación congelada',
    desc: 'Los productos deben mantenerse congelados a -18 °C hasta el momento de su preparación.',
  },
  {
    icon: <FaBoxOpen />,
    title: 'Empaque e información',
    desc: 'Cada paquete se entrega sellado, rotulado, con indicaciones para su conservación y preparación.',
  },
  {
    icon: <FaCreditCard />,
    title: 'Formas de pago',
    desc: 'Puedes pagar mediante transferencia o solicitar pago al recibir, sujeto a condiciones del pedido.',
  },
  {
    icon: <FaClipboardList />,
    title: 'Registro sanitario',
    desc: 'Registro INVIMA RSA-0036398-2025.',
  },
];

function LandingPurchaseClarity({ onNavigate }) {
  return (
    <section className="lp-clarity">
      <div className="lp-clarity__inner">
        <div className="lp-clarity__content">
          <motion.div
            className="lp-clarity__header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="lp-clarity__badge">
              <FaInfoCircle /> Compra con información clara
            </span>
            <h2 className="lp-clarity__title">
              Todo lo que necesitas saber antes de{' '}
              <span className="lp-clarity__title-em">hacer tu pedido</span>{' '}
              <FaCheck className="lp-clarity__title-check" />
            </h2>
            <p className="lp-clarity__subtitle">
              Queremos que conozcas las condiciones de compra, conservación y
              entrega, con información visible y orientación clara antes de
              confirmar.
            </p>
          </motion.div>

          <div className="lp-clarity__grid">
            {items.map((it, i) => (
              <motion.div
                key={it.title}
                className="lp-clarity__item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <span className="lp-clarity__item-icon">{it.icon}</span>
                <h3 className="lp-clarity__item-title">{it.title}</h3>
                <p className="lp-clarity__item-desc">{it.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="lp-clarity__contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <strong>Atención y acompañamiento.</strong> Puedes realizar tu
            pedido directamente en la web y recibir orientación por WhatsApp
            cuando lo necesites.
          </motion.p>

          <motion.div
            className="lp-clarity__highlight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FaCheck className="lp-clarity__highlight-icon" />
            <p>
              Información clara{' '}
              <span>desde la compra hasta la preparación.</span>
            </p>
          </motion.div>

          <button
            className="lp-btn lp-clarity__cta"
            onClick={() => onNavigate('tienda')}
          >
            Ver condiciones de compra y entrega <FaArrowRight />
          </button>
        </div>

        <motion.div
          className="lp-clarity__visual lp-clarity__visual--placeholder"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FaImage className="lp-clarity__visual-icon" />
          <span>Asset pendiente: empaque, etiqueta y bolsa térmica</span>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingPurchaseClarity;
