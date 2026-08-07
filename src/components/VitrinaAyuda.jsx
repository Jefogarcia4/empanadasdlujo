import { useEffect, useRef, useState } from 'react';
import { FiHelpCircle, FiArrowRight, FiInfo } from 'react-icons/fi';

// Bloque de cierre de la vitrina: tres rutas para quien todavía no sabe qué
// formato pedir. Usa la variante oscura que ya emplea la página de negocios.

const svgProps = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const IconoCombos = (
  <svg {...svgProps}>
    <path d="M24 14 39 21v15L24 43 9 36V21L24 14Z" />
    <path d="M9 21l15 7 15-7" />
    <path d="M24 28v15" />
    <path d="M15 9 13 5" />
    <path d="M24 8V3" />
    <path d="M33 9l2-4" />
  </svg>
);

const IconoNegocio = (
  <svg {...svgProps}>
    <path d="M7 10h34v8H7z" />
    <path d="M7 18q4 5.5 8 0t8 0 8 0 8 0 2 0" />
    <path d="M11 22v18h26V22" />
    <path d="M19 40V29h10v11" />
  </svg>
);

const IconoOrientacion = (
  <svg {...svgProps}>
    <path d="M40 25c0 7.7-7.2 14-16 14-2.3 0-4.5-.4-6.5-1.2L9 41l3.3-7.6C9.6 31 8 28.2 8 25c0-7.7 7.2-14 16-14s16 6.3 16 14Z" />
    <circle cx="17" cy="25" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="24" cy="25" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="31" cy="25" r="1.7" fill="currentColor" stroke="none" />
  </svg>
);

function VitrinaAyuda({ onVerCombos, onNavigate }) {
  const [mostrandoCombos, setMostrandoCombos] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleCombos = () => {
    if (mostrandoCombos) return;
    setMostrandoCombos(true);
    onVerCombos?.();
    // El filtro se aplica de inmediato; el estado solo acompaña el desplazamiento.
    timerRef.current = window.setTimeout(() => setMostrandoCombos(false), 700);
  };

  // Enlaces reales: conservan la ruta para abrir en pestaña nueva o compartir,
  // pero navegan por el router del sitio.
  const irA = (page) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.(page);
  };

  return (
    <section className="vayuda" aria-labelledby="vayuda-titulo">
      <div className="vayuda__inner">
        <div className="vayuda__intro">
          <span className="vayuda__eyebrow">
            <FiHelpCircle aria-hidden="true" />
            Ayuda para elegir
          </span>

          <h2 id="vayuda-titulo" className="vayuda__title">
            ¿Todavía no sabes
            <br />
            qué formato elegir?
          </h2>

          <p className="vayuda__lead">
            Elige cómo avanzar: explora combos, revisa opciones para negocios o
            solicita orientación antes de completar tu compra.
          </p>
        </div>

        <ul className="vayuda__rutas">
          <li className="vayuda__ruta">
            <span className="vayuda__ruta-icon">{IconoCombos}</span>
            <div className="vayuda__ruta-text">
              <h3 className="vayuda__ruta-title">Quiero probar diferentes productos</h3>
              <p className="vayuda__ruta-desc">
                Explora combos preparados para comenzar con varias referencias en una
                misma compra.
              </p>
            </div>
            <button
              type="button"
              className={`vayuda__action${mostrandoCombos ? ' is-running' : ''}`}
              onClick={handleCombos}
              disabled={mostrandoCombos}
            >
              {mostrandoCombos ? (
                <>
                  <span className="vayuda__spinner" aria-hidden="true" />
                  Mostrando combos...
                </>
              ) : (
                <>
                  Ver combos
                  <FiArrowRight aria-hidden="true" />
                </>
              )}
            </button>
          </li>

          <li className="vayuda__ruta">
            <span className="vayuda__ruta-icon">{IconoNegocio}</span>
            <div className="vayuda__ruta-text">
              <h3 className="vayuda__ruta-title">Estoy eligiendo para mi negocio</h3>
              <p className="vayuda__ruta-desc">
                Revisa formatos según tu forma de vender, servir o construir una primera
                oferta.
              </p>
            </div>
            <a className="vayuda__action" href="/para-negocios" onClick={irA('negocios')}>
              Ver opciones para negocios
              <FiArrowRight aria-hidden="true" />
            </a>
          </li>

          <li className="vayuda__ruta">
            <span className="vayuda__ruta-icon">{IconoOrientacion}</span>
            <div className="vayuda__ruta-text">
              <h3 className="vayuda__ruta-title">Necesito ayuda antes de decidir</h3>
              <p className="vayuda__ruta-desc">
                Cuéntanos qué necesitas y te orientaremos sobre referencias, tamaños y
                cantidades.
              </p>
            </div>
            <a className="vayuda__action" href="/contacto" onClick={irA('contacto')}>
              Recibir orientación
              <FiArrowRight aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <p className="vayuda__note">
        <span className="vayuda__note-icon">
          <FiInfo aria-hidden="true" />
        </span>
        Puedes seguir explorando el catálogo y ajustar tu carrito antes de enviar el
        pedido.
      </p>
    </section>
  );
}

export default VitrinaAyuda;
