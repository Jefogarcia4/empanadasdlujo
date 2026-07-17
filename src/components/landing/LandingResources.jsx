import { motion } from 'framer-motion';
import { FaBook, FaArrowRight, FaImage } from 'react-icons/fa';

const guides = [
  {
    tag: 'Elección de producto',
    title: 'Qué producto elegir según la ocasión',
    desc: 'Compara tamaños, cantidades y usos por reuniones, eventos, consumo en casa o venta individual.',
    linkText: 'Ver recomendaciones',
  },
  {
    tag: 'Negocios',
    title: 'Cómo empezar a vender sin fabricar desde cero',
    desc: 'Aspectos básicos para evaluar productos, cantidades y condiciones antes de realizar una compra mayor.',
    linkText: 'Ver guía para negocios',
  },
  {
    tag: 'Eventos',
    title: 'Cómo calcular un pedido para reunión o evento',
    desc: 'Una guía sencilla para estimar cantidades según el número de personas y el tipo de evento.',
    linkText: 'Ver guía por eventos',
  },
];

function LandingResources() {
  return (
    <section className="lp-resources">
      <div className="lp-resources__inner">
        <motion.div
          className="lp-resources__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-resources__badge">
            <FaBook /> Consejos y recursos
          </span>
          <h2 className="lp-resources__title">
            Información útil para{' '}
            <span className="lp-resources__title-em">
              comprar, preparar y vender
            </span>{' '}
            mejor
          </h2>
          <p className="lp-resources__subtitle">
            Encuentra guías prácticas para elegir productos, conservarlos
            correctamente, calcular cantidades y tomar mejores decisiones
            para tu hogar o negocio.
          </p>
        </motion.div>

        <div className="lp-resources__grid">
          <motion.article
            className="lp-resources__feature"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="lp-resources__feature-img-wrap">
              <img
                src="/img_products/emp_pequena_papa_carne.png"
                alt="Empanadas D'lujo congeladas listas para conservar"
                className="lp-resources__feature-img"
              />
            </div>
            <h3 className="lp-resources__feature-title">
              Cómo conservar y preparar productos congelados
            </h3>
            <p className="lp-resources__feature-desc">
              Recomendaciones para mantener la cadena de frío y obtener un
              buen resultado al freír.
            </p>
            <button className="lp-resources__link" type="button" disabled>
              Leer guía <FaArrowRight />
            </button>
          </motion.article>

          <div className="lp-resources__videos">
            <span className="lp-resources__videos-tag">
              Videos de guías y prácticas recomendadas
            </span>
            <div className="lp-resources__videos-list">
              {guides.map((g, i) => (
                <motion.article
                  key={g.title}
                  className="lp-resources__guide"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                >
                  {/* Placeholder: falta el asset ilustrado de esta guía. */}
                  <div className="lp-resources__guide-img-wrap">
                    <FaImage className="lp-resources__guide-img-icon" />
                  </div>
                  <span className="lp-resources__guide-tag">{g.tag}</span>
                  <h4 className="lp-resources__guide-title">{g.title}</h4>
                  <p className="lp-resources__guide-desc">{g.desc}</p>
                  <button
                    className="lp-resources__link"
                    type="button"
                    disabled
                  >
                    {g.linkText} <FaArrowRight />
                  </button>
                  <span className="lp-resources__guide-pending">
                    Contenido pendiente de desarrollo
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="lp-resources__footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="lp-resources__footer-text">
            <FaBook className="lp-resources__footer-icon" />
            <p>
              Explora más guías, recomendaciones y herramientas para comprar,
              conservar, preparar y vender mejor.
            </p>
          </div>
          <button className="lp-btn lp-resources__cta" type="button" disabled>
            Explorar todos los recursos <FaArrowRight />
          </button>
        </motion.div>

        <p className="lp-resources__note">
          Enlaces a contenido pendiente de publicación. Las páginas
          individuales se publicarán próximamente.
        </p>
      </div>
    </section>
  );
}

export default LandingResources;
