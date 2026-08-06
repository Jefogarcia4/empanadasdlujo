import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFlag } from 'react-icons/fa';
import { FiBox, FiPackage, FiTruck } from 'react-icons/fi';
import { IconoCamara } from './NegociosIconos';
import NegociosSellos from './NegociosSellos';

/*
 * Bloque 1 — Para negocios.
 *
 * Archivo esperado en /public/negocios/:
 *   hero.jpg → producto D'lujo en contexto de negocio, con ingredientes a la
 *              vista. Debe ser una toma autorizada: mientras no exista, la
 *              tarjeta muestra el marcador de placeholder.
 */
const CONDICIONES = [
  { icon: <FiBox className="neg-condicion__icon" />, label: 'Compra desde 2 paquetes' },
  {
    icon: <FiPackage className="neg-condicion__icon" />,
    label: 'Precio mayorista desde 10 paquetes combinados',
  },
  { icon: <FiTruck className="neg-condicion__icon" />, label: 'Despachos en el Valle de Aburrá' },
];

function NegociosHero({ onNavigate }) {
  const [hayFoto, setHayFoto] = useState(true);

  // Lleva al bloque siguiente; mientras no exista, avanza una pantalla.
  const irAComoTrabajamos = () => {
    const destino = document.getElementById('neg-como-trabajamos');
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section className="neg-hero" aria-labelledby="neg-hero-titulo">
      <div className="neg-hero__inner">
        <motion.div
          className="neg-hero__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <span className="neg-eyebrow">
            <FaFlag className="neg-eyebrow__icon" aria-hidden="true" />
            Para negocios
          </span>

          <h1 id="neg-hero-titulo" className="neg-title">
            Tu negocio vende el producto. Nosotros respondemos por cómo se
            fabrica.
          </h1>

          <span className="neg-rule" aria-hidden="true" />

          <p className="neg-text">
            En Empanadas D’lujo transformamos nuestros ingredientes principales
            dentro de la fábrica y elaboramos empanadas y pasteles congelados
            listos para freír, con diferentes formatos para las necesidades de
            tu negocio.
          </p>

          <p className="neg-text">
            Compara formatos, conoce las condiciones de compra y encuentra
            recursos para elegir qué puede funcionar mejor en tu negocio.
          </p>

          <div className="neg-hero__actions">
            <button
              type="button"
              className="neg-btn neg-btn--primary"
              onClick={() => onNavigate('tienda')}
            >
              Ver productos para negocios
            </button>
            <button
              type="button"
              className="neg-btn neg-btn--outline"
              onClick={irAComoTrabajamos}
            >
              Conocer cómo trabajamos
            </button>
          </div>

          <ul className="neg-hero__condiciones">
            {CONDICIONES.map(({ icon, label }) => (
              <li key={label} className="neg-condicion">
                {icon}
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className={`neg-hero__card${hayFoto ? '' : ' neg-hero__card--vacia'}`}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src="/negocios/hero.jpg"
            alt="Producto Empanadas D’lujo listo para el punto de venta"
            className="neg-hero__img"
            loading="lazy"
            onError={() => setHayFoto(false)}
          />

          {!hayFoto && (
            <div className="neg-hero__placeholder">
              <IconoCamara className="neg-hero__placeholder-icon" />
              <p className="neg-hero__placeholder-title">Placeholder</p>
              <p className="neg-hero__placeholder-sub">
                Imagen reemplazable por fotografía autorizada
              </p>
            </div>
          )}

          <NegociosSellos />
        </motion.div>
      </div>
    </section>
  );
}

export default NegociosHero;
