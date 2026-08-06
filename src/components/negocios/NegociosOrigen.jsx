import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { FaSeedling } from 'react-icons/fa';
import { IconoFabrica } from './NegociosIconos';
import NegociosSellos from './NegociosSellos';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 2 — Desde el origen.
 *
 * Archivos esperados en /public/negocios/:
 *
 *   origen-producto.jpg → empaque D'lujo con empanadas abiertas, cebolla de
 *                         rama y cebolla cabezona, con la planta de fondo.
 *
 *   origen/*.jpg → doce miniaturas del proceso, cuatro por ingrediente,
 *                  en el mismo orden en que aparecen abajo. Encuadre cuadrado
 *                  y misma distancia de cámara en las cuatro de cada fila,
 *                  para que la secuencia se lea como una progresión.
 */
const INGREDIENTES = [
  {
    num: '1',
    titulo: 'Maíz valluno',
    desc: 'Llega trillado a nuestra fábrica y pasa por cocción, lavado, molienda y amasado para convertirse en la base de nuestra masa.',
    pasos: [
      { label: 'Trillado', src: '/negocios/origen/maiz-1-trillado.jpg' },
      { label: 'Cocción', src: '/negocios/origen/maiz-2-coccion.jpg' },
      { label: 'Molienda', src: '/negocios/origen/maiz-3-molienda.jpg' },
      { label: 'Masa', src: '/negocios/origen/maiz-4-masa.jpg' },
    ],
  },
  {
    num: '2',
    titulo: 'Papa de La Unión, Antioquia',
    desc: 'La recibimos directamente de un productor, la seleccionamos, pelamos, lavamos, desinfectamos, cocinamos y picamos dentro de la fábrica.',
    pasos: [
      { label: 'Recepción', src: '/negocios/origen/papa-1-recepcion.jpg' },
      { label: 'Lavado y selección', src: '/negocios/origen/papa-2-lavado.jpg' },
      { label: 'Cocción', src: '/negocios/origen/papa-3-coccion.jpg' },
      { label: 'Picado', src: '/negocios/origen/papa-4-picado.jpg' },
    ],
  },
  {
    num: '3',
    titulo: 'Cebolla de rama',
    desc: 'Se selecciona, lava, desinfecta y pica antes de integrarse con la papa y los demás ingredientes que conforman el guiso D’lujo.',
    pasos: [
      { label: 'Selección', src: '/negocios/origen/cebolla-1-seleccion.jpg' },
      { label: 'Lavado y desinfección', src: '/negocios/origen/cebolla-2-lavado.jpg' },
      { label: 'Picado', src: '/negocios/origen/cebolla-3-picado.jpg' },
      { label: 'Integración al guiso', src: '/negocios/origen/cebolla-4-guiso.jpg' },
    ],
  },
];

function NegociosOrigen() {
  return (
    <section id="neg-origen" className="neg-origen" aria-labelledby="neg-origen-titulo">
      <div className="neg-origen__inner">
        <div className="neg-origen__top">
          <motion.div
            className="neg-origen__copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <span className="neg-badge">
              <FaSeedling className="neg-badge__icon" aria-hidden="true" />
              Desde el origen
            </span>

            <h2 id="neg-origen-titulo" className="neg-title">
              El producto comienza mucho antes de tomar forma
            </h2>

            <span className="neg-rule" aria-hidden="true" />

            <p className="neg-text">
              Trabajamos dentro de nuestra fábrica los ingredientes principales
              que dan identidad a nuestras empanadas: maíz valluno, papa
              proveniente de La Unión, Antioquia, y cebolla de rama del campo
              colombiano.
            </p>

            <p className="neg-text">
              Dentro de la fábrica transformamos estos ingredientes para
              preparar la masa, la papa y el guiso D’lujo antes del formado.
            </p>
          </motion.div>

          <motion.div
            className="neg-origen__media"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NegociosFoto
              src="/negocios/origen-producto.jpg"
              alt="Empaque de empanadas cocteleras D’lujo junto a sus ingredientes"
              wrapClassName="neg-origen__img"
              nota="Producto e ingredientes"
            />
            <NegociosSellos />
          </motion.div>
        </div>

        <motion.ol
          className="neg-origen__panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          {INGREDIENTES.map((ing) => (
            <li key={ing.num} className="neg-ingrediente">
              <div className="neg-ingrediente__head">
                <span className="neg-ingrediente__num" aria-hidden="true">{ing.num}</span>
                <h3 className="neg-ingrediente__title">{ing.titulo}</h3>
              </div>

              <p className="neg-ingrediente__desc">{ing.desc}</p>

              <div className="neg-pasos">
                {ing.pasos.map((paso, i) => (
                  <Fragment key={paso.label}>
                    <figure className={`neg-paso${i > 0 ? ' neg-paso--con-flecha' : ''}`}>
                      <div className="neg-paso__foto">
                        <NegociosFoto
                          src={paso.src}
                          alt=""
                          wrapClassName="neg-paso__img"
                          compacto
                        />
                      </div>
                      <figcaption className="neg-paso__label">{paso.label}</figcaption>
                    </figure>
                  </Fragment>
                ))}
              </div>
            </li>
          ))}
        </motion.ol>

        <motion.p
          className="neg-origen__cierre"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-origen__cierre-icon" aria-hidden="true">
            <IconoFabrica />
          </span>
          <span>
            No recibimos una empanada terminada para empacarla.
            <br />
            Construimos el producto desde sus ingredientes principales.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

export default NegociosOrigen;
