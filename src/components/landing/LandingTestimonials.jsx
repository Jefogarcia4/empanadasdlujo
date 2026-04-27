import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Andrés M.',
    role: 'Dueño de punto de fritos · Medellín',
    stars: 5,
    text: '"Llevaba años con el mismo proveedor informal y siempre algo fallaba: un lote diferente, tarde la entrega, la empanada absorbía demasiado aceite. Con D\'Lujo llevo meses y el producto siempre sale igual. Eso vale más que cualquier precio."',
  },
  {
    name: 'Carolina R.',
    role: 'Administradora de cafetería · Bello',
    stars: 5,
    text: '"Mi mayor miedo era que el proveedor me fallara en temporada alta. Desde que trabajo con Empanadas D\'Lujo, no he tenido ni un incumplimiento. El producto es consistente y mis clientes lo notan. Mi negocio se ve profesional."',
  },
  {
    name: 'Juan P.',
    role: 'Distribuidor de congelados · Itagüí',
    stars: 5,
    text: '"Empecé con 5 paquetes de prueba y hoy despacho más de 40 semanales. La diferencia frente a mis anteriores proveedores es el proceso. Aquí se nota que hay fábrica de verdad, no improvisación. Mis clientes recompran."',
  },
  {
    name: 'Marcela V.',
    role: 'Emprendedora gastronómica · Envigado',
    stars: 5,
    text: '"Yo fabricaba mis empanadas en casa y me desgastaba demasiado. Cuando empecé a comprarle a D\'Lujo entendí que el margen no estaba en fabricar, sino en vender. Ahora tengo tiempo para crecer y el producto sale mejor que el mío."',
  },
];

function LandingTestimonials() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="lp-testimonials">
      <div className="lp-container">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag">Testimonios</p>
          <h2 className="lp-section-title">
            Ellos ya <span className="lp-highlight">lo prueban</span> a diario
          </h2>
        </motion.div>

        <div className="lp-testimonials__carousel">
          <button className="lp-testimonials__arrow lp-testimonials__arrow--left" onClick={prev} aria-label="Anterior">
            <FaChevronLeft />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="lp-testimonials__card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="lp-testimonials__stars">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="lp-testimonials__text">{t.text}</p>
              <div className="lp-testimonials__author">
                <div className="lp-testimonials__avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="lp-testimonials__name">{t.name}</div>
                  <div className="lp-testimonials__role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="lp-testimonials__arrow lp-testimonials__arrow--right" onClick={next} aria-label="Siguiente">
            <FaChevronRight />
          </button>
        </div>

        <div className="lp-testimonials__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`lp-testimonials__dot${i === current ? ' lp-testimonials__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingTestimonials;
