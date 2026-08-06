import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaStar, FaArrowRight, FaInfo, FaDollarSign, FaPercent } from 'react-icons/fa';
import { FiShoppingCart, FiBox, FiShoppingBag, FiUser, FiTag } from 'react-icons/fi';
import {
  IconoChef,
  IconoLlama,
  IconoAceite,
  IconoMerma,
  IconoSalsa,
  IconoCopa,
  IconoServilleta,
  IconoGota,
  IconoEmpanada,
} from './NegociosIconos';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 5 — Tirando calculadora.
 *
 * Archivo esperado en /public/negocios/:
 *   ejemplo-coctelera.jpg → coctelera de papa y guiso abierta, en tabla de
 *                           madera y con salsas al lado. Encuadre vertical.
 *
 * Las cifras del ejemplo viven en PRECIOS: si cambia la lista, se actualiza
 * ahí y el bloque entero queda coherente.
 */
const PRECIOS = {
  referencia: 'Empanada coctelera de papa y guiso',
  formato: '30 g por unidad · 50 unidades por paquete',
  unidades: 50,
  regular: { paquete: '$19.500', unidad: '$390' },
  mayorista: { paquete: '$15.500', unidad: '$310' },
};

const COSTOS = [
  { icon: <IconoAceite />, titulo: 'Aceite', dep: 'Depende de tu operación' },
  { icon: <IconoLlama />, titulo: 'Gas o energía', dep: 'Depende de tu operación' },
  { icon: <IconoMerma />, titulo: 'Merma', dep: 'Depende del manejo y la fritura' },
  { icon: <IconoSalsa />, titulo: 'Salsa o ají', dep: 'Depende de la porción' },
  { icon: <IconoCopa />, titulo: 'Copa para salsa', dep: 'Depende de la presentación' },
  { icon: <IconoServilleta />, titulo: 'Servilleta', dep: 'Depende de la presentación' },
  { icon: <FiShoppingBag />, titulo: 'Bolsa, caja o empaque', dep: 'Depende de la presentación' },
  { icon: <FiUser />, titulo: 'Mano de obra de preparación', dep: 'Depende de tu operación' },
];

const FORMULA = [
  { icon: <IconoEmpanada />, titulo: 'Producto', sub: '(unidad congelada)' },
  { icon: <IconoChef />, titulo: 'Preparación', sub: '(operación)' },
  { icon: <IconoGota />, titulo: 'Merma', sub: '(durante fritura)' },
  { icon: <IconoSalsa />, titulo: 'Acompañamientos', sub: '(salsas, ají, etc.)' },
  { icon: <FiBox />, titulo: 'Empaque', sub: '(presentación)' },
];

const COMPARACION = [
  { icon: <FiTag />, titulo: 'Precio de venta', desc: 'Lo que pagará tu cliente.' },
  {
    icon: <FaDollarSign />,
    titulo: 'Margen de contribución estimado',
    desc: 'Precio de venta menos costo servido.',
  },
  {
    icon: <FaPercent />,
    titulo: 'Margen porcentual',
    desc: 'Margen de contribución dividido por el precio de venta.',
  },
];

