import { useEffect, useRef, useState } from 'react';
import { FiPackage, FiTag, FiCalendar, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { MIN_PACKAGES, WHOLESALE_THRESHOLD, DELIVERY_FEE } from '../config/constants';

// Franja de condiciones de compra entre la portada de la vitrina y el buscador.
// Avanza sola, de a una tarjeta, con la misma cadencia del banner del header.

const AVANCE_MS = 4500;

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const IconoCongelado = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="2" x2="22" y1="12" y2="12" />
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="m20 16-4-4 4-4" />
    <path d="m4 8 4 4-4 4" />
    <path d="m16 4-4 4-4-4" />
    <path d="m8 20 4-4 4 4" />
  </svg>
);

const CONDICIONES = [
  {
    key: 'minima',
    icon: <FiPackage aria-hidden="true" />,
    title: `Compra desde ${MIN_PACKAGES} paquetes`,
    desc: 'Combina referencias del portafolio para completar la compra mínima.',
  },
  {
    key: 'mayorista',
    icon: <FiTag aria-hidden="true" />,
    title: `Mayorista desde ${WHOLESALE_THRESHOLD} paquetes combinados`,
    desc: 'Combina paquetes individuales elegibles y se aplican los precios mayoristas.',
  },
  {
    key: 'despachos',
    icon: <FiCalendar aria-hidden="true" />,
    title: 'Programación y despachos',
    desc: 'Pide con mínimo 1 día de anticipación. Despachamos de lunes a sábado.',
  },
  {
    key: 'cobertura',
    icon: <FiMapPin aria-hidden="true" />,
    title: 'Cobertura en el Valle de Aburrá',
    desc: `Desde Copacabana hasta La Estrella. Domicilio: ${formatPrice(DELIVERY_FEE)}.`,
  },
  {
    key: 'pago',
    icon: <FiCreditCard aria-hidden="true" />,
    title: 'Formas de pago',
    desc: 'Transferencia o efectivo, según la modalidad que elijas al confirmar.',
  },
  {
    key: 'congelado',
    icon: IconoCongelado,
    title: 'Producto congelado',
    desc: 'Consérvalo a −18 °C y sigue las instrucciones indicadas en el empaque.',
  },
];

// Distancia de una tarjeta a la siguiente (incluye el gap real del layout).
function paso(track) {
  const cards = track.children;
  if (cards.length < 2) return track.clientWidth;
  return cards[1].offsetLeft - cards[0].offsetLeft;
}

function totalPosiciones(track) {
  const s = paso(track);
  if (!s) return 1;
  return Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / s) + 1);
}

function VitrinaCondiciones() {
  const trackRef = useRef(null);
  const pausadoRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [posiciones, setPosiciones] = useState(1);

  const sinMovimiento =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Las posiciones dependen de cuántas tarjetas caben: se recalculan con el ancho.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setPosiciones(totalPosiciones(track)));
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (sinMovimiento) return undefined;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || pausadoRef.current) return;
      const s = paso(track);
      const fin = track.scrollWidth - track.clientWidth;
      const siguiente = track.scrollLeft + s > fin - 4 ? 0 : track.scrollLeft + s;
      track.scrollTo({ left: siguiente, behavior: 'smooth' });
    }, AVANCE_MS);
    return () => window.clearInterval(id);
  }, [sinMovimiento]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const s = paso(track);
    if (s) setIndex(Math.round(track.scrollLeft / s));
  };

  const irA = (i) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * paso(track), behavior: 'smooth' });
  };

  const pausar = () => {
    pausadoRef.current = true;
  };
  const reanudar = () => {
    pausadoRef.current = false;
  };

  return (
    <section
      className="vcond"
      aria-label="Condiciones de compra"
      onMouseEnter={pausar}
      onMouseLeave={reanudar}
      onFocusCapture={pausar}
      onBlurCapture={reanudar}
      onTouchStart={pausar}
      onTouchEnd={reanudar}
    >
      <ul
        className="vcond__track"
        ref={trackRef}
        onScroll={handleScroll}
        tabIndex={0}
        role="group"
        aria-label="Condiciones de compra, desplazable"
      >
        {CONDICIONES.map((c) => (
          <li key={c.key} className="vcond__card">
            <span className="vcond__icon">{c.icon}</span>
            <div className="vcond__text">
              <h3 className="vcond__title">{c.title}</h3>
              <p className="vcond__desc">{c.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      {posiciones > 1 && (
        <div className="vcond__dots">
          {Array.from({ length: posiciones }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`vcond__dot${i === index ? ' is-active' : ''}`}
              onClick={() => irA(i)}
              aria-label={`Ver condiciones ${i + 1} de ${posiciones}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default VitrinaCondiciones;
