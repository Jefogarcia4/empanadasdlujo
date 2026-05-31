import { useCart } from '../context/CartContext';

function Cart({ onNavigate }) {
  const {
    cartItemsPricing,
    isCartOpen,
    closeCart,
    updateQuantity,
    subtotal,
    discount,
    totalToPay,
    hasDiscount,
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
          {cartItemsPricing.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Tu carrito está vacío</p>
              <p>¡Agrega algunas deliciosas empanadas!</p>
            </div>
          ) : (
            cartItemsPricing.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image || '/pollo_carne.jpg'} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-flavor">{item.flavor}</p>
                  <p className="cart-item-price">
                    {item.appliesWholesale && (
                      <span className="cart-item-price-old">
                        {formatPrice(item.lineRetail)}
                      </span>
                    )}
                    <span className="cart-item-price-current">
                      {formatPrice(item.lineTotal)}
                    </span>
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

        {cartItemsPricing.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals">
              <div className="cart-totals-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {hasDiscount && (
                <div className="cart-totals-row cart-totals-row--discount">
                  <span>Descuento mayorista</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="cart-totals-row cart-totals-row--total">
                <span>Total a pagar</span>
                <span>{formatPrice(totalToPay)}</span>
              </div>
            </div>

            <button
              className="checkout-btn whatsapp-btn"
              onClick={handleCheckout}
            >
              📋 Ir a pagar
            </button>
            <button
              className="checkout-btn"
              style={{ marginTop: '0.75rem', background: 'transparent', border: '2px solid #ffb21b', color: '#ffb21b' }}
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
