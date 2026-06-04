import { useEffect, useState } from 'react';
import { fetchCombos } from '../services/api';
import ComboCard from './ComboCard';
import '../styles/Combos.css';

// Sección autocontenida: carga los combos activos y los muestra como tarjetas
// agregables al carrito. Se usa tanto en la vitrina como en el catálogo.
function CombosShowcase({
  title = 'Combos para empezar',
  subtitle = 'Empieza fácil, ahorra más',
  description,
}) {
  const [combos, setCombos] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let mounted = true;
    fetchCombos()
      .then((data) => {
        if (mounted) {
          setCombos(data);
          setStatus('ready');
        }
      })
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'error') return null;
  if (status === 'ready' && combos.length === 0) return null;

  return (
    <section className="combos-showcase">
      <div className="combos-showcase__header">
        <h2 className="combos-showcase__title">{title}</h2>
        <p className="combos-showcase__subtitle">{subtitle}</p>
        {description && <p className="combos-showcase__desc">{description}</p>}
      </div>

      {status === 'loading' ? (
        <p className="combos-showcase__status">Cargando combos...</p>
      ) : (
        <div className="combos-showcase__grid">
          {combos.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CombosShowcase;
