import { motion } from 'framer-motion';
import { FaStar, FaArrowRight, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 8 — Lo que construimos para ti (cierre, fondo oscuro).
 *
 * Ilustraciones decorativas esperadas en /public/nosotros/:
 *
 *   ilustracion-fabrica.svg → línea dorada: planta Giomatic con el operario
 *                             en la línea de producción y arco punteado.
 *   ilustracion-entrega.svg → línea dorada: empaque, caja, monitor con
 *                             carrito, móvil y camión de reparto.
 *
 * Al ser decoración, si los archivos no existen simplemente no se muestran.
 */
const LOGROS = [
  {
    num: '1',
    titulo: 'Conocemos el negocio desde ambos lados',
    desc: 'Entendemos lo que implica fabricar, vender, mantener disponibilidad y responder ante el cliente final.',
  },
  {
    num: '2',
    titulo: 'Desarrollamos soluciones alrededor del producto',
    desc: 'La maquinaria Giomatic nació para aumentar capacidad, organizar la producción y mantener una presentación más consistente.',
  },
  {
    num: '3',
    titulo: 'Cuidamos cómo llega cada referencia',
    desc: 'Entregamos productos sellados, identificados y acompañados de información para su conservación y preparación.',
  },
  {
    num: '4',
    titulo: 'Estamos preparados para acompañar distintas necesidades',
    desc: 'Puedes comenzar con una compra accesible, comprar por volumen o construir una relación comercial recurrente.',
  },
];

function NosotrosCierre({ onNavigate }) {
  return (
    <section
      id="nos-cierre"
      className="nos-cierre nos-dark"
      aria-labelledby="nos-cierre-titulo"
    >
      <div className="nos-cierre__inner">
        <div className="nos-cierre__head">
          <NosotrosFoto
            src="/nosotros/ilustracion-fabrica.svg"
            alt=""
            wrapClassName="nos-cierre__deco"
            ocultarSiFalla
          />

          <motion.div
            className="nos-cierre__intro"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="nos-badge nos-badge--solid">
              <FaStar className="nos-badge__icon" aria-hidden="true" />
              Lo que construimos para ti
            </span>

            <h2 id="nos-cierre-titulo" className="nos-title nos-cierre__title">
              Nuestra historia se refleja en la forma de responder
            </h2>

            <span className="nos-rule nos-cierre__rule" aria-hidden="true" />

            <p className="nos-text">
              Todo lo que hemos aprendido —desde la venta hasta la fabricación—
              se traduce en una forma más organizada de producir, presentar y
              entregar nuestros productos.
            </p>

            <p className="nos-text">
              Queremos que puedas comprobar lo que construimos en el producto,
              la información, la atención y la experiencia de compra.
            </p>
          </motion.div>

          <NosotrosFoto
            src="/nosotros/ilustracion-entrega.svg"
            alt=""
            wrapClassName="nos-cierre__deco"
            ocultarSiFalla
          />
        </div>

        <motion.ol
          className="nos-cierre__grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {LOGROS.map((l) => (
            <li key={l.num} className="nos-logro">
              <div className="nos-logro__head">
                <span className="nos-logro__num" aria-hidden="true">{l.num}</span>
                <h3 className="nos-logro__title">{l.titulo}</h3>
              </div>
              <p className="nos-logro__desc">{l.desc}</p>
            </li>
          ))}
        </motion.ol>

        <motion.div
          className="nos-cierre__final"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="nos-cierre__divider" aria-hidden="true" />

          <blockquote className="nos-cierre__quote">
            <FaQuoteLeft className="nos-cierre__q nos-cierre__q--open" aria-hidden="true" />
            <span className="nos-cierre__q-text">
              No se trata solo de fabricar empanadas.
              <br />
              Se trata de estar mejor preparados para responder a las
              necesidades de nuestros clientes.
            </span>
            <FaQuoteRight className="nos-cierre__q nos-cierre__q--close" aria-hidden="true" />
          </blockquote>

          <div className="nos-cierre__actions">
            <button
              type="button"
              className="nos-btn nos-btn--primary"
              onClick={() => onNavigate('tienda')}
            >
              Ver productos <FaArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="nos-btn nos-btn--outline"
              onClick={() => onNavigate('proceso')}
            >
              Conocer nuestro proceso <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosCierre;
