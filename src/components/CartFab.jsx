import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

function CartFab() {
  const { totalItems, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const prevTotal = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 500);
      prevTotal.current = totalItems;
      return () => clearTimeout(t);
    }
    prevTotal.current = totalItems;
  }, [totalItems]);

  return (
    <button
      type="button"
      className={`cart-fab${bump ? ' cart-fab--bump' : ''}`}
      onClick={openCart}
      aria-label={`Abrir carrito${totalItems > 0 ? ` (${totalItems} productos)` : ''}`}
    >
      <svg
        className="cart-fab__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.6" />
        <circle cx="17" cy="20" r="1.6" />
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
      </svg>
      {totalItems > 0 && (
        <span className={`cart-fab__badge${bump ? ' cart-fab__badge--bump' : ''}`}>
          {totalItems}
        </span>
      )}
    </button>
  );
}

export default CartFab;
