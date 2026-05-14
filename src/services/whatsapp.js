const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net'; //import.meta.env.VITE_API_BASE_URL || '';
const API_USERNAME = 'admin';
const API_PASSWORD = 'Admin@DLujo2025!';

function getAuthHeaders() {
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
  return {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export async function sendOrderViaWhatsAppAPI(cartItems, totalPrice, buyerInfo = {}) {
  const { nombre = 'Cliente', contacto = '---', tipoPago = 'Efectivo' } = buyerInfo;
  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  const productsList = cartItems
    .map((item) => `${item.quantity}x ${item.name} (${item.flavor})`)
    .join(' - ');

  const body = {
    template: {
      name: 'enviar_orden',
      language: {
        code: 'en',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: String(orderNumber) },
            { type: 'text', text: formatPrice(totalPrice) },
            { type: 'text', text: `${nombre} - ${contacto} - ${tipoPago}` },
            { type: 'text', text: productsList },
          ],
        },
      ],
    },
  };

  console.log('[WhatsApp] Enviando pedido...', { body });

  const response = await fetch(`${API_BASE_URL}/api/whatsapp/send_message`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('[WhatsApp] Error en la respuesta:', {
      status: response.status,
      statusText: response.statusText,
      responseData,
    });
    const errorMsg = responseData?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Error al enviar pedido por WhatsApp: ${errorMsg}`);
  }

  console.log('[WhatsApp] ✅ Mensaje enviado exitosamente:', responseData);
  return responseData;
}
