import { useEffect, useState } from 'react';
import {
  FaSnowflake,
  FaMedal,
  FaHeart,
  FaMotorcycle,
  FaCookieBite,
  FaStar,
} from 'react-icons/fa';
import { fetchCombos } from '../services/api';
import ComboCard from './ComboCard';
import '../styles/Combos.css';

// Sección de combos: los muestra como tarjetas agregables al carrito. Se usa
// tanto en la vitrina como en el catálogo. Si no recibe la prop `combos` carga
// los combos activos por su cuenta (modo autocontenido).
const FEATURES = [
  { icon: <FaSnowflake />, text: 'Productos congelados listos para freír' },
  { icon: <FaMedal />, text: 'Hechos con ingredientes de alta calidad' },
  { icon: <FaHeart />, text: 'Sabor casero que encanta' },
  { icon: <FaMotorcycle />, text: 'Despachos en Medellín y área metropolitana' },
];

function CombosShowcase({
  title = 'Combos Especiales',
  titleAccent = 'para Empezar',
  subtitle = 'Ideales para tu hogar o negocio. Ahorra más.',
  description,
  combos: combosProp,
  loading: loadingProp = false,
}) {
  const controlado = combosProp !== undefined;
  const [fetched, setFetched] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    if (controlado) return undefined;
    let mounted = true;
    fetchCombos()
      .then((data) => {
        if (mounted) {
          setFetched(data);
          setFetchStatus('ready');
        }
      })
      .catch(() => mounted && setFetchStatus('error'));
    return () => {
      mounted = false;
    };
  }, [controlado]);

  const combos = controlado ? combosProp : fetched;
  let status = fetchStatus;
  if (controlado) status = loadingProp ? 'loading' : 'ready';

  if (status === 'error') return null;
  if (status === 'ready' && combos.length === 0) return null;

  return (
    <section className="combos-showcase">
      <div className="combos-showcase__header">
        <span className="combos-showcase__emoji" aria-hidden="true"><FaCookieBite /></span>
        <h2 className="combos-showcase__title">
          <span className="combos-showcase__title-accent">{title}</span>{' '}
          {titleAccent}
        </h2>
        <p className="combos-showcase__subtitle">
          <FaStar className="combos-showcase__star" aria-hidden="true" />
          {subtitle}
          <FaStar className="combos-showcase__star" aria-hidden="true" />
        </p>
        {description && <p className="combos-showcase__desc">{description}</p>}
      </div>

      {status === 'loading' ? (
        <p className="combos-showcase__status">Cargando combos...</p>
      ) : (
        <>
          <div className="combos-showcase__grid">
            {combos.map((combo, i) => (
              <ComboCard key={combo.id} combo={combo} index={i} />
            ))}
          </div>

          <div className="combos-showcase__features">
            {FEATURES.map((f) => (
              <div key={f.text} className="combos-feature">
                <span className="combos-feature__icon" aria-hidden="true">{f.icon}</span>
                <span className="combos-feature__text">{f.text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default CombosShowcase;
