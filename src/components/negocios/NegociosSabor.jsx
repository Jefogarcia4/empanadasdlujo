import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { IconoChef, IconoOlla, IconoVelocimetro, IconoEmpanada } from './NegociosIconos';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 3 — Sabor y producción.
 *
 * Archivos esperados en /public/negocios/:
 *
 *   sabor-guiso.jpg     → guiso, empanada abierta y los ingredientes en
 *                         tabla de madera. Luz cálida.
 *   giomatic-linea.jpg  → la máquina Giomatic dosificando guiso sobre la masa.
 *   giomatic-det-1.jpg  → laminado / discos de masa.
 *   giomatic-det-2.jpg  → dosificación.
 *   giomatic-det-3.jpg  → troquelado y sellado, unidad ya formada.
 *
 * Las cuatro de la derecha deben verse como una misma línea de producción:
 * conviene dispararlas en la misma sesión y con la misma luz.
 */
const DETALLES_GIOMATIC = [
  { src: '/negocios/giomatic-det-1.jpg', nota: 'Laminado' },
  { src: '/negocios/giomatic-det-2.jpg', nota: 'Dosificación' },
  { src: '/negocios/giomatic-det-3.jpg', nota: 'Troquelado y sellado' },
];

function NegociosSabor() {
  return (
    <section id="neg-sabor" className="neg-sabor" aria-labelledby="neg-sabor-titulo">
      <div className="neg-sabor__inner">
        <motion.header
          className="neg-sabor__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="neg-badge neg-badge--rojo">
            <IconoChef className="neg-badge__icon" />
            Sabor y producción
          </span>

          <h2 id="neg-sabor-titulo" className="neg-title">
            El sabor nace de la receta.
            <br />
            La consistencia, de cómo la repetimos.
          </h2>

          <span className="neg-rule" aria-hidden="true" />

          <p className="neg-text">
            Nuestro guiso D’lujo combina una sazón intensa, equilibrada y
            tradicional, inspirada en sabores que hacen parte de la cultura
            paisa.
          </p>

          <p className="neg-text">
            Ese conocimiento se integra con maquinaria Giomatic para formar
            empanadas y pasteles con mayor organización, regularidad y capacidad
            productiva.
          </p>
        </motion.header>

        <motion.div
          className="neg-sabor__paneles"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Panel · Sabor */}
          <article className="neg-panel">
            <h3 className="neg-panel__head">Sabor D’lujo</h3>

            <div className="neg-panel__media">
              <NegociosFoto
                src="/negocios/sabor-guiso.jpg"
                alt="Guiso D’lujo y empanada abierta junto a papa y cebolla de rama"
                wrapClassName="neg-panel__img"
                nota="Guiso e ingredientes"
              />
              <p className="neg-panel__firma">
                El guiso D’lujo
                <br />
                se siente.
              </p>
            </div>

            <div className="neg-panel__cuerpo">
              <div className="neg-punto">
                <span className="neg-punto__icon" aria-hidden="true">
                  <IconoOlla />
                </span>
                <h4 className="neg-punto__title">Un guiso que le da identidad al producto</h4>
              </div>

              <p className="neg-punto__desc">
                El guiso es uno de los atributos que más destacan nuestros
                clientes. Se prepara dentro de la fábrica a partir de la papa,
                la cebolla de rama y los demás ingredientes de nuestra receta.
              </p>

              <p className="neg-nota">
                <span className="neg-nota__icon" aria-hidden="true">
                  <FaStar />
                </span>
                <span>
                  Actualmente, la empanada coctelera de papa y guiso es la
                  referencia que más se repite dentro de nuestros pedidos.
                </span>
              </p>
            </div>
          </article>

          {/* Conector entre los dos panes (solo escritorio) */}
          <span className="neg-sabor__conector" aria-hidden="true">
            <IconoEmpanada />
          </span>

          {/* Panel · Producción */}
          <article className="neg-panel">
            <h3 className="neg-panel__head">Producción con Giomatic</h3>

            <div className="neg-panel__media neg-panel__media--grid">
              <NegociosFoto
                src="/negocios/giomatic-linea.jpg"
                alt="Máquina Giomatic dosificando guiso sobre los discos de masa"
                wrapClassName="neg-panel__img neg-panel__img--principal"
                nota="Línea Giomatic"
              />
              <div className="neg-panel__tiras">
                {DETALLES_GIOMATIC.map((d) => (
                  <NegociosFoto
                    key={d.src}
                    src={d.src}
                    alt=""
                    wrapClassName="neg-panel__tira"
                    nota={d.nota}
                    compacto
                  />
                ))}
              </div>
            </div>

            <div className="neg-panel__cuerpo neg-panel__cuerpo--dos">
              <div>
                <div className="neg-punto">
                  <span className="neg-punto__icon" aria-hidden="true">
                    <FiSettings />
                  </span>
                  <h4 className="neg-punto__title">
                    Maquinaria desarrollada alrededor del producto
                  </h4>
                </div>

                <p className="neg-punto__desc neg-punto__desc--fuerte">
                  Giomatic realiza etapas de laminado, dosificación, troquelado
                  y sellado para entregar empanadas y pasteles ya formados.
                </p>

                <p className="neg-punto__desc neg-punto__desc--separado">
                  Su aplicación nos ayuda a organizar la producción, mantener
                  una forma más regular y prepararnos para atender pedidos de
                  mayor volumen.
                </p>
              </div>

              <div className="neg-capacidad">
                <span className="neg-capacidad__icon" aria-hidden="true">
                  <IconoVelocimetro />
                </span>
                <p className="neg-capacidad__texto">
                  <span className="neg-capacidad__pre">Hasta</span>
                  <strong className="neg-capacidad__cifra">5.000</strong>
                  <span className="neg-capacidad__unidad">unidades</span>
                  <span className="neg-capacidad__sub">
                    en una jornada organizada de producción.
                  </span>
                </p>
              </div>
            </div>

            <p className="neg-legal">
              Capacidad operativa de referencia. Puede variar según la
              referencia, la programación, el equipo utilizado y las condiciones
              de producción.
            </p>
          </article>
        </motion.div>

        <motion.p
          className="neg-sabor__cierre"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <FaQuoteLeft className="neg-sabor__q neg-sabor__q--open" aria-hidden="true" />
          <span>
            La maquinaria no reemplaza la receta ni el conocimiento.
            <br />
            <em className="neg-sabor__cierre-em">
              Ayuda a llevarlos a una producción más organizada.
            </em>
          </span>
          <FaQuoteRight className="neg-sabor__q neg-sabor__q--close" aria-hidden="true" />
        </motion.p>
      </div>
    </section>
  );
}

export default NegociosSabor;
