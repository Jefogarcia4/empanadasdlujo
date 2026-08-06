import { motion } from 'framer-motion';
import { FaBookOpen, FaCheckCircle, FaCalculator, FaSnowflake, FaStar } from 'react-icons/fa';
import { FiShoppingBag, FiBarChart2 } from 'react-icons/fi';
import {
  IconoAceite,
  IconoNevera,
  IconoMonedas,
  IconoEmpanada,
  IconoBalanza,
} from './NegociosIconos';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 7 — Recursos para negocios (fondo oscuro).
 *
 * Archivos esperados en /public/negocios/:
 *
 *   recurso-1-almacenar.jpg → producto en el congelador junto a la freidora
 *                             y un termómetro.
 *   recurso-2-costos.jpg    → calculadora, libreta con cuentas y empaque D'lujo.
 *   recurso-3-vender.jpg    → empanadas en caja para llevar, con salsa y libreta.
 */
const RECURSOS = [
  {
    num: '1',
    src: '/negocios/recurso-1-almacenar.jpg',
    nota: 'Conservación y fritura',
    categoria: { icon: <FaSnowflake />, label: 'Manejo del producto' },
    titulo: 'Cómo almacenar y freír correctamente empanadas y pasteles congelados',
    desc: 'Aprende a conservar la cadena de frío, controlar la temperatura, elegir el aceite y reducir errores que pueden afectar el producto durante la preparación.',
    temas: [
      'Conservación a –18 °C.',
      'Organización del congelador.',
      'Tiempo aproximado de preparación.',
      'Estado y uso del aceite.',
      'Qué revisar si una unidad se abre o se rompe.',
    ],
    tipo: 'Guía práctica',
  },
  {
    num: '2',
    src: '/negocios/recurso-2-costos.jpg',
    nota: 'Cálculo de costos',
    categoria: { icon: <FaCalculator />, label: 'Tirando calculadora' },
    titulo: 'Cómo calcular el costo real de una unidad servida',
    desc: 'Revisa el costo del producto, aceite, energía, merma, salsas, servilletas, empaques y demás elementos antes de definir cuánto cobrar.',
    temas: [
      'Costo base por unidad.',
      'Costos de preparación.',
      'Gastos de presentación.',
      'Precio de venta.',
      'Margen de contribución estimado.',
    ],
    tipo: 'Guía con ejemplos',
  },
  {
    num: '3',
    src: '/negocios/recurso-3-vender.jpg',
    nota: 'Formas de vender',
    categoria: { icon: <FiShoppingBag />, label: 'Cómo venderlo' },
    titulo: 'Cómo elegir una referencia y convertirla en una oferta para tu cliente',
    desc: 'Explora formas de vender por unidad, porción o combo, definir acompañamientos y revisar qué productos reciben una mejor respuesta.',
    temas: [
      'Elección de formatos.',
      'Presentaciones y empaques.',
      'Construcción de combos.',
      'Registro de comentarios.',
      'Medición de rotación y recompra.',
    ],
    tipo: 'Guía comercial',
  },
];

const PROXIMOS = [
  { icon: <IconoAceite />, label: 'Qué aceite utilizar y cómo revisar su estado.' },
  { icon: <IconoNevera />, label: 'Cómo organizar inventario y reposición.' },
  { icon: <IconoMonedas />, label: 'Qué gastos adicionales considerar al vender.' },
  { icon: <IconoEmpanada />, label: 'Cómo definir porciones y acompañamientos.' },
  { icon: <IconoBalanza />, label: 'Cómo comparar producir internamente o comprar listo.' },
  { icon: <FiBarChart2 />, label: 'Cómo medir aceptación y recompra.' },
];

function NegociosRecursos({ onNavigate }) {
  return (
    <section
      id="neg-recursos"
      className="neg-recursos neg-oscuro"
      aria-labelledby="neg-recursos-titulo"
    >
      <div className="neg-recursos__inner">
        <motion.header
          className="neg-recursos__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="neg-eyebrow">
            <FaBookOpen className="neg-eyebrow__icon" aria-hidden="true" />
            Recursos para negocios
          </span>

          <h2 id="neg-recursos-titulo" className="neg-title">
            No solo necesitas producto.
            <br />
            También necesitas criterio para venderlo.
          </h2>

          <span className="neg-rule" aria-hidden="true" />

          <p className="neg-text neg-text--fuerte">
            Estamos preparando guías, ejemplos y contenidos prácticos para
            ayudarte a conservar, preparar, presentar y calcular mejor cada
            referencia.
          </p>

          <p className="neg-text">
            Utiliza estos recursos como apoyo para adaptar el producto a tu
            operación, tu público y tu forma de vender.
          </p>
        </motion.header>

        <motion.ol
          className="neg-recursos__grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {RECURSOS.map((r) => (
            <li key={r.num} className="neg-recurso">
              <div className="neg-recurso__media">
                <span className="neg-recurso__num" aria-hidden="true">{r.num}</span>
                <NegociosFoto
                  src={r.src}
                  alt=""
                  wrapClassName="neg-recurso__img"
                  nota={r.nota}
                />
              </div>

              <div className="neg-recurso__cuerpo">
                <p className="neg-recurso__chips">
                  <span className="neg-chip neg-chip--categoria">
                    <span className="neg-chip__icon" aria-hidden="true">{r.categoria.icon}</span>
                    {r.categoria.label}
                  </span>
                  <span className="neg-chip neg-chip--estado">En preparación</span>
                </p>

                <h3 className="neg-recurso__title">{r.titulo}</h3>
                <p className="neg-recurso__desc">{r.desc}</p>

                <p className="neg-recurso__sub">Temas que puede incluir</p>
                <ul className="neg-recurso__temas">
                  {r.temas.map((t) => (
                    <li key={t} className="neg-recurso__tema">
                      <FaCheckCircle className="neg-recurso__check" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>

                <p className="neg-recurso__tipo">
                  <FaBookOpen aria-hidden="true" />
                  {r.tipo}
                </p>
              </div>
            </li>
          ))}
        </motion.ol>

        <motion.div
          className="neg-proximos"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="neg-proximos__title">Más temas que desarrollaremos para tu negocio</h3>

          <ul className="neg-proximos__grid">
            {PROXIMOS.map((p) => (
              <li key={p.label} className="neg-proximo">
                <span className="neg-proximo__icon" aria-hidden="true">{p.icon}</span>
                <span className="neg-proximo__label">{p.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="neg-recursos__cierre"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-recursos__cierre-icon" aria-hidden="true">
            <FaStar />
          </span>

          <p className="neg-recursos__cierre-texto">
            Queremos ayudarte a <em>entender mejor</em> el producto que compras y
            las decisiones que <em>tomas para venderlo</em>.
          </p>

          <button
            type="button"
            className="neg-btn neg-btn--primary"
            onClick={() => onNavigate('tienda')}
          >
            Ver recursos para negocios
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default NegociosRecursos;
