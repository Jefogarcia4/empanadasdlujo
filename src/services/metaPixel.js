const CURRENCY = 'COP';

function fbq(...args) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq(...args);
  } catch (err) {
    console.warn('[MetaPixel] error:', err);
  }
}

export function trackAddToCart(product) {
  if (!product) return;
  fbq('track', 'AddToCart', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: Number(product.price) || 0,
    currency: CURRENCY,
  });
}

export function trackPurchase(cartItems, totalPrice, orderId) {
  const items = Array.isArray(cartItems) ? cartItems : [];
  fbq('track', 'Purchase', {
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
  });
}
