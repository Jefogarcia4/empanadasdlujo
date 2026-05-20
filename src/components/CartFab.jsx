import { useCart } from '../context/CartContext';

function CartFab() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      className="cart-fab"
      onClick={openCart}
      aria-label={`Abrir carrito${totalItems > 0 ? ` (${totalItems} productos)` : ''}`}
    >
      <span className="cart-fab__icon" aria-hidden="true">🛒</span>
      {totalItems > 0 && <span className="cart-fab__badge">{totalItems}</span>}
    </button>
  );
}

export default CartFab;
