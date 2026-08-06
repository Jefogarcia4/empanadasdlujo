import { motion } from 'framer-motion';
import { FaCog, FaBoxes, FaRegClock, FaLeaf, FaCamera } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 4 — Nuestra solución productiva (fondo oscuro).
 *
 * Fotografía pendiente. Archivos esperados en /public/nosotros/:
 *
 *   giomatic-operacion.jpg → operario al mando de la máquina Giomatic, con la
 *                            marca visible en la pared y bandejas de producto.
 *   giomatic-linea.jpg     → detalle de la línea: unidades saliendo formadas.
 */

// Icono propio: la silueta de una empanada, para "forma más consistente".
const IconoForma = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 17.5c0-5 4-9 9-9s9 4 9 9" />
    <path d="M3 17.5h18" />
    <path d="M7 17.5c0-3 2.2-5.4 5-5.4s5 2.4 5 5.4" />
  </svg>
);

const BENEFICIOS = [
  {
    icon: <FaRegClock />,
    titulo: 'Preparación para pedidos de volumen',
    desc: 'La capacidad de la línea nos permite organizar pedidos mayores y responder con mayor continuidad.',
  },
  {
    icon: <IconoForma />,
    titulo: 'Forma más consistente',
    desc: 'La maquinaria ayuda a mantener dimensiones y presentación más uniformes entre unidades, facilitando una producción organizada.',
  },
  {
    icon: <FaLeaf />,
    titulo: 'Sin bolsas plásticas durante el formado',
    desc: 'El sistema evita el uso de bolsas plásticas que anteriormente eran necesarias durante esta etapa del proceso.',
  },
];

function NosotrosSolucion() {
  return (
    <section
      id="nos-solucion"
      className="nos-solucion nos-dark"
      aria-labelledby="nos-solucion-titulo"
    >
      <div className="nos-solucion__inner">
        <motion.div
          className="nos-solucion__media"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <NosotrosFoto
            src="/nosotros/giomatic-operacion.jpg"
            alt="Operario de Empanadas D’lujo trabajando con la máquina Giomatic"
            wrapClassName="nos-solucion__hero-img"
            nota="Operación de la máquina Giomatic"
          />

          <div className="nos-solucion__ref">
            <NosotrosFoto
              src="/nosotros/giomatic-linea.jpg"
              alt=""
              wrapClassName="nos-solucion__ref-img"
              nota="Detalle de la línea de formado"
            />
            <p className="nos-solucion__ref-note">
              <span className="nos-solucion__ref-icon" aria-hidden="true">
                <FaCamera />
              </span>
              <span>
                Fotografías de referencia para futuras tomas reales o
                recreaciones.
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="nos-solucion__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="nos-badge">
            <FaCog className="nos-badge__icon" aria-hidden="true" />
            Nuestra solución productiva
          </span>

          <h2 id="nos-solucion-titulo" className="nos-title">
            La experiencia terminó convertida en maquinaria
          </h2>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-text">
            Después de años fabricando y comprendiendo las limitaciones del
            proceso manual, Giovany desarrolló Giomatic, una marca de maquinaria
            especializada en las necesidades reales de producir empanadas.
          </p>

          <p className="nos-text">
            Su aplicación en Empanadas D’lujo nos permite aumentar la capacidad,
            mantener una forma más consistente y organizar mejor la producción
            sin depender completamente del formado manual.
          </p>

          {/* Solo móvil: la foto principal acompaña al texto */}
          <div className="nos-solucion__foto-movil">
            <NosotrosFoto
              src="/nosotros/giomatic-operacion.jpg"
              alt=""
              wrapClassName="nos-solucion__hero-img"
              nota="Operación de la máquina Giomatic"
            />
          </div>

          <div className="nos-capacidad">
            <span className="nos-capacidad__icon" aria-hidden="true">
              <FaBoxes />
            </span>
            <div className="nos-capacidad__body">
              <p className="nos-capacidad__title">
                Hasta 6.500 empanadas cocteleras por jornada de producción
              </p>
              <p className="nos-capacidad__sub">
                Equivalentes a 130 paquetes de 50 unidades en la línea coctelera
                de 30 g.
              </p>
              <p className="nos-capacidad__nota">
                Capacidad operativa de referencia, sujeta a programación y
                condiciones de producción.
              </p>
            </div>
          </div>

          <ul className="nos-solucion__lista">
            {BENEFICIOS.map(({ icon, titulo, desc }) => (
              <li key={titulo} className="nos-benef">
                <div className="nos-benef__head">
                  <span className="nos-benef__icon" aria-hidden="true">
                    {icon}
                  </span>
                  <h3 className="nos-benef__title">{titulo}</h3>
                </div>
                <p className="nos-benef__desc">{desc}</p>
              </li>
            ))}
          </ul>

          <blockquote className="nos-quote">
            No desarrollamos maquinaria para alejarnos del oficio, sino para
            convertir el conocimiento del oficio en capacidad y consistencia.
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosSolucion;
