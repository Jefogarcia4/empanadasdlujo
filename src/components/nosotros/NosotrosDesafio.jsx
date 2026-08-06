import { motion } from 'framer-motion';
import { FaFlag, FaRegClock, FaUser, FaLayerGroup } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 3 — El desafío que decidimos resolver.
 *
 * Fotografía pendiente. Archivos esperados en /public/nosotros/:
 *
 *   desafio-principal.jpg  → manos trabajando, reloj, bandejas acumuladas,
 *                            libreta y gráfica horas/unidades. Debe transmitir
 *                            repetición de tareas y paso del tiempo.
 *   desafio-detalle-1.jpg  → bandeja de empanadas recién armadas.
 *   desafio-detalle-2.jpg  → estantería con bandejas apiladas.
 *   desafio-detalle-3.jpg  → operario formando producto junto al reloj.
 *
 * Ambiente limpio, ordenado y real. Son referencias para futuras tomas,
 * no documentos históricos.
 */
const DESAFIOS = [
  {
    num: '1',
    titulo: 'Más tiempo por cada unidad',
    desc: 'El crecimiento dependía directamente de aumentar las horas y el esfuerzo dedicado a la fabricación.',
  },
  {
    num: '2',
    titulo: 'Mantener la consistencia exigía más control',
    desc: 'Cuando gran parte del proceso era manual, mantener una forma y presentación similares exigía mayor control y atención.',
  },
  {
    num: '3',
    titulo: 'Capacidad difícil de ampliar',
    desc: 'Atender pedidos más grandes requería encontrar una forma de producir con mayor continuidad y organización.',
  },
];

const FLUJO = [
  { icon: <FaRegClock />, label: 'Más horas de trabajo' },
  { icon: <FaUser />, label: 'Más esfuerzo manual' },
  { icon: <FaLayerGroup />, label: 'Más unidades, misma carga operativa' },
];

const DETALLES = [
  { src: '/nosotros/desafio-detalle-1.jpg', nota: 'Bandeja de producto armado' },
  { src: '/nosotros/desafio-detalle-2.jpg', nota: 'Bandejas apiladas' },
  { src: '/nosotros/desafio-detalle-3.jpg', nota: 'Producción junto al reloj' },
];

const Flecha = () => (
  <svg className="nos-flujo__arrow" viewBox="0 0 60 12" aria-hidden="true">
    <path d="M0,6 H46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
    <path
      d="M45,2 L52,6 L45,10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function NosotrosDesafio() {
  return (
    <section id="nos-desafio" className="nos-desafio" aria-labelledby="nos-desafio-titulo">
      <div className="nos-desafio__inner">
        <motion.div
          className="nos-desafio__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <span className="nos-badge">
            <FaFlag className="nos-badge__icon" aria-hidden="true" />
            El desafío que decidimos resolver
          </span>

          <h2 id="nos-desafio-titulo" className="nos-title">
            Cuando crecer exigía algo más que trabajar más
          </h2>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-text">
            Durante años, aumentar la producción significaba dedicar más tiempo,
            sumar esfuerzo manual y repetir cada etapa producto por producto.
          </p>

          <p className="nos-text">
            Esa forma de trabajar nos permitió aprender el oficio, pero también
            mostró sus límites: era difícil aumentar la capacidad, conservar una
            forma consistente y responder a pedidos mayores sin incrementar la
            carga operativa.
          </p>

          {/* Solo móvil: la foto principal se intercala antes de los desafíos */}
          <div className="nos-desafio__foto-movil">
            <NosotrosFoto
              src="/nosotros/desafio-principal.jpg"
              alt=""
              wrapClassName="nos-desafio__hero-img"
              nota="Producción manual, reloj y bandejas"
            />
          </div>

          <ol className="nos-desafio__lista">
            {DESAFIOS.map((d) => (
              <li key={d.num} className="nos-desafio-item">
                <div className="nos-desafio-item__head">
                  <span className="nos-desafio-item__num" aria-hidden="true">{d.num}</span>
                  <h3 className="nos-desafio-item__title">{d.titulo}</h3>
                </div>
                <p className="nos-desafio-item__desc">{d.desc}</p>
              </li>
            ))}
          </ol>

          <blockquote className="nos-quote">
            El desafío no era hacer más empanadas.
            <br />
            Era construir un proceso capaz de sostenerlas.
          </blockquote>
        </motion.div>

        <motion.div
          className="nos-desafio__media"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <NosotrosFoto
            src="/nosotros/desafio-principal.jpg"
            alt="Producción manual de empanadas junto a un reloj y bandejas acumuladas"
            wrapClassName="nos-desafio__hero-img"
            nota="Producción manual, reloj y bandejas"
          />

          <div className="nos-desafio__tiras">
            {DETALLES.map((d) => (
              <NosotrosFoto
                key={d.src}
                src={d.src}
                alt=""
                wrapClassName="nos-desafio__tira-img"
                nota={d.nota}
              />
            ))}
          </div>

          <div className="nos-flujo">
            {FLUJO.map(({ icon, label }, i) => (
              <div className="nos-flujo__paso" key={label}>
                {i > 0 && <Flecha />}
                <span className="nos-flujo__icon" aria-hidden="true">
                  {icon}
                </span>
                <span className="nos-flujo__label">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosDesafio;
