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

const formatWeight = (weight) => {
  if (!weight) return '';
  return weight >= 1000 ? `${weight / 1000}kg` : `${weight}g`;
};

function buildClientSummary(buyerInfo) {
  const {
    nombre = '',
    apellidos = '',
    telefono = '',
    email = '',
    direccion = '',
    casaApartamento = '',
    ciudad = '',
    departamento = '',
    codigoPostal = '',
    pais = 'Colombia',
    tipoPago = 'Efectivo',
  } = buyerInfo;

  const nombreCompleto = `${nombre} ${apellidos}`.trim() || 'Cliente';

  const direccionCompleta = [direccion, casaApartamento, ciudad, departamento, codigoPostal, pais]
    .filter((part) => part && String(part).trim().length > 0)
    .join(', ');

  const contacto = [telefono, email].filter(Boolean).join(' / ') || '---';

  return `${nombreCompleto} | ${contacto} | ${direccionCompleta} | Pago: ${tipoPago}`;
}

export async function sendOrderViaWhatsAppAPI(cartItems, totalPrice, buyerInfo = {}, orderId = null) {
  const orderNumber = orderId ?? Math.floor(Math.random() * 900000) + 100000;

  const productsList = cartItems
    .map((item) => {
      const weight = formatWeight(item.weight);
      const details = [item.flavor, weight].filter(Boolean).join(', ');
      return `${item.quantity}x ${item.name}${details ? ` (${details})` : ''}`;
    })
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
            { type: 'text', text: buildClientSummary(buyerInfo) },
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
