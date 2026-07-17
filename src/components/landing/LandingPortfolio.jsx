import { motion } from 'framer-motion';
import { FaThLarge, FaArrowRight } from 'react-icons/fa';

const products = [
  {
    key: 'cocteleras',
    featured: true,
    name: 'Empanadas cocteleras',
    desc: 'Pequeñas, versátiles y prácticas para compartir, vender o servir en eventos.',
    weight: '30 g',
    units: '50 unidades por paquete',
    cta: 'Ver cocteleras',
    image: '/img_products/pastel_coctelero.png',
  },
  {
    key: 'medianas',
    name: 'Empanadas medianas',
    desc: 'Un formato intermedio para ventas individuales, cafeterías y puntos de fritos.',
    weight: '50 g',
    units: '30 unidades por paquete',
    cta: 'Ver medianas',
    image: '/img_products/emp_carne.jpg',
  },
  {
    key: 'grandes',
    name: 'Empanadas grandes',
    desc: 'Una presentación de mayor tamaño para comidas y ventas gastronómicas.',
    weight: '130 g',
    units: '12 unidades por paquete',
    cta: 'Ver empanadas grandes',
    image: '/img_products/emp_papa_pollo.jpg',
  },
  {
    key: 'pasteles-pequenos',
    name: 'Pasteles pequeños',
    desc: 'Formato práctico para reuniones, eventos y negocios.',
    weight: '55 g',
    units: '30 unidades por paquete',
    cta: 'Ver pasteles pequeños',
    image: '/img_products/pas_pollo.jpg',
  },
  {
    key: 'pasteles-grandes',
    name: 'Pasteles grandes',
    desc: 'Una opción de mayor tamaño para consumo individual u oferta gastronómica.',
    weight: '130 g',
    units: '12 unidades por paquete',
    cta: 'Ver pasteles grandes',
    image: '/img_products/pas_carne.jpg',
  },
];

function LandingPortfolio({ onNavigate }) {
  return (
    <section className="lp-portfolio">
      <div className="lp-portfolio__inner">
        <motion.div
          className="lp-portfolio__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-portfolio__badge">
            <FaThLarge /> Nuestro portafolio
          </span>
          <h2 className="lp-portfolio__title">
            Encuentra el producto ideal para{' '}
            <span className="lp-portfolio__title-em">cada ocasión</span>
          </h2>
          <p className="lp-portfolio__subtitle">
            Explora nuestras empanadas y pasteles según el tamaño, la
            cantidad y el uso que necesitas.
          </p>
        </motion.div>

        <div className="lp-portfolio__grid">
          {products.map((p, i) => (
            <motion.article
              key={p.key}
              className={`lp-portfolio__card${p.featured ? ' lp-portfolio__card--featured' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div className="lp-portfolio__card-img-wrap">
                <img
                  src={p.image}
                  alt={p.name}
                  className="lp-portfolio__card-img"
                />
              </div>
              <h3 className="lp-portfolio__card-name">{p.name}</h3>
              <p className="lp-portfolio__card-desc">{p.desc}</p>
              <p className="lp-portfolio__card-meta">
                {p.weight} · {p.units}
              </p>
              <button
                className={`lp-btn lp-portfolio__card-btn${p.featured ? ' lp-portfolio__card-btn--solid' : ' lp-portfolio__card-btn--outline'}`}
                onClick={() => onNavigate('tienda')}
              >
                {p.cta} <FaArrowRight />
              </button>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="lp-portfolio__footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="lp-btn lp-portfolio__cta"
            onClick={() => onNavigate('tienda')}
          >
            Explorar todos los productos <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingPortfolio;
