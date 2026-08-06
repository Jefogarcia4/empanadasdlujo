import { motion } from 'framer-motion';
import { FaFlag, FaBarcode, FaFileAlt, FaSnowflake, FaBox } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 5 — Presentación e información.
 *
 * Archivos esperados en /public/nosotros/:
 *
 *   empaque-bolsa.jpg     → packshot de la bolsa sellada sobre fondo claro,
 *                           con la etiqueta frontal legible.
 *   etiqueta-detalle.png  → arte final de la etiqueta, exportado del archivo
 *                           de impresión. Se muestra como imagen y no como
 *                           maquetación HTML: la tabla nutricional, el
 *                           registro INVIMA y los sellos son información
 *                           regulada y deben coincidir exactamente con lo
 *                           impreso. Exportar a 2x para que se lea al ampliar.
 */
const DETALLES = [
  {
    icon: <FaBarcode />,
    titulo: 'Identificación por lote y fecha',
    desc: 'Cada paquete incluye lote y fecha para facilitar su identificación y control.',
  },
  {
    icon: <FaFileAlt />,
    titulo: 'Información clara del producto',
    desc: 'Incluye nombre, gramaje, unidades, ingredientes e información nutricional correspondiente.',
  },
  {
    icon: <FaSnowflake />,
    titulo: 'Preparación y conservación',
    desc: 'El cliente encuentra instrucciones para freír o preparar el producto y mantenerlo congelado a −18 °C.',
  },
  {
    icon: <FaBox />,
    titulo: 'Presentación profesional',
    desc: 'El sellado, el rotulado y la organización del empaque facilitan su almacenamiento, manipulación y entrega.',
  },
];

function NosotrosPresentacion() {
  return (
    <section
      id="nos-presentacion"
      className="nos-presentacion"
      aria-labelledby="nos-presentacion-titulo"
    >
      <div className="nos-presentacion__inner">
        <motion.div
          className="nos-presentacion__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <span className="nos-badge">
            <FaFlag className="nos-badge__icon" aria-hidden="true" />
            Presentación e información
          </span>

          <h2 id="nos-presentacion-titulo" className="nos-title">
            El cuidado del producto continúa después de fabricarlo
          </h2>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-text">
            Cada referencia se entrega en una bolsa gruesa, sellada térmicamente
            e identificada con la información necesaria para su conservación,
            preparación y manejo.
          </p>

          <p className="nos-text">
            El empaque no es solo una forma de contener el producto. Es parte de
            la experiencia y del orden con el que queremos que llegue a cada
            cliente.
          </p>

          {/* Solo móvil: el empaque se intercala antes del listado */}
          <div className="nos-presentacion__media-movil">
            <NosotrosFoto
              src="/nosotros/empaque-bolsa.jpg"
              alt=""
              wrapClassName="nos-presentacion__bolsa"
              nota="Bolsa sellada de 50 unidades"
            />
            <span className="nos-presentacion__conector" aria-hidden="true" />
            <div className="nos-presentacion__etiqueta">
              <NosotrosFoto
                src="/nosotros/etiqueta-detalle.png"
                alt=""
                wrapClassName="nos-presentacion__etiqueta-img"
                nota="Arte de la etiqueta"
              />
            </div>
          </div>

          <ul className="nos-presentacion__lista">
            {DETALLES.map(({ icon, titulo, desc }) => (
              <li key={titulo} className="nos-pack">
                <span className="nos-pack__icon" aria-hidden="true">
                  {icon}
                </span>
                <div className="nos-pack__body">
                  <h3 className="nos-pack__title">{titulo}</h3>
                  <p className="nos-pack__desc">{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <blockquote className="nos-quote">
            Fabricar con criterio también significa cuidar cómo se identifica y
            llega cada producto.
          </blockquote>
        </motion.div>

        <motion.div
          className="nos-presentacion__media"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <NosotrosFoto
            src="/nosotros/empaque-bolsa.jpg"
            alt="Bolsa sellada de empanadas cocteleras D’lujo con su etiqueta frontal"
            wrapClassName="nos-presentacion__bolsa"
            nota="Bolsa sellada de 50 unidades"
          />

          <span className="nos-presentacion__conector" aria-hidden="true" />

          <figure className="nos-presentacion__etiqueta">
            <NosotrosFoto
              src="/nosotros/etiqueta-detalle.png"
              alt="Detalle de la etiqueta: peso, unidades, tabla nutricional, ingredientes, modo de preparación y datos de contacto"
              wrapClassName="nos-presentacion__etiqueta-img"
              nota="Arte de la etiqueta"
            />
          </figure>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosPresentacion;
