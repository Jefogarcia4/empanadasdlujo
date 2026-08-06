import { motion } from 'framer-motion';
import { FaBookOpen, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 1 — Nuestra historia.
 *
 * Fotografía pendiente de producir. Al subir los archivos a /public/nosotros/
 * con estos nombres, reemplazan solos a los marcadores:
 *
 *   fundadores.jpg      → padre e hijo juntos, cercanos y naturales, en el
 *                         entorno real de la planta. Luz cálida y natural,
 *                         maquinaria y producto visibles sin robar
 *                         protagonismo, expresión profesional y auténtica,
 *                         fondo limpio y ordenado. Debe transmitir
 *                         experiencia y trabajo real, fabricación propia,
 *                         relación padre e hijo, tradición y evolución.
 *                         Formato 16:10 o 4:3, mínimo 1920 px de ancho,
 *                         tonos cálidos, enfoque en rostro y entorno.
 *   primeros-pasos.jpg  → recreación del punto de venta original.
 *   primera-maquina.jpg → recreación de la primera máquina.
 */
const POLAROIDS = [
  {
    src: '/nosotros/primeros-pasos.jpg',
    titulo: 'Nuestros primeros pasos',
    alt: 'Recreación visual del primer punto de venta de Empanadas D’lujo',
  },
  {
    src: '/nosotros/primera-maquina.jpg',
    titulo: 'Nuestra primera máquina',
    alt: 'Recreación visual de la primera máquina de producción',
  },
];

function NosotrosHistoria({ onNavigate }) {
  // Lleva al bloque siguiente de la página; mientras no exista, avanza una
  // pantalla para no dejar el botón muerto.
  const irAEvolucion = () => {
    const destino = document.getElementById('nos-evolucion');
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <section className="nos-historia" aria-labelledby="nos-historia-titulo">
      <div className="nos-historia__inner">
        <motion.div
          className="nos-historia__media"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <figure className="nos-historia__figure">
            <NosotrosFoto
              src="/nosotros/fundadores.jpg"
              alt="Fundadores de Empanadas D’lujo en la planta de producción"
              wrapClassName="nos-historia__photo"
              nota="Fotografía de los fundadores en la planta"
            />

            <div className="nos-historia__polaroids">
              {POLAROIDS.map((p) => (
                <figure key={p.titulo} className="nos-polaroid">
                  <NosotrosFoto
                    src={p.src}
                    alt={p.alt}
                    wrapClassName="nos-polaroid__img"
                    nota={p.titulo}
                  />
                  <figcaption className="nos-polaroid__caption">
                    <span className="nos-polaroid__title">{p.titulo}</span>
                    <span className="nos-polaroid__note">(Recreación visual)</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </figure>

          <p className="nos-disclaimer">
            <FaInfoCircle className="nos-disclaimer__icon" aria-hidden="true" />
            <span>
              Estas imágenes representan recreaciones visuales y no documentos
              históricos auténticos.
            </span>
          </p>
        </motion.div>

        <motion.div
          className="nos-historia__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="nos-badge">
            <FaBookOpen className="nos-badge__icon" aria-hidden="true" />
            Nuestra historia
          </span>

          <h1 id="nos-historia-titulo" className="nos-historia__title">
            Conocimos el negocio antes de construir nuestra forma de fabricar
          </h1>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-text">
            Empanadas D’lujo nació de un padre y un hijo que aprendieron
            vendiendo, fabricando y resolviendo desafíos reales del producto.
            Hoy convertimos esa experiencia en una empresa más organizada y
            especializada.
          </p>

          <blockquote className="nos-quote">
            Experiencia práctica, fabricación propia y una visión compartida de
            hacer mejor las cosas.
          </blockquote>
        </motion.div>

        <motion.div
          className="nos-historia__actions"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button type="button" className="nos-btn nos-btn--primary" onClick={irAEvolucion}>
            Conocer nuestra evolución <FaArrowRight aria-hidden="true" />
          </button>
          <button
            type="button"
            className="nos-btn nos-btn--outline"
            onClick={() => onNavigate('tienda')}
          >
            Ver productos <FaArrowRight aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosHistoria;
