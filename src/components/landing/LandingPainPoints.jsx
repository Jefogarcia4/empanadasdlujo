import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaChartLine, FaTools } from 'react-icons/fa';

const pains = [
  {
    icon: <FaExclamationTriangle />,
    colorClass: 'lp-pain__card--red',
    stat: '1 de 3',
    statLabel: 'negocios ha perdido ventas por proveedor informal',
    title: 'Proveedor que improvisa = riesgo real',
    desc: 'Incumplimientos en entrega, lotes inconsistentes, producto que se abre al freír o que absorbe aceite en exceso. Si el proveedor falla, tu negocio paga.',
  },
  {
    icon: <FaChartLine />,
    colorClass: 'lp-pain__card--orange',
    stat: '$468K',
    statLabel: 'al mes en merma invisible (3% de inconsistencia en 300 uds/día)',
    title: 'La merma invisible te quiebra en silencio',
    desc: 'El 3% de producto defectuoso parece poco. Pero en un mes son más de $468.000 que se van sin que los veas en tu balance. Eso no es precio: es proceso.',
  },
  {
    icon: <FaTools />,
    colorClass: 'lp-pain__card--gold',
    stat: '3x',
    statLabel: 'más desgaste cuando produces en casa sin maquinaria',
    title: 'Fabricar solo no escala, solo cansa',
    desc: 'Personal, maquinaria, control sanitario, tiempo y energía. Producir empanadas en casa sin proceso tecnificado ata al dueño a la producción y le impide vender.',
  },
];

function LandingPainPoints() {
  return (
    <section className="lp-pain">
      <div className="lp-container">
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="lp-section-tag">El problema invisible</p>
          <h2 className="lp-section-title">
            ¿Tu proveedor actual te está<br />
            <span className="lp-highlight">costando más de lo que crees?</span>
          </h2>
          <p className="lp-section-sub">
            La mayoría de los negocios de fritos venden bien pero ganan poco.
            El problema no es el producto. Es la fabricación.
          </p>
        </motion.div>

        <div className="lp-pain__grid">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              className={`lp-pain__card ${p.colorClass}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="lp-pain__icon">{p.icon}</div>
              <div className="lp-pain__stat">{p.stat}</div>
              <div className="lp-pain__stat-label">{p.statLabel}</div>
              <h3 className="lp-pain__title">{p.title}</h3>
              <p className="lp-pain__desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingPainPoints;

