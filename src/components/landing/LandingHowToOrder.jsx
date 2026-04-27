import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const steps = [
  {
    num: '01',
    icon: '💬',
    title: 'Cotiza sin compromiso',
    desc: 'Escríbenos o revisa el catálogo. Te asesoramos qué referencia rota mejor para tu tipo de negocio y cuántos paquetes te conviene arrancar.',
  },
  {
    num: '02',
    icon: '📦',
    title: 'Recibe con cumplimiento',
    desc: 'Producimos con proceso estandarizado y entregamos en tiempo. Cada lote sale igual al anterior. Sin excusas, sin improvisación.',
  },
  {
    num: '03',
    icon: '📈',
    title: 'Vende con respaldo real',
    desc: 'Tu negocio crece cuando tiene un proveedor estable. Consistencia en producto + cumplimiento en entrega = más ventas y más tranquilidad.',
  },
];

function LandingHowToOrder({ onNavigate }) {
  return (
    <section className="lp-how">
      <div className="lp-container">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag">Así funciona</p>
          <h2 className="lp-section-title">
            3 pasos para tener un <span className="lp-highlight">proveedor serio.</span>
          </h2>
          <p className="lp-section-sub">
            Sin riesgo. Sin grandes volúmenes al inicio. Empieza desde 1 paquete y mide la diferencia.
          </p>
        </motion.div>

        <div className="lp-how__steps">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="lp-how__step"
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="lp-how__step-num">{step.num}</div>
              <div className="lp-how__step-icon">{step.icon}</div>
              <h3 className="lp-how__step-title">{step.title}</h3>
              <p className="lp-how__step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="lp-how__cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            className="lp-btn lp-btn--whatsapp lp-btn--lg"
            href="https://wa.me/573000000000?text=Hola!%20Quiero%20cotizar%20empanadas%20D'Lujo%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Cotizar ahora por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingHowToOrder;
