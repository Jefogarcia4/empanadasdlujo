import { useCart } from '../context/CartContext';

/* ── Iconos de línea (estilo de la maqueta) ── */
const Icon = ({ children, size = 22, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const TrashIcon = (props) => (
  <Icon {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </Icon>
);

const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

const BasketIcon = (props) => (
  <Icon {...props}>
    <path d="m15 11-1 9" />
    <path d="m19 11-4-7" />
    <path d="M2 11h20" />
    <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
    <path d="m5 11 4-7" />
    <path d="m9 11 1 9" />
  </Icon>
);

const ChevronIcon = (props) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

const SnowflakeIcon = (props) => (
  <Icon {...props}>
    <line x1="2" x2="22" y1="12" y2="12" />
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="m20 16-4-4 4-4" />
    <path d="m4 8 4 4-4 4" />
    <path d="m16 4-4 4-4-4" />
    <path d="m8 20 4-4 4 4" />
  </Icon>
);

const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

const TruckIcon = (props) => (
  <Icon {...props}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Icon>
);

const LockIcon = (props) => (
  <Icon {...props}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

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
            <CloseIcon size={20} />
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
                      <TrashIcon size={22} />
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
                <BasketIcon size={18} className="cart-modal__continue-icon" />
                <span>Seguir comprando</span>
                <ChevronIcon size={18} className="cart-modal__continue-arrow" />
              </button>

              <div className="cart-modal__trust">
                <div className="cart-modal__trust-item">
                  <SnowflakeIcon size={26} className="cart-modal__trust-icon" />
                  <span>Producto congelado listo para freír</span>
                </div>
                <div className="cart-modal__trust-item">
                  <ShieldIcon size={26} className="cart-modal__trust-icon" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="cart-modal__trust-item">
                  <TruckIcon size={26} className="cart-modal__trust-icon" />
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
              <span className="checkout-btn__icon" aria-hidden="true">
                <LockIcon size={16} />
              </span>
              Finalizar compra
            </button>
            <button className="cart-clear-btn" onClick={clearCart}>
              <TrashIcon size={20} />
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Cart;
