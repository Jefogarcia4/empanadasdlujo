import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { sendOrderViaWhatsAppAPI, sendOrderConfirmationToClient } from '../services/whatsapp';
import { createPedido } from '../services/pedidos';
import { trackLead } from '../services/metaPixel';
import { fetchDepartamentosColombia, DEPARTAMENTOS_FALLBACK } from '../services/colombia';
import '../styles/CartPage.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

function CartPage({ onNavigate }) {
  const {
    cartItems,
    cartItemsPricing,
    subtotal,
    discount,
    deliveryFee,
    totalToPay,
    hasDiscount,
    clearCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [form, setForm] = useState({
    pais: 'Colombia',
    nombre: '',
    apellidos: '',
    direccion: '',
    casaApartamento: '',
    ciudad: '',
    departamento: 'Antioquia',
    codigoPostal: '',
    telefono: '',
    email: '',
    comentarios: '',
    tipoPago: 'Efectivo',
    guardarInfo: false,
  });

  const [departamentos, setDepartamentos] = useState(DEPARTAMENTOS_FALLBACK);
  const [orderStatus, setOrderStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    fetchDepartamentosColombia().then((deps) => {
      if (mounted && deps?.length) setDepartamentos(deps);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Limpia el error del campo a medida que el usuario lo corrige.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validateForm = () => {
    const newErrors = {};
    const required = {
      nombre: 'El nombre es obligatorio.',
      apellidos: 'Los apellidos son obligatorios.',
      direccion: 'La dirección es obligatoria.',
      ciudad: 'La ciudad es obligatoria.',
      telefono: 'El teléfono es obligatorio.',
      email: 'El email es obligatorio.',
    };

    Object.entries(required).forEach(([field, message]) => {
      if (!String(form[field] ?? '').trim()) newErrors[field] = message;
    });

    // Teléfono: celular colombiano (+57). Acepta el indicativo 57 opcional y
    // exige 10 dígitos que empiecen por 3 (formato de móvil en Colombia).
    if (!newErrors.telefono) {
      let telDigits = String(form.telefono ?? '').replace(/\D/g, '');
      // Permite que el usuario escriba el indicativo: 57 + 10 dígitos.
      if (telDigits.length === 12 && telDigits.startsWith('57')) {
        telDigits = telDigits.slice(2);
      }
      if (telDigits.length !== 10 || !telDigits.startsWith('3')) {
        newErrors.telefono =
          'Número de celular no válido. Debe ser un móvil colombiano (+57) de 10 dígitos que empiece por 3.';
      }
    }

    // Email: formato válido.
    if (!newErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Ingresa un email válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    setErrorMsg('');
    setOrderStatus('sending');
    try {
      const result = await createPedido({
        cliente: {
          nombre: form.nombre,
          apellidos: form.apellidos,
          telefono: form.telefono,
          email: form.email,
          direccion: form.direccion,
          casaApartamento: form.casaApartamento,
          ciudad: form.ciudad,
          departamento: form.departamento,
          codigoPostal: form.codigoPostal,
          pais: form.pais,
          guardarInfo: form.guardarInfo,
        },
        observaciones: form.comentarios,
        items: cartItems,
      });
      const pedidoId = result?.orden?.idOrden;
      try {
        await sendOrderViaWhatsAppAPI(cartItems, totalToPay, form, pedidoId);
      } catch (waErr) {
        console.warn('WhatsApp notification failed, order still saved:', waErr);
      }
      try {
        await sendOrderConfirmationToClient(cartItems, totalToPay, form, pedidoId);
      } catch (waErr) {
        console.warn('WhatsApp client confirmation failed, order still saved:', waErr);
      }
      // Pedido pendiente: registramos Lead, no Purchase (Purchase = pedido pagado).
      trackLead(cartItemsPricing, totalToPay, pedidoId);
      setOrderStatus('success');
      clearCart();
      if (pedidoId) {
        onNavigate('pedido_detail', { pedidoId });
      } else {
        setTimeout(() => {
          setOrderStatus('idle');
          onNavigate('tienda');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || '');
      setOrderStatus('error');
      setTimeout(() => setOrderStatus('idle'), 6000);
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
          <h3>Entrega</h3>
          <form className="cart-form" onSubmit={handleSubmit} noValidate>
            {/* País */}
            <div className="cart-form__group cart-form__group--floating">
              <select
                id="pais"
                name="pais"
                value={form.pais}
                onChange={handleChange}
                required
              >
                <option value="Colombia">Colombia</option>
              </select>
              <label htmlFor="pais">País / Región</label>
            </div>

            {/* Nombre + Apellidos */}
            <div className="cart-form__row">
              <div className={`cart-form__group cart-form__group--floating${errors.nombre ? ' cart-form__group--error' : ''}`}>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder=" "
                  value={form.nombre}
                  onChange={handleChange}
                />
                <label htmlFor="nombre">Nombre</label>
                {errors.nombre && <span className="cart-form__field-error">{errors.nombre}</span>}
              </div>

              <div className={`cart-form__group cart-form__group--floating${errors.apellidos ? ' cart-form__group--error' : ''}`}>
                <input
                  id="apellidos"
                  name="apellidos"
                  type="text"
                  placeholder=" "
                  value={form.apellidos}
                  onChange={handleChange}
                />
                <label htmlFor="apellidos">Apellidos</label>
                {errors.apellidos && <span className="cart-form__field-error">{errors.apellidos}</span>}
              </div>
            </div>

            {/* Dirección */}
            <div className={`cart-form__group cart-form__group--floating${errors.direccion ? ' cart-form__group--error' : ''}`}>
              <input
                id="direccion"
                name="direccion"
                type="text"
                placeholder=" "
                value={form.direccion}
                onChange={handleChange}
              />
              <label htmlFor="direccion">Dirección</label>
              {errors.direccion && <span className="cart-form__field-error">{errors.direccion}</span>}
            </div>

            {/* Casa, apartamento (opcional) */}
            <div className="cart-form__group cart-form__group--floating">
              <input
                id="casaApartamento"
                name="casaApartamento"
                type="text"
                placeholder=" "
                value={form.casaApartamento}
                onChange={handleChange}
              />
              <label htmlFor="casaApartamento">Casa, apartamento, etc. (opcional)</label>
            </div>

            {/* Ciudad + Departamento + Código postal */}
            <div className="cart-form__row cart-form__row--3">
              <div className={`cart-form__group cart-form__group--floating${errors.ciudad ? ' cart-form__group--error' : ''}`}>
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  placeholder=" "
                  value={form.ciudad}
                  onChange={handleChange}
                />
                <label htmlFor="ciudad">Ciudad</label>
                {errors.ciudad && <span className="cart-form__field-error">{errors.ciudad}</span>}
              </div>

              <div className="cart-form__group cart-form__group--floating">
                <select
                  id="departamento"
                  name="departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  required
                >
                  {departamentos.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label htmlFor="departamento">Provincia / Estado</label>
              </div>

              <div className="cart-form__group cart-form__group--floating">
                <input
                  id="codigoPostal"
                  name="codigoPostal"
                  type="text"
                  placeholder=" "
                  value={form.codigoPostal}
                  onChange={handleChange}
                />
                <label htmlFor="codigoPostal">Código postal (opcional)</label>
              </div>
            </div>

            {/* Teléfono */}
            <div className={`cart-form__group cart-form__group--floating${errors.telefono ? ' cart-form__group--error' : ''}`}>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder=" "
                value={form.telefono}
                onChange={handleChange}
              />
              <label htmlFor="telefono">Teléfono</label>
              {errors.telefono && <span className="cart-form__field-error">{errors.telefono}</span>}
            </div>

            {/* Email */}
            <div className={`cart-form__group cart-form__group--floating${errors.email ? ' cart-form__group--error' : ''}`}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
              />
              <label htmlFor="email">Email</label>
              {errors.email && <span className="cart-form__field-error">{errors.email}</span>}
            </div>

            {/* Comentarios */}
            <div className="cart-form__group">
              <label htmlFor="comentarios">Comentarios</label>
              <textarea
                id="comentarios"
                name="comentarios"
                placeholder="Instrucciones adicionales para la entrega."
                value={form.comentarios}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Método de pago */}
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

            <div className="cart-form__group cart-form__group--checkbox">
              <label className="cart-form__checkbox-label">
                <input
                  type="checkbox"
                  name="guardarInfo"
                  checked={form.guardarInfo}
                  onChange={handleChange}
                />
                <span>Deseo guardar mi información para futuras compras</span>
              </label>
            </div>

            {orderStatus === 'success' && (
              <div className="cart-status cart-status--success">
                ✅ ¡Pedido enviado! Te contactaremos pronto.
              </div>
            )}
            {orderStatus === 'error' && (
              <div className="cart-status cart-status--error">
                ❌ Error al enviar el pedido. Intenta de nuevo.
                {errorMsg && <div className="cart-status__detail">{errorMsg}</div>}
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
                {cartItemsPricing.map((item) => (
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
                      {item.appliesWholesale && (
                        <span className="cart-page__item-price-old">
                          {formatPrice(item.lineRetail)}
                        </span>
                      )}
                      <span className="cart-page__item-price-current">
                        {formatPrice(item.lineTotal)}
                      </span>
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

              <div className="cart-page__totals">
                <div className="cart-page__totals-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {hasDiscount && (
                  <div className="cart-page__totals-row cart-page__totals-row--discount">
                    <span>Descuento mayorista</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="cart-page__totals-row">
                  <span>Valor domicilio</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="cart-page__totals-row cart-page__totals-row--total">
                  <span>Total a pagar</span>
                  <span>{formatPrice(totalToPay)}</span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default CartPage;
