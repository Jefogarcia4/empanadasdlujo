import { motion } from 'framer-motion';
import { FaHeart, FaImage, FaClipboardCheck, FaUsers, FaAward } from 'react-icons/fa';

const values = [
  {
    icon: <FaAward />,
    title: 'Cuidado en el producto',
    desc: 'Forma, presentación, conservación e información pensadas para que sepas qué estás comprando.',
  },
  {
    icon: <FaClipboardCheck />,
    title: 'Orden en la experiencia',
    desc: 'Precios visibles, condiciones claras y una compra que puede adaptarse a la necesidad.',
  },
  {
    icon: <FaUsers />,
    title: 'Cercanía en la atención',
    desc: 'Una empresa que conoce su producto, escucha a sus clientes y busca construir relaciones duraderas.',
  },
];

function LandingBrandValues() {
  return (
    <section className="lp-brandvalues">
      <div className="lp-brandvalues__inner">
        <div className="lp-brandvalues__text">
          <motion.span
            className="lp-brandvalues__badge"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FaHeart /> Lo que significa D'lujo
          </motion.span>

          <motion.h2
            className="lp-brandvalues__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            El lujo no está en exagerar.{' '}
            <span className="lp-brandvalues__title-em">
              Está en hacer bien
            </span>{' '}
            cada detalle.
          </motion.h2>

          <motion.p
            className="lp-brandvalues__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Para nosotros, D'lujo significa fabricar con criterio, presentar
            cada producto con cuidado y ofrecer una experiencia clara desde
            que eliges hasta que recibes tu pedido.
          </motion.p>

          <div className="lp-brandvalues__list">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="lp-brandvalues__item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                <span className="lp-brandvalues__item-icon">{v.icon}</span>
                <div>
                  <h3 className="lp-brandvalues__item-title">{v.title}</h3>
                  <p className="lp-brandvalues__item-desc">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            className="lp-brandvalues__quote"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            "Buscamos que D'lujo se note en la forma de hacer las cosas."
          </motion.blockquote>
        </div>

        <motion.div
          className="lp-brandvalues__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Placeholder: falta la fotografía de manos preparando el producto. */}
          <div className="lp-brandvalues__visual-main lp-brandvalues__visual--placeholder">
            <FaImage className="lp-brandvalues__visual-icon" />
            <span>Asset pendiente: preparación del producto</span>
          </div>
          {/* Placeholder: falta la fotografía de empaques D'lujo. */}
          <div className="lp-brandvalues__visual-inset lp-brandvalues__visual--placeholder">
            <FaImage className="lp-brandvalues__visual-icon" />
            <span>Asset pendiente: empaques D'lujo</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingBrandValues;
