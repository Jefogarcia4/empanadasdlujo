import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    q: '¿Cuál es el pedido mínimo para negocios?',
    a: 'Puedes empezar desde 1 paquete de prueba. No exigimos volúmenes grandes al inicio. La idea es que midas, compares y decidas con números reales en mano.',
  },
  {
    q: '¿Hacen entregas en todo el Valle de Aburrá?',
    a: 'Sí. Atendemos negocios en Medellín y todo el Valle de Aburrá. Para municipios aledaños, coordíenanos con anticipación. Escribenos por WhatsApp y te confirmamos zona y tiempo de entrega.',
  },
  {
    q: '¿Cómo garantizan calidad constante en cada lote?',
    a: 'Tenemos proceso industrial estandarizado con maquinaria propia. Cada lote pasa por control de peso, sellado de masa y pre-fritura controlada. La consistencia no depende de la persona del día: depende del proceso.',
  },
  {
    q: '¿Puedo probar antes de comprometer volumen?',
    a: 'Por supuesto. De hecho lo recomendamos. Empieza con un pedido pequeño, ponlo en tu negocio y mide rotación, merma y satisfacción del cliente. Los números te van a convencer.',
  },
  {
    q: '¿Qué diferencia sus empanadas de otros proveedores?',
    a: 'Tres cosas: proceso, consistencia y trazabilidad. Nuestra maquinaria fue diseñada internamente. Nuestros productos salen sin conservantes ni grasas saturadas reutilizadas. Y cada lote es idéntico al anterior. Eso es lo que hace la diferencia en el tiempo.',
  },
  {
    q: '¿Cuánto tarda en llegar un pedido desde que se hace?',
    a: 'Dependiendo del volumen y la referencia, los pedidos se procesan y despachan en 24 a 48 horas. Para pedidos recurrentes o de gran volumen, coordinamos días fijos de entrega que se adapten a tu operación.',
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`lp-faq__item${isOpen ? ' lp-faq__item--open' : ''}`}>
      <button className="lp-faq__question" onClick={onToggle}>
        <span>{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="lp-faq__chevron"
        >
          <FaChevronDown />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="lp-faq__answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="lp-faq">
      <div className="lp-container lp-faq__inner">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag">Preguntas frecuentes</p>
          <h2 className="lp-section-title">
            ¿Tienes alguna <span className="lp-highlight">duda?</span>
          </h2>
          <p className="lp-section-sub">
            Respuestas a lo que más nos preguntan nuestros clientes.
          </p>
        </motion.div>

        <motion.div
          className="lp-faq__list"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default LandingFAQ;
