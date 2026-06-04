import { useCart } from '../context/CartContext';

function Cart({ onNavigate }) {
  const {
    cartItemsPricing,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    deliveryFee,
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

  const isEmpty = cartItemsPricing.length === 0;

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
      />
      <aside
        className={`cart-modal ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
      >
        {/* ── Encabezado ── */}
        <div className="cart-modal__header">
          <div className="cart-modal__logo">
            <img src="/fondo_menu.png" alt="Empanadas D'lujo" />
          </div>
          <div className="cart-modal__heading">
            <h3 className="cart-modal__title">
              Tu pedido <span>D'lujo</span>
            </h3>
            <p className="cart-modal__subtitle">Revisa tus productos antes de pagar</p>
          </div>
          <button className="cart-modal__close" onClick={closeCart} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* ── Cuerpo ── */}
        <div className="cart-modal__body">
          {isEmpty ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Tu carrito está vacío</p>
              <p>¡Agrega algunas deliciosas empanadas!</p>
            </div>
          ) : (
            <>
              <div className="cart-modal__items">
                {cartItemsPricing.map((item) => (
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
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      🗑️
                    </button>
                    <div className="cart-item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="cart-modal__continue" onClick={closeCart}>
                <span className="cart-modal__continue-icon" aria-hidden="true">🧺</span>
                <span>Seguir comprando</span>
                <span className="cart-modal__continue-arrow" aria-hidden="true">›</span>
              </button>

              <div className="cart-modal__trust">
                <div className="cart-modal__trust-item">
                  <span className="cart-modal__trust-icon" aria-hidden="true">❄️</span>
                  <span>Producto congelado listo para freír</span>
                </div>
                <div className="cart-modal__trust-item">
                  <span className="cart-modal__trust-icon" aria-hidden="true">🛡️</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="cart-modal__trust-item">
                  <span className="cart-modal__trust-icon" aria-hidden="true">🚚</span>
                  <span>Despacho en Medellín y área</span>
                </div>
              </div>

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
                <div className="cart-totals-row">
                  <span>Valor domicilio</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="cart-totals-row cart-totals-row--total">
                  <span>Total a pagar</span>
                  <span>{formatPrice(totalToPay)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Pie / acciones ── */}
        {!isEmpty && (
          <div className="cart-modal__footer">
            <button className="checkout-btn" onClick={handleCheckout}>
              <span className="checkout-btn__icon" aria-hidden="true">🔒</span>
              Finalizar compra
            </button>
            <button className="cart-clear-btn" onClick={clearCart}>
              <span aria-hidden="true">🗑️</span> Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
