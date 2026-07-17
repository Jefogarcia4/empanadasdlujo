import { motion } from 'framer-motion';
import {
  FaStore,
  FaHome,
  FaBoxOpen,
  FaStar,
  FaFire,
  FaTags,
  FaBullseye,
  FaArrowRight,
  FaImage,
} from 'react-icons/fa';

function LandingAudience({ onNavigate }) {
  return (
    <section className="lp-audience">
      <div className="lp-audience__inner">
        <motion.div
          className="lp-audience__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="lp-audience__badge">
            <FaStore />
          </span>
          <h2 className="lp-audience__title">
            Compra para tu casa o{' '}
            <span className="lp-audience__title-em">para tu negocio</span>
          </h2>
          <p className="lp-audience__subtitle">
            En Empanadas D'lujo puedes empezar con una compra accesible,
            probar diferentes productos o avanzar hacia precios mayoristas
            según tu volumen y recurrencia.
          </p>
        </motion.div>

        <div className="lp-audience__grid">
          <motion.article
            className="lp-audience__card lp-audience__card--home"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="lp-audience__card-icon">
              <FaHome />
            </span>
            <div className="lp-audience__card-img-wrap">
              <img
                src="/img_products/pastel_coctelero.png"
                alt="Empanadas D'lujo servidas en casa"
                className="lp-audience__card-img"
              />
            </div>
            <h3 className="lp-audience__card-title">
              Para disfrutar <span>en casa</span>
            </h3>
            <p className="lp-audience__card-desc">
              Ten empanadas y pasteles congelados listos para preparar en
              reuniones, fines de semana, visitas o antojos familiares.
            </p>
            <ul className="lp-audience__card-list">
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaBoxOpen />
                </span>
                Compra desde 2 paquetes
              </li>
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaStar />
                </span>
                Combos desde $55.000
              </li>
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaFire />
                </span>
                Productos listos para freír
              </li>
            </ul>
            <button
              className="lp-btn lp-audience__card-btn lp-audience__card-btn--home"
              onClick={() => onNavigate('tienda')}
            >
              Ver combos <FaArrowRight />
            </button>
          </motion.article>

          <motion.article
            className="lp-audience__card lp-audience__card--business"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="lp-audience__card-icon">
              <FaStore />
            </span>
            {/* Placeholder: falta el asset ilustrado (caja D'lujo +
                bandeja de empanadas) del mockup. Reserva el espacio
                correcto para cuando se entregue. */}
            <div className="lp-audience__card-img-wrap lp-audience__card-img-wrap--placeholder">
              <FaImage className="lp-audience__placeholder-icon" />
              <span className="lp-audience__placeholder-label">
                Asset pendiente: caja D'lujo + bandeja
              </span>
            </div>
            <h3 className="lp-audience__card-title">
              Para vender <span>en tu negocio</span>
            </h3>
            <p className="lp-audience__card-desc">
              Accede a productos por paquete, precio por volumen y una ruta
              pensada para clientes recurrentes.
            </p>
            <ul className="lp-audience__card-list">
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaTags />
                </span>
                Precio mayorista desde 10 paquetes combinados
              </li>
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaStar />
                </span>
                Beneficios especiales para clientes recurrentes
              </li>
              <li>
                <span className="lp-audience__card-list-icon">
                  <FaBullseye />
                </span>
                Ideal para cafeterías, puntos de fritos, eventos y
                distribuidores
              </li>
            </ul>
            <button
              className="lp-btn lp-audience__card-btn lp-audience__card-btn--business"
              onClick={() => onNavigate('tienda')}
            >
              Conocer opciones para negocios <FaArrowRight />
            </button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

export default LandingAudience;
