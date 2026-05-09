const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const TOKEN =  "EAAQHnEipmXwBRVBNn8gM9XMs8HmuWlgDunDlVI1JAapGWpCa5YsGPkrDKU9mJEEM47dO6NPvI8bNSCS2pkZCXC6wgiDzYC5vq4tFLjVHZBirrHA9CmhPhZCmCHRV0tYFVu4Idgs5Hf7NG0MavZArZAp1wWwHptP2kDeAoTTr3OkpC3Xb0dxBN0WnWc8KmjeHf" //import.meta.env.VITE_WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1095633610301436" //import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const RECIPIENT = "573046028579" //import.meta.env.VITE_WHATSAPP_RECIPIENT_NUMBER;

function buildOrderMessage(cartItems, totalPrice) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const lines = cartItems.map(
    (item) =>
      `• ${item.quantity}x ${item.name} (${item.flavor}) - ${formatPrice(item.price * item.quantity)}`
  );

  return [
    '*Nuevo pedido - Empanadas D\' Lujo*',
    '',
    ...lines,
    '',
    `*Total: ${formatPrice(totalPrice)}*`,
    '',
    '_Pedido recibido desde la tienda online_',
  ].join('\n');
}

export async function sendOrderViaWhatsAppAPI(cartItems, totalPrice) {
  if (!TOKEN || !PHONE_NUMBER_ID || !RECIPIENT) {
    throw new Error('Faltan variables de entorno de WhatsApp (VITE_WHATSAPP_TOKEN, VITE_WHATSAPP_PHONE_NUMBER_ID, VITE_WHATSAPP_RECIPIENT_NUMBER)');
  }

  const body = {
    messaging_product: 'whatsapp',
    to: RECIPIENT,
    type: 'text',
    text: {
      body: buildOrderMessage(cartItems, totalPrice),
    },
  };

  console.log('[WhatsApp] Enviando pedido...', {
    phoneNumberId: PHONE_NUMBER_ID,
    recipient: RECIPIENT,
    url: `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    body,
  });

  const response = await fetch(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

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
