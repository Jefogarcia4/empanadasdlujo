import { motion } from 'framer-motion';
import { FaUserFriends, FaUsers, FaCog, FaBullhorn, FaCheckCircle } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 6 — Padre e hijo.
 *
 * Archivo esperado en /public/nosotros/:
 *   padre-e-hijo.jpg → los dos en la planta, uno señalando la bandeja de
 *                      producto y el otro con la bolsa y el portátil.
 *                      Maquinaria Giomatic de fondo.
 */
const PERFILES = [
  {
    icon: <FaCog />,
    nombre: 'Giovany',
    rol: 'Conocimiento convertido en soluciones productivas',
    desc: 'Su experiencia en la fabricación de empanadas lo llevó a comprender el producto, identificar limitaciones del trabajo manual y desarrollar maquinaria especializada a través de Giomatic.',
    areas: ['Fabricación', 'Maquinaria', 'Desarrollo técnico', 'Organización productiva'],
  },
  {
    icon: <FaBullhorn />,
    nombre: 'David',
    rol: 'Estrategia convertida en experiencia de marca',
    desc: 'Su trabajo se concentra en transformar el conocimiento de la fábrica en una propuesta comercial clara, una experiencia digital organizada y nuevas formas de relacionarnos con hogares y negocios.',
    areas: ['Estrategia comercial', 'Marca y comunicación', 'Experiencia digital', 'Desarrollo de clientes'],
  },
];

function Perfil({ icon, nombre, rol, desc, areas }) {
  return (
    <div className="nos-perfil">
      <div className="nos-perfil__head">
        <span className="nos-perfil__icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <h3 className="nos-perfil__nombre">{nombre}</h3>
          <p className="nos-perfil__rol">{rol}</p>
        </div>
      </div>

      <p className="nos-perfil__desc">{desc}</p>

      <p className="nos-perfil__areas-title">Áreas de aporte</p>
      <ul className="nos-perfil__areas">
        {areas.map((a) => (
          <li key={a} className="nos-area">
            <FaCheckCircle className="nos-area__check" aria-hidden="true" />
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NosotrosEquipo() {
  return (
    <section id="nos-equipo" className="nos-equipo" aria-labelledby="nos-equipo-titulo">
      <div className="nos-equipo__inner">
        <div className="nos-equipo__top">
          <motion.div
            className="nos-equipo__copy"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <span className="nos-badge">
              <FaUserFriends className="nos-badge__icon" aria-hidden="true" />
              Padre e hijo
            </span>

            <h2 id="nos-equipo-titulo" className="nos-title">
              Dos conocimientos trabajando en una misma dirección
            </h2>

            <span className="nos-rule" aria-hidden="true" />

            <p className="nos-text">
              Empanadas D’lujo creció cuando el conocimiento de fabricación
              comenzó a trabajar junto con una visión de marca,
              comercialización y experiencia para el cliente.
            </p>

            <p className="nos-text">
              Esta combinación nos permite pensar no solo en cómo producir, sino
              también en cómo presentar la oferta, facilitar la compra y
              construir relaciones comerciales más organizadas.
            </p>
          </motion.div>

          <motion.div
            className="nos-equipo__media"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NosotrosFoto
              src="/nosotros/padre-e-hijo.jpg"
              alt="Giovany y David revisando producto y maquinaria en la planta"
              wrapClassName="nos-equipo__img"
              nota="Padre e hijo en la planta"
            />
          </motion.div>
        </div>

        <motion.div
          className="nos-equipo__grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <Perfil {...PERFILES[0]} />

          <div className="nos-union">
            <p className="nos-union__title">Punto de unión</p>
            <p className="nos-union__text">
              Uno ayudó a construir una forma propia de fabricar. El otro ayudó
              a convertir ese conocimiento en una marca y una experiencia
              comercial.
            </p>
            <span className="nos-union__rule" aria-hidden="true" />
          </div>

          <Perfil {...PERFILES[1]} />
        </motion.div>

        <motion.p
          className="nos-equipo__cierre"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="nos-equipo__cierre-icon" aria-hidden="true">
            <FaUsers />
          </span>
          <span>
            Hoy trabajamos para que cada decisión productiva también tenga
            sentido para el cliente.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

export default NosotrosEquipo;
