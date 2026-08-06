import { motion } from 'framer-motion';
import { FaBookOpen, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import NosotrosFoto from './NosotrosFoto';

/*
 * Bloque 2 — Nuestra evolución.
 *
 * Fotografía pendiente. Al subir los archivos a /public/nosotros/ con estos
 * nombres reemplazan solos a los marcadores:
 *
 *   punto-de-venta.jpg     → atención al cliente en el mostrador, vitrina con
 *                            producto a la vista, luz cálida y natural.
 *   fabricacion-manual.jpg → manos armando empanadas sobre la mesa de trabajo,
 *                            plano cerrado, sin rostros.
 *
 * Desktop: las dos fotos forman un collage partido por una curva dorada.
 * Móvil: el collage se oculta y cada foto acompaña a su ítem numerado.
 */
const ETAPAS = [
  {
    num: '1',
    chip: '1. Punto de venta',
    titulo: 'Desde el punto de venta',
    desc: 'Aprendimos que cada retraso, cambio en el producto o falta de disponibilidad termina afectando la atención y la confianza del cliente.',
    src: '/nosotros/punto-de-venta.jpg',
    alt: 'Atención a una clienta en el punto de venta de Empanadas D’lujo',
    nota: 'Atención en el punto de venta',
  },
  {
    num: '2',
    chip: '2. Fabricación manual',
    titulo: 'Desde la fabricación',
    desc: 'Entendimos cuánto tiempo, esfuerzo y organización requiere producir de manera constante cuando el proceso depende principalmente del trabajo manual.',
    src: '/nosotros/fabricacion-manual.jpg',
    alt: 'Armado manual de empanadas sobre la mesa de trabajo',
    nota: 'Fabricación manual',
  },
];

function NosotrosEvolucion() {
  return (
    <section id="nos-evolucion" className="nos-evolucion" aria-labelledby="nos-evolucion-titulo">
      {/* Curva que separa las dos fotos del collage (desktop) */}
      <svg className="nos-evolucion__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="nos-evo-curva" clipPathUnits="objectBoundingBox">
            <path d="M0,0.16 C0.35,0.20 0.65,0.26 1,0.30 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="nos-evolucion__inner">
        <motion.div
          className="nos-evolucion__media"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <div className="nos-collage">
            <div className="nos-collage__shot nos-collage__shot--top">
              <NosotrosFoto
                src={ETAPAS[0].src}
                alt={ETAPAS[0].alt}
                wrapClassName="nos-collage__img"
                nota={ETAPAS[0].nota}
              />
              <span className="nos-collage__chip nos-collage__chip--top">{ETAPAS[0].chip}</span>
            </div>

            <div className="nos-collage__shot nos-collage__shot--bottom">
              <NosotrosFoto
                src={ETAPAS[1].src}
                alt={ETAPAS[1].alt}
                wrapClassName="nos-collage__img"
                nota={ETAPAS[1].nota}
              />
              <span className="nos-collage__chip nos-collage__chip--bottom">{ETAPAS[1].chip}</span>
            </div>

            {/* Trazo dorado sobre el punto de unión */}
            <svg
              className="nos-collage__curve"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,49.6 C35,52 65,55.6 100,58"
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <span className="nos-collage__pivot" aria-hidden="true">
              <FaArrowRight />
            </span>
          </div>

          <p className="nos-disclaimer">
            <FaInfoCircle className="nos-disclaimer__icon" aria-hidden="true" />
            <span>
              Imágenes de referencia para futuras fotografías o recreaciones.
              No representan documentos históricos.
            </span>
          </p>
        </motion.div>

        <motion.div
          className="nos-evolucion__copy"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="nos-badge">
            <FaBookOpen className="nos-badge__icon" aria-hidden="true" />
            Nuestra evolución
          </span>

          <h2 id="nos-evolucion-titulo" className="nos-title">
            Aprendimos viendo el negocio desde ambos lados
          </h2>

          <span className="nos-rule" aria-hidden="true" />

          <p className="nos-evolucion__text">
            Antes de consolidarnos como fábrica, conocimos lo que significa
            vender empanadas, atender clientes, controlar costos y mantener
            producto disponible. También vivimos la fabricación manual y sus
            exigencias diarias.
          </p>

          <p className="nos-evolucion__text">
            Esa experiencia nos permitió entender que un buen producto no
            depende solamente de su sabor. También necesita disponibilidad,
            consistencia y una operación capaz de responder.
          </p>

          <ol className="nos-evolucion__lista">
            {ETAPAS.map((e) => (
              <li key={e.num} className="nos-etapa">
                <div className="nos-etapa__head">
                  <span className="nos-etapa__num" aria-hidden="true">{e.num}</span>
                  <h3 className="nos-etapa__title">{e.titulo}</h3>
                </div>

                {/* Solo móvil: la foto acompaña a su etapa */}
                <div className="nos-etapa__foto">
                  <NosotrosFoto src={e.src} alt="" wrapClassName="nos-etapa__img" nota={e.nota} />
                </div>

                <p className="nos-etapa__desc">{e.desc}</p>
              </li>
            ))}
          </ol>

          <blockquote className="nos-quote">
            Conocer ambos lados del negocio cambió nuestra forma de entender la
            fabricación.
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}

export default NosotrosEvolucion;
