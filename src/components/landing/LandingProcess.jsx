import { motion } from 'framer-motion';
import { FaShoppingBag, FaStar, FaImage } from 'react-icons/fa';

const steps = [
  {
    title: 'Empieza sin comprar de más',
    desc: 'Compra desde 2 paquetes y elige un combo para conocer diferentes productos.',
  },
  {
    title: 'Decide con información clara',
    desc: 'Consulta cantidades, gramajes, precios y condiciones antes de realizar tu pedido.',
  },
  {
    title: 'Compra según tu necesidad',
    desc: 'Encuentra opciones para tu hogar, un evento, una primera prueba o el abastecimiento de tu negocio.',
  },
  {
    title: 'Crece con mejores condiciones',
    desc: 'Accede a precios por volumen y beneficios especiales como cliente recurrente.',
  },
];

function LandingProcess() {
  return (
    <section className="lp-steps">
      <div className="lp-steps__inner">
        <motion.div
          className="lp-steps__left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-steps__badge">
            <FaShoppingBag /> Una forma más clara de comprar
          </span>
          <h2 className="lp-steps__title">
            Empieza fácil y<br />
            <span className="lp-steps__title-em">avanza a tu ritmo</span>
          </h2>
          <span className="lp-steps__rule" aria-hidden="true" />
          <p className="lp-steps__subtitle">
            Elige la cantidad que necesitas, conoce las condiciones antes de
            comprar y accede a nuevas opciones a medida que aumenta tu volumen y
            recurrencia.
          </p>

          {/* Placeholder: falta el asset ilustrado (plato + secuencia de
              empaques + caja D'lujo con íconos de rol) del mockup.
              Reserva el espacio/posición correctos para cuando se entregue. */}
          <div className="lp-steps__visual lp-steps__visual--placeholder" aria-hidden="true">
            <FaImage className="lp-steps__visual-icon" />
            <span className="lp-steps__visual-label">
              Asset pendiente: plato + empaques D'lujo
            </span>
          </div>
        </motion.div>

        <ol className="lp-steps__list">
          {steps.map((s, i) => (
            <motion.li
              key={i}
              className="lp-steps__item"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span className="lp-steps__num">{i + 1}</span>
              <div className="lp-steps__content">
                <h3 className="lp-steps__item-title">{s.title}</h3>
                <p className="lp-steps__item-desc">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        className="lp-steps__note"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="lp-steps__note-icon">
          <FaStar />
        </span>
        <p>
          Desde una primera compra hasta acceder a condiciones mayoristas, la
          oferta <strong>se adapta a la etapa en la que estás.</strong>
        </p>
      </motion.div>
    </section>
  );
}

export default LandingProcess;
