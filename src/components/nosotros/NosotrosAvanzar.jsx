import { motion } from 'framer-motion';
import { FaFlag, FaChevronRight, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 7 — Nuestra forma de avanzar.
 *
 * Archivo esperado en /public/nosotros/:
 *
 *   ilustracion-avanzamos.svg → escena de línea en dorado sobre fondo
 *       transparente: fábrica, operario en la línea, portátil con el sitio,
 *       móvil con el carrito, camión de reparto, árbol, grupo de personas y
 *       el arco punteado con los cuatro íconos (engranaje, cajas, gráfica),
 *       con el empaque D'lujo a color en el centro.
 *       Preferible SVG: la ilustración es línea fina y se sirve a cualquier
 *       tamaño sin pesar ni pixelarse. Si sale de un PNG, exportar a 2x con
 *       fondo transparente.
 */
const PRINCIPIOS = [
  {
    num: '1',
    titulo: 'Fabricar con criterio',
    desc: 'Tomamos decisiones desde la experiencia, el conocimiento del producto y las necesidades reales de la operación.',
  },
  {
    num: '2',
    titulo: 'Crecer con orden',
    desc: 'Fortalecemos nuestra capacidad procurando conservar consistencia, control y una forma organizada de trabajar.',
  },
  {
    num: '3',
    titulo: 'Comunicar con claridad',
    desc: 'Presentamos productos, precios, condiciones e información para que cada cliente pueda decidir con mayor confianza.',
  },
  {
    num: '4',
    titulo: 'Construir relaciones duraderas',
    desc: 'Queremos acompañar a hogares y negocios desde una primera compra hasta una relación comercial recurrente.',
  },
];

function NosotrosAvanzar() {
  return (
    <section id="nos-avanzar" className="nos-avanzar" aria-labelledby="nos-avanzar-titulo">
      <div className="nos-avanzar__inner">
        <motion.div
          className="nos-avanzar__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <span className="nos-badge">
            <FaFlag className="nos-badge__icon" aria-hidden="true" />
            Nuestra forma de avanzar
          </span>

          <h2 id="nos-avanzar-titulo" className="nos-title">
            Crecer no es solo producir más. Es construir mejor.
          </h2>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-text">
            Cada decisión que tomamos busca conectar lo que ocurre en la fábrica
            con lo que necesita quien compra. Por eso trabajamos para fortalecer
            nuestra operación sin perder claridad, cuidado ni conocimiento del
            producto.
          </p>

          <ol className="nos-avanzar__lista">
            {PRINCIPIOS.map((p) => (
              <li key={p.num} className="nos-principio">
                <div className="nos-principio__head">
                  <span className="nos-principio__num" aria-hidden="true">{p.num}</span>
                  <h3 className="nos-principio__title">{p.titulo}</h3>
                </div>
                <p className="nos-principio__desc">{p.desc}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          className="nos-rumbo"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="nos-rumbo__title">
            <FaChevronRight className="nos-rumbo__chevron" aria-hidden="true" />
            Hacia dónde avanzamos
          </h3>

          <span className="nos-rumbo__rule" aria-hidden="true" />

          <p className="nos-rumbo__text">
            Buscamos consolidar a Empanadas D’lujo como una referencia regional
            en fabricación especializada de empanadas y pasteles congelados.
          </p>

          <p className="nos-rumbo__text">
            Nuestro camino es seguir fortaleciendo la capacidad productiva, la
            experiencia digital, el portafolio y las condiciones necesarias para
            atender clientes de diferentes tamaños con mayor continuidad.
          </p>

          <NosotrosFoto
            src="/nosotros/ilustracion-avanzamos.svg"
            alt="Ilustración del recorrido: fábrica, línea de producción, tienda digital, reparto y clientes"
            wrapClassName="nos-rumbo__ilustracion"
            nota="Ilustración del recorrido de la marca"
          />

          <blockquote className="nos-rumbo__quote">
            <FaQuoteLeft className="nos-rumbo__q nos-rumbo__q--open" aria-hidden="true" />
            <span className="nos-rumbo__q-text">
              La meta no es crecer más rápido.
              <br />
              Es estar mejor preparados para responder.
            </span>
            <FaQuoteRight className="nos-rumbo__q nos-rumbo__q--close" aria-hidden="true" />
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosAvanzar;
