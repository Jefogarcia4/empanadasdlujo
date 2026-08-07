import {
  FiShoppingCart,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiBox,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { WHOLESALE_THRESHOLD } from '../config/constants';
import { buildCartProgress } from '../utils/cartProgress';
import '../styles/CartProgress.css';

const ICONS = {
  cart: <FiShoppingCart aria-hidden="true" />,
  box: <FiPackage aria-hidden="true" />,
  bag: <FiShoppingBag aria-hidden="true" />,
  star: <FiStar aria-hidden="true" />,
  tag: <FiTag aria-hidden="true" />,
  combo: <FiBox aria-hidden="true" />,
};

// Estado de compra y progreso hacia el precio mayorista. Se usa en el carrito
// lateral y en la página de carrito: misma fuente de datos, misma lectura.
// `onSeguir` agrega una acción para volver al catálogo (opcional).
function CartProgress({ onSeguir }) {
  const { eligiblePackages, comboUnits } = useCart();
  const p = buildCartProgress({ eligiblePackages, comboUnits });

  return (
    <section className={`cprog cprog--${p.tone}`} aria-label="Progreso hacia el precio mayorista">
      <header className="cprog__head">
        <span className="cprog__icon">{ICONS[p.icon]}</span>
        <div className="cprog__headline">
          <h4 className="cprog__title" aria-live="polite">
            {p.title}
          </h4>
          <p className="cprog__desc">{p.desc}</p>
        </div>
      </header>

      <div className="cprog__rows">
        <div className="cprog__row">
          <span className="cprog__label">Compra mínima</span>
          <p className={`cprog__min${p.minMet ? ' is-ok' : ''}`}>
            <span className="cprog__mark" aria-hidden="true">
              {p.minMet && <FiCheck />}
            </span>
            {p.minLabel}
          </p>
        </div>

        <div className="cprog__row">
          <span className="cprog__label">Progreso mayorista</span>
          <p className="cprog__count">{p.progressLabel}</p>

          <div
            className="cprog__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={WHOLESALE_THRESHOLD}
            aria-valuenow={Math.min(p.packages, WHOLESALE_THRESHOLD)}
            aria-valuetext={p.progressLabel}
          >
            <span className="cprog__bar-fill" style={{ width: `${p.progressPct}%` }} />
          </div>

          <p className="cprog__msg">{p.progressMsg}</p>
        </div>
      </div>

      {p.comboNote && (
        <p className="cprog__combo">
          <FiTag aria-hidden="true" />
          <span>{p.comboNote}</span>
        </p>
      )}

      {onSeguir && !p.wholesaleMet && (
        <button type="button" className="cprog__cta" onClick={onSeguir}>
          Agregar más productos
          <FiArrowRight aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

export default CartProgress;
