import { useCart } from '../context/CartContext';

function Cart({ onNavigate }) {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductIcon = (category) => {
    switch (category) {
      case 'Empanadas':
        return '🥟';
      case 'Pasteles':
        return '🥧';
      case 'Masa':
        return '🌽';
      default:
        return '🍽️';
    }
  };

  const handleCheckout = () => {
    closeCart();
    onNavigate('cart');
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={closeCart}
      />
      <aside className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>🛒 Tu Pedido</h3>
          <button className="close-cart-btn" onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Tu carrito está vacío</p>
              <p>¡Agrega algunas deliciosas empanadas!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {getProductIcon(item.category)}
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-flavor">{item.flavor}</p>
                  <p className="cart-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-value">{formatPrice(totalPrice)}</span>
            </div>

            <button
              className="checkout-btn whatsapp-btn"
              onClick={handleCheckout}
            >
              📋 Proceder al pedido
            </button>
            <button
              className="checkout-btn"
              style={{ marginTop: '0.75rem', background: 'transparent', border: '2px solid #800302', color: '#800302' }}
              onClick={clearCart}
            >
              🗑️ Vaciar Carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
