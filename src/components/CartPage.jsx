import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { sendOrderViaWhatsAppAPI } from '../services/whatsapp';
import '../styles/CartPage.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

function CartPage({ onNavigate }) {
  const { cartItems, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();

  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    comentarios: '',
    tipoPago: 'Efectivo',
  });

  const [orderStatus, setOrderStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setOrderStatus('sending');
    try {
      await sendOrderViaWhatsAppAPI(cartItems, totalPrice, form);
      setOrderStatus('success');
      clearCart();
      setTimeout(() => {
        setOrderStatus('idle');
        onNavigate('tienda');
      }, 3000);
    } catch (err) {
      console.error(err);
      setOrderStatus('error');
      setTimeout(() => setOrderStatus('idle'), 4000);
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-page__header">
        <button className="cart-page__back" onClick={() => onNavigate('tienda')}>
          ← Volver a la tienda
        </button>
        <h2 className="cart-page__title">Tu Pedido</h2>
      </div>

      <div className="cart-page__body">
        {/* ── Columna izquierda: formulario ── */}
        <section className="cart-page__form-col">
          <h3>Datos del pedido</h3>
          <form className="cart-form" onSubmit={handleSubmit}>
            <div className="cart-form__group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cart-form__group">
              <label htmlFor="contacto">Contacto (teléfono o correo)</label>
              <input
                id="contacto"
                name="contacto"
                type="text"
                placeholder="3100000000"
                value={form.contacto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cart-form__group">
              <label htmlFor="comentarios">Comentarios</label>
              <textarea
                id="comentarios"
                name="comentarios"
                placeholder="Instrucciones adicionales, dirección de entrega, etc."
                value={form.comentarios}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="cart-form__group">
              <label>Método de pago</label>
              <div className="cart-form__radio-group">
                <label className={`cart-form__radio-label${form.tipoPago === 'Efectivo' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="Efectivo"
                    checked={form.tipoPago === 'Efectivo'}
                    onChange={handleChange}
                  />
                  💵 Efectivo
                </label>
                <label className={`cart-form__radio-label${form.tipoPago === 'Transferencia' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="tipoPago"
                    value="Transferencia"
                    checked={form.tipoPago === 'Transferencia'}
                    onChange={handleChange}
                  />
                  🏦 Transferencia
                </label>
              </div>
            </div>

            {orderStatus === 'success' && (
              <div className="cart-status cart-status--success">
                ✅ ¡Pedido enviado! Te contactaremos pronto.
              </div>
            )}
            {orderStatus === 'error' && (
              <div className="cart-status cart-status--error">
                ❌ Error al enviar el pedido. Intenta de nuevo.
              </div>
            )}

            <button
              type="submit"
              className="cart-submit-btn"
              disabled={cartItems.length === 0 || orderStatus === 'sending'}
            >
              {orderStatus === 'sending' ? '⏳ Enviando...' : '📲 Enviar pedido por WhatsApp'}
            </button>
          </form>
        </section>

        {/* ── Columna derecha: productos ── */}
        <section className="cart-page__items-col">
          <h3>Productos</h3>
          {cartItems.length === 0 ? (
            <div className="cart-page__empty">
              <p>🛒 Tu carrito está vacío.</p>
              <button className="cart-page__go-store" onClick={() => onNavigate('tienda')}>
                Ir a la tienda
              </button>
            </div>
          ) : (
            <>
              <ul className="cart-page__list">
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-page__item">
                    <img
                      className="cart-page__item-icon"
                      src={item.image || '/pollo_carne.jpg'}
                      alt={item.name}
                    />
                    <div className="cart-page__item-info">
                      <span className="cart-page__item-name">{item.name}</span>
                      <span className="cart-page__item-flavor">{item.flavor}</span>
                    </div>
                    <div className="cart-page__item-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="cart-page__item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      className="cart-page__item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-page__total">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default CartPage;