function NegociosCalculadora() {
  const irAGuia = () => {
    const destino = document.getElementById('neg-guia');
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section id="neg-calculadora" className="neg-calc" aria-labelledby="neg-calc-titulo">
      <div className="neg-calc__inner">
        <div className="neg-calc__grid">
          {/* Columna izquierda: presentación y ejemplo base */}
          <motion.div
            className="neg-calc__copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="neg-badge neg-badge--rojo">
              <FaCalculator className="neg-badge__icon" aria-hidden="true" />
              Tirando calculadora
            </span>

            <h2 id="neg-calc-titulo" className="neg-title">
              El precio del paquete es solo una parte de la cuenta
            </h2>

            <span className="neg-rule" aria-hidden="true" />

            <p className="neg-text">
              Antes de definir cuánto cobrar, suma lo que cuesta el producto y
              todo lo que necesitas para prepararlo, servirlo y entregarlo.
            </p>

            <p className="neg-text">
              Utilicemos nuestra coctelera de papa y guiso como ejemplo para
              entender qué debería revisar un negocio.
            </p>

            <article className="neg-ejemplo">
              <div className="neg-ejemplo__media">
                <span className="neg-ejemplo__tag">Ejemplo base</span>
                <NegociosFoto
                  src="/negocios/ejemplo-coctelera.jpg"
                  alt="Empanada coctelera de papa y guiso abierta"
                  wrapClassName="neg-ejemplo__img"
                  nota="Coctelera de papa y guiso"
                />
              </div>

              <div className="neg-ejemplo__datos">
                <h3 className="neg-ejemplo__title">{PRECIOS.referencia}</h3>
                <p className="neg-ejemplo__formato">{PRECIOS.formato}</p>

                <div className="neg-tarifa">
                  <p className="neg-tarifa__head">
                    <FiShoppingCart aria-hidden="true" />
                    Compra regular
                  </p>
                  <div className="neg-tarifa__fila">
                    <span className="neg-tarifa__campo">
                      <span className="neg-tarifa__label">Precio por paquete</span>
                      <strong className="neg-tarifa__valor">{PRECIOS.regular.paquete}</strong>
                    </span>
                    <span className="neg-tarifa__div">÷ {PRECIOS.unidades}</span>
                    <span className="neg-tarifa__campo">
                      <span className="neg-tarifa__label">Costo base por unidad</span>
                      <strong className="neg-tarifa__valor">{PRECIOS.regular.unidad}</strong>
                    </span>
                  </div>
                </div>

                <div className="neg-tarifa">
                  <p className="neg-tarifa__head">
                    <FiBox aria-hidden="true" />
                    Compra mayorista
                  </p>
                  <div className="neg-tarifa__fila">
                    <span className="neg-tarifa__campo">
                      <span className="neg-tarifa__label">desde 10 paquetes combinados</span>
                      <strong className="neg-tarifa__valor">{PRECIOS.mayorista.paquete}</strong>
                    </span>
                    <span className="neg-tarifa__div">÷ {PRECIOS.unidades}</span>
                    <span className="neg-tarifa__campo">
                      <span className="neg-tarifa__label">Costo base por unidad</span>
                      <strong className="neg-tarifa__valor">{PRECIOS.mayorista.unidad}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <p className="neg-ejemplo__nota">
                <span className="neg-ejemplo__nota-icon" aria-hidden="true">
                  <FaInfo />
                </span>
                <span>
                  Estos valores corresponden únicamente al producto congelado.
                  No incluyen preparación, acompañamientos ni presentación.
                </span>
              </p>
            </article>
          </motion.div>

          {/* Columna derecha: los cuatro pasos */}
          <motion.ol
            className="neg-calc__pasos"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <li className="neg-paso-calc">
              <div className="neg-paso-calc__head">
                <span className="neg-paso-calc__num" aria-hidden="true">1</span>
                <h3 className="neg-paso-calc__title">Empieza por el producto</h3>
              </div>

              <div className="neg-paso-calc__intro">
                <span className="neg-paso-calc__icon" aria-hidden="true">
                  <FaCalculator />
                </span>
                <div>
                  <p className="neg-paso-calc__lead">
                    Precio del paquete ÷ unidades por paquete = costo base por unidad
                  </p>
                  <p className="neg-paso-calc__desc">
                    Este valor indica cuánto cuesta cada unidad congelada antes
                    de prepararla y servirla.
                  </p>
                </div>
              </div>

              <div className="neg-cuentas">
                <div className="neg-cuenta">
                  <span className="neg-cuenta__label">Compra regular</span>
                  <p className="neg-cuenta__op">
                    {PRECIOS.regular.paquete} ÷ {PRECIOS.unidades} ={' '}
                    <strong>{PRECIOS.regular.unidad}</strong>
                  </p>
                  <span className="neg-cuenta__pie">por unidad</span>
                </div>
                <div className="neg-cuenta">
                  <span className="neg-cuenta__label">Compra mayorista</span>
                  <p className="neg-cuenta__op">
                    {PRECIOS.mayorista.paquete} ÷ {PRECIOS.unidades} ={' '}
                    <strong>{PRECIOS.mayorista.unidad}</strong>
                  </p>
                  <span className="neg-cuenta__pie">por unidad</span>
                </div>
              </div>
            </li>

            <li className="neg-paso-calc">
              <div className="neg-paso-calc__head">
                <span className="neg-paso-calc__num" aria-hidden="true">2</span>
                <h3 className="neg-paso-calc__title">Agrega lo que necesita tu operación</h3>
              </div>

              <div className="neg-paso-calc__intro">
                <span className="neg-paso-calc__icon" aria-hidden="true">
                  <IconoChef />
                </span>
                <p className="neg-paso-calc__desc">
                  El costo final cambia según el equipo, el consumo de aceite,
                  la forma de servir y el control que tenga cada negocio.
                </p>
              </div>

              <ul className="neg-costos">
                {COSTOS.map((c) => (
                  <li key={c.titulo} className="neg-costo">
                    <span className="neg-costo__icon" aria-hidden="true">{c.icon}</span>
                    <span className="neg-costo__body">
                      <span className="neg-costo__title">{c.titulo}</span>
                      <span className="neg-costo__dep">{c.dep}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>

            <li className="neg-paso-calc">
              <div className="neg-paso-calc__head">
                <span className="neg-paso-calc__num" aria-hidden="true">3</span>
                <h3 className="neg-paso-calc__title">Calcula cuánto cuesta entregarla lista</h3>
              </div>

              <p className="neg-paso-calc__desc neg-paso-calc__desc--suelto">
                Este es el valor que debes comparar con tu precio de venta, no
                únicamente el costo de la unidad congelada.
              </p>

              <div className="neg-formula">
                {FORMULA.map((f, i) => (
                  <Fragment key={f.titulo}>
                    {i > 0 && <span className="neg-formula__op" aria-hidden="true">+</span>}
                    <span className="neg-formula__item">
                      <span className="neg-formula__icon" aria-hidden="true">{f.icon}</span>
                      <span className="neg-formula__title">{f.titulo}</span>
                      <span className="neg-formula__sub">{f.sub}</span>
                    </span>
                  </Fragment>
                ))}
                <span className="neg-formula__op" aria-hidden="true">=</span>
                <span className="neg-formula__item neg-formula__item--total">
                  <span className="neg-formula__icon neg-formula__icon--total" aria-hidden="true">
                    <FaDollarSign />
                  </span>
                  <span className="neg-formula__title">Costo servido</span>
                  <span className="neg-formula__sub">por unidad</span>
                </span>
              </div>
            </li>

            <li className="neg-paso-calc">
              <div className="neg-paso-calc__head">
                <span className="neg-paso-calc__num" aria-hidden="true">4</span>
                <h3 className="neg-paso-calc__title">Compara con tu precio de venta</h3>
              </div>

              <ul className="neg-comparacion">
                {COMPARACION.map((c) => (
                  <li key={c.titulo} className="neg-comparacion__item">
                    <span className="neg-comparacion__icon" aria-hidden="true">{c.icon}</span>
                    <span>
                      <span className="neg-comparacion__title">{c.titulo}</span>
                      <span className="neg-comparacion__desc">{c.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          </motion.ol>
        </div>

        <motion.p
          className="neg-calc__destacado"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-calc__destacado-icon" aria-hidden="true">
            <FaStar />
          </span>
          <span>
            Una referencia no se evalúa solo por cuánto cuesta comprarla,
            <br />
            <em className="neg-calc__destacado-em">
              sino por cuánto cuesta servirla y cuánto está dispuesto a pagar tu
              cliente.
            </em>
          </span>
        </motion.p>

        <div className="neg-calc__pie">
          <p className="neg-calc__legal">
            <span className="neg-calc__legal-icon" aria-hidden="true">
              <FaInfo />
            </span>
            <span>
              <strong>Nota obligatoria:</strong> Los resultados dependen de los
              costos, precios, porciones, preparación y operación de cada
              negocio. Los ejemplos son orientativos y no representan una
              promesa de utilidad o rentabilidad.
            </span>
          </p>

          <div className="neg-calc__accion">
            <button
              type="button"
              className="neg-btn neg-btn--primary neg-btn--ancho"
              onClick={irAGuia}
            >
              Ver el cálculo completo <FaArrowRight aria-hidden="true" />
            </button>
            <span className="neg-calc__accion-nota">
              Te llevará a nuestra guía para calcular el costo real por unidad.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NegociosCalculadora;
