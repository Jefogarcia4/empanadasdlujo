import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaPlus, FaWhatsapp, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const initialFaqs = [
  {
    q: '¿Cuál es la compra mínima?',
    a: 'La compra mínima es de 2 paquetes. Puedes combinarlos entre distintas referencias.',
  },
  {
    q: '¿Desde cuántos paquetes aplica el precio mayorista?',
    a: 'El precio mayorista aplica desde 10 paquetes combinados en un mismo pedido.',
  },
  {
    q: '¿Dónde realizan entregas?',
    a: 'Realizamos entregas en Medellín y los municipios del Área Metropolitana del Valle de Aburrá, sujetos a cobertura y programación de la ruta.',
  },
  {
    q: '¿Con cuánto tiempo debo realizar el pedido?',
    a: 'Trabajamos con pedidos anticipados para organizar correctamente la fabricación y el despacho.',
  },
  {
    q: '¿Cómo debo conservar los productos?',
    a: 'Los productos deben mantenerse congelados a -18 °C hasta el momento de su preparación.',
  },
  {
    q: '¿Los productos están listos para consumir?',
    a: 'No. Llegan congelados y listos para freír o preparar según tu preferencia.',
  },
];

const moreFaqs = [
  {
    q: '¿Entregan gratis?',
    a: 'El costo de envío depende de la zona y el volumen del pedido. Te lo confirmamos antes de despachar.',
  },
  {
    q: '¿Cómo funcionan los beneficios para clientes recurrentes?',
    a: 'Tu historial de compra puede darte acceso a condiciones especiales según tu recurrencia y perfil comercial.',
  },
  {
    q: '¿Qué formas de pago manejan?',
    a: 'Puedes pagar mediante transferencia o solicitar pago al recibir, sujeto a condiciones del pedido.',
  },
  {
    q: '¿Realizan entregas los domingos?',
    a: 'La disponibilidad de entrega los domingos depende de la ruta y la zona. Confírmalo con tu asesor.',
  },
  {
    q: '¿Puedo recoger mi pedido?',
    a: 'Sí, puedes coordinar la recogida directamente escribiéndonos por WhatsApp.',
  },
  {
    q: '¿Puedo comprar para mi hogar?',
    a: 'Claro. Puedes comprar desde 2 paquetes para consumo personal o familiar, sin necesidad de tener un negocio.',
  },
];

function FaqItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="lp-orderfaq__item">
      <button
        className="lp-orderfaq__question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`orderfaq-panel-${index}`}
      >
        <span>{item.q}</span>
        <span className="lp-orderfaq__icon" aria-hidden="true">
          <FaPlus className={isOpen ? 'lp-orderfaq__icon-plus--open' : ''} />
        </span>
      </button>
      {isOpen && (
        <div className="lp-orderfaq__answer" id={`orderfaq-panel-${index}`}>
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}

function LandingOrderFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const allFaqs = showMore ? [...initialFaqs, ...moreFaqs] : initialFaqs;

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <section className="lp-orderfaq">
      <div className="lp-orderfaq__inner">
        <motion.div
          className="lp-orderfaq__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-orderfaq__badge">
            <FaQuestionCircle /> Preguntas frecuentes
          </span>
          <h2 className="lp-orderfaq__title">
            Resolvemos tus dudas{' '}
            <span className="lp-orderfaq__title-em">
              antes de hacer el pedido
            </span>
          </h2>
          <p className="lp-orderfaq__subtitle">
            Consulta las condiciones principales de compra, entrega y
            conservación de nuestros productos.
          </p>
        </motion.div>

        <div className="lp-orderfaq__list">
          {allFaqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <button
          className="lp-orderfaq__toggle-more"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? (
            <>
              Ocultar preguntas <FaChevronUp />
            </>
          ) : (
            <>
              Ver más preguntas <FaChevronDown />
            </>
          )}
        </button>
        <p className="lp-orderfaq__toggle-note">
          {showMore
            ? 'Puedes cerrar esta sección para volver a ver solo las 6 preguntas iniciales.'
            : 'Al hacer clic se mostrarán 6 preguntas adicionales.'}
        </p>

        <motion.div
          className="lp-orderfaq__cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-orderfaq__cta-title">¿Tienes otra pregunta?</p>
          <p className="lp-orderfaq__cta-sub">Estamos para ayudarte.</p>
          <a
            className="lp-btn lp-orderfaq__cta-btn"
            href="https://wa.me/573000000000?text=Hola!%20Tengo%20una%20pregunta%20sobre%20mi%20pedido"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp /> Hablar con un asesor
          </a>
          <span className="lp-orderfaq__cta-note">
            Atención personalizada por WhatsApp
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingOrderFAQ;
