const CURRENCY = 'COP';

function fbq(...args) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq(...args);
  } catch (err) {
    console.warn('[MetaPixel] error:', err);
  }
}

export function trackAddToCart(product, quantity = 1) {
  if (!product) return;
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const unitPrice = Number(product.price) || 0;
  fbq('track', 'AddToCart', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    contents: [{ id: String(product.id), quantity: qty, item_price: unitPrice }],
    num_items: qty,
    value: unitPrice * qty,
    currency: CURRENCY,
  });
}

function buildOrderPayload(cartItems, totalPrice, orderId) {
  const items = Array.isArray(cartItems) ? cartItems : [];
  return {
    content_ids: items.map((it) => String(it.id)),
    content_type: 'product',
    contents: items.map((it) => ({
      id: String(it.id),
      quantity: it.quantity,
      item_price: Number(it.effectivePrice ?? it.price) || 0,
    })),
    num_items: items.reduce((sum, it) => sum + (it.quantity || 0), 0),
    value: Number(totalPrice) || 0,
    currency: CURRENCY,
    order_id: orderId ? String(orderId) : undefined,
  };
}

// Pedido solicitado (pendiente, aún sin pago). Reservamos Purchase para pedidos pagados.
export function trackLead(cartItems, totalPrice, orderId) {
  fbq('track', 'Lead', buildOrderPayload(cartItems, totalPrice, orderId));
}

export function trackPurchase(cartItems, totalPrice, orderId) {
  fbq('track', 'Purchase', buildOrderPayload(cartItems, totalPrice, orderId));
}
