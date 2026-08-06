import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaArrowRight, FaInfo } from 'react-icons/fa';
import { FiLayers, FiUsers, FiCoffee, FiShoppingBag, FiBox } from 'react-icons/fi';
import NegociosFoto from './NegociosFoto';

/*
 * Bloque 4 — Elige según cómo vendes.
 *
 * Archivos esperados en /public/negocios/:
 *
 *   formato-1-compartir.jpg     → cocteleras servidas para compartir, con salsa.
 *   formato-2-porcion.jpg       → empanada mediana con café, tipo refrigerio.
 *   formato-3-protagonista.jpg  → empanada grande en plato, con bebida.
 *   formato-4-explorar.jpg      → varios empaques D'lujo juntos, producto a la vista.
 *
 * Encuadre vertical: en la tarjeta ocupan una columna alta a la derecha.
 */
const ESCENARIOS = [
  {
    num: '1',
    icon: <FiUsers />,
    titulo: 'Para servir varias unidades o compartir',
    desc: 'Formatos pequeños para porciones, eventos, acompañamientos o consumo rápido.',
    listaTitulo: 'Referencias sugeridas',
    referencias: [
      'Empanadas cocteleras de 30 g · 50 unidades',
      'Mini pasteles de 55 g · 30 unidades',
    ],
    evaluar: ['Cantidad por porción.', 'Velocidad de servicio.', 'Empaque o presentación.'],
    src: '/negocios/formato-1-compartir.jpg',
    alt: 'Empanadas cocteleras servidas para compartir',
    nota: 'Formato para compartir',
    estrella: true,
  },
  {
    num: '2',
    icon: <FiCoffee />,
    titulo: 'Para una porción ligera y práctica',
    desc: 'Los formatos medianos pueden funcionar en desayunos, refrigerios, combos sencillos o venta individual.',
    listaTitulo: 'Referencias sugeridas',
    referencias: [
      'Empanadas medianas de 50 g · 30 unidades',
      'Mini pasteles de 55 g · 30 unidades',
    ],
    evaluar: ['Precio final.', 'Acompañamiento.', 'Tamaño esperado por el cliente.'],
    src: '/negocios/formato-2-porcion.jpg',
    alt: 'Empanada mediana acompañada de café',
    nota: 'Formato de porción ligera',
  },
  {
    num: '3',
    icon: <FiShoppingBag />,
    titulo: 'Para convertir una unidad en protagonista',
    desc: 'Formatos grandes para venta individual, desayunos completos o combos.',
    listaTitulo: 'Referencias sugeridas',
    referencias: [
      'Empanadas grandes de 130 g · 12 unidades',
      'Pasteles grandes de 130 g · 12 unidades',
    ],
    evaluar: ['Percepción de porción.', 'Precio de venta.', 'Empaque para llevar.'],
    src: '/negocios/formato-3-protagonista.jpg',
    alt: 'Empanada grande servida como plato principal',
    nota: 'Formato grande',
  },
  {
    num: '4',
    icon: <FiBox />,
    titulo: 'Para conocer qué prefiere tu público',
    desc: 'Alternativas para comenzar, comparar referencias y conocer la respuesta del público.',
    listaTitulo: 'Alternativas sugeridas',
    referencias: [
      'Combos de inicio.',
      'Referencias complementarias.',
      'Un formato pequeño y uno grande.',
      'Diferentes rellenos para comparar aceptación.',
    ],
    evaluar: ['Respuesta del cliente.', 'Rotación.', 'Capacidad de almacenamiento.'],
    src: '/negocios/formato-4-explorar.jpg',
    alt: 'Varias referencias de Empanadas D’lujo juntas',
    nota: 'Referencias para comparar',
  },
];

function NegociosFormatos({ onNavigate }) {
  return (
    <section id="neg-formatos" className="neg-formatos" aria-labelledby="neg-formatos-titulo">
      <div className="neg-formatos__inner">
        <motion.header
          className="neg-formatos__head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className="neg-badge neg-badge--rojo">
            <FiLayers className="neg-badge__icon" aria-hidden="true" />
            Elige según cómo vendes
          </span>

          <h2 id="neg-formatos-titulo" className="neg-title">
            No todos los negocios necesitan el mismo formato
          </h2>

          <span className="neg-rule" aria-hidden="true" />

          <p className="neg-text">
            El tamaño, la cantidad por paquete y la forma de servir cambian
            según si vendes por unidad, en combo, como acompañamiento o para
            eventos.
          </p>

          <p className="neg-text">
            Utiliza estos escenarios como punto de partida y revisa qué
            referencia se adapta mejor a tu público, precio y operación.
          </p>
        </motion.header>

        <motion.ol
          className="neg-formatos__grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {ESCENARIOS.map((e) => (
            <li key={e.num} className="neg-escenario">
              <div className="neg-escenario__cuerpo">
                <div className="neg-escenario__head">
                  <span className="neg-escenario__num" aria-hidden="true">{e.num}</span>
                  <span className="neg-escenario__icon" aria-hidden="true">{e.icon}</span>
                  <h3 className="neg-escenario__title">{e.titulo}</h3>
                </div>

                <p className="neg-escenario__desc">{e.desc}</p>

                <p className="neg-escenario__sub">{e.listaTitulo}</p>
                <ul className="neg-refs">
                  {e.referencias.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>

                <p className="neg-escenario__sub">Aspectos por evaluar</p>
                <ul className="neg-evaluar">
                  {e.evaluar.map((a) => (
                    <li key={a} className="neg-evaluar__item">
                      <FaCheckCircle className="neg-evaluar__check" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="neg-escenario__media">
                <NegociosFoto
                  src={e.src}
                  alt={e.alt}
                  wrapClassName="neg-escenario__img"
                  nota={e.nota}
                />
                {e.estrella && (
                  <span className="neg-escenario__estrella">
                    <FaStar aria-hidden="true" />
                    Referencia estrella
                  </span>
                )}
              </div>
            </li>
          ))}
        </motion.ol>

        <motion.p
          className="neg-formatos__nota"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="neg-formatos__nota-icon" aria-hidden="true">
            <FaInfo />
          </span>
          <span>
            <strong>Nota orientativa:</strong> Estas recomendaciones son un
            punto de partida. La referencia adecuada depende de tu público,
            precio de venta, presentación y forma de operación.
          </span>
        </motion.p>

        <div className="neg-formatos__cta">
          <button
            type="button"
            className="neg-btn neg-btn--primary neg-btn--ancho"
            onClick={() => onNavigate('tienda')}
          >
            Comparar todas las referencias <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default NegociosFormatos;
