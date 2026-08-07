import { useEffect, useRef, useState } from 'react';
import {
  FiShoppingCart,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiBox,
  FiX,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
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

const VISIBLE_MS = 5000;

// Aviso flotante del progreso hacia el precio mayorista. Aparece cada vez que
// cambian las cantidades del carrito para que el cliente vea el avance sin
// abrir el carrito, y se oculta solo.
function CartProgressToast() {
  const { totalItems, eligiblePackages, comboUnits, isCartOpen, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const prevTotal = useRef(totalItems);
  const timerRef = useRef(null);

  useEffect(() => {
    const cambio = totalItems !== prevTotal.current;
    prevTotal.current = totalItems;
    if (!cambio || totalItems === 0) return;
    setVisible(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), VISIBLE_MS);
  }, [totalItems]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  if (totalItems === 0) return null;

  const p = buildCartProgress({ eligiblePackages, comboUnits });
  // Con el carrito abierto sobra: ahí ya está el detalle del pedido.
  const mostrar = visible && !isCartOpen;

  const cerrar = () => {
    window.clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div
      className={`cprog-toast cprog-toast--${p.tone}${mostrar ? ' is-visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        className="cprog-toast__body"
        onClick={openCart}
        tabIndex={mostrar ? 0 : -1}
      >
        <span className="cprog-toast__icon">{ICONS[p.icon]}</span>

        <span className="cprog-toast__text">
          <span className="cprog-toast__title">{p.short}</span>
          <span className="cprog-toast__bar">
            <span
              className="cprog-toast__bar-fill"
              style={{ width: `${p.progressPct}%` }}
            />
          </span>
          <span className="cprog-toast__count">{p.progressLabel}</span>
        </span>
      </button>

      <button
        type="button"
        className="cprog-toast__close"
        onClick={cerrar}
        aria-label="Ocultar aviso"
        tabIndex={mostrar ? 0 : -1}
      >
        <FiX aria-hidden="true" />
      </button>
    </div>
  );
}

export default CartProgressToast;
