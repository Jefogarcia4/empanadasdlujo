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

const buildProductsList = (cartItems) =>
  cartItems
    .map((item) => {
      // Los combos no llevan gramaje por unidad; se etiquetan como "Combo".
      const details = item.isCombo
        ? item.subcategory || 'Combo'
        : [item.flavor, formatWeight(item.weight)].filter(Boolean).join(', ');
      return `${item.quantity}x ${item.name}${details ? ` (${details})` : ''}`;
    })
    .join(' - ');

// WhatsApp exige formato E.164 sin '+'. El formulario captura 10 dígitos (Colombia),
// por lo que anteponemos el indicativo 57 cuando aplica.
const formatPhoneForWhatsApp = (telefono) => {
  const digits = String(telefono ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `57${digits}`;
  return digits; // ya incluye indicativo u otro formato
};

async function postWhatsAppMessage(body, logLabel = 'mensaje') {
  console.log(`[WhatsApp] Enviando ${logLabel}...`, { body });

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
    throw new Error(`Error al enviar ${logLabel} por WhatsApp: ${errorMsg}`);
  }

  console.log(`[WhatsApp] ✅ ${logLabel} enviado exitosamente:`, responseData);
  return responseData;
}

export async function sendOrderViaWhatsAppAPI(cartItems, totalPrice, buyerInfo = {}, orderId = null) {
  const orderNumber = orderId ?? Math.floor(Math.random() * 900000) + 100000;

  const productsList = buildProductsList(cartItems);

  const body = {
    idOrden: orderId ?? null,
    tipo: 'NEGOCIO',
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

  return postWhatsAppMessage(body, 'pedido');
}

// Idioma de la plantilla en Meta. Debe coincidir EXACTAMENTE con el configurado allí.
const CLIENT_TEMPLATE_LANGUAGE = 'es_CO';

// Envía la confirmación del pedido al WhatsApp del comprador (no al número por defecto).
export async function sendOrderConfirmationToClient(cartItems, totalPrice, buyerInfo = {}, orderId = null) {
  const to = formatPhoneForWhatsApp(buyerInfo.telefono);
  if (!to) {
    console.warn('[WhatsApp] No se envió confirmación al cliente: teléfono inválido o vacío.');
    return null;
  }

  const orderNumber = orderId ?? Math.floor(Math.random() * 900000) + 100000;
  const nombreCliente =
    `${buyerInfo.nombre ?? ''} ${buyerInfo.apellidos ?? ''}`.trim() || 'Cliente';
  const productsList = buildProductsList(cartItems);
  const metodoEntrega = buyerInfo.tipoEntrega || 'Domicilio';

  const body = {
    to, // cambia el destinatario al teléfono del formulario de la venta
    idOrden: orderId ?? null,
    tipo: 'CLIENTE',
    template: {
      name: 'confirmacion_pedido_cliente',
      language: {
        code: CLIENT_TEMPLATE_LANGUAGE,
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: nombreCliente }, // {{1}} nombre
            { type: 'text', text: String(orderNumber) }, // {{2}} N° de pedido
            { type: 'text', text: productsList }, // {{3}} productos
            { type: 'text', text: formatPrice(totalPrice) }, // {{4}} total
            { type: 'text', text: buyerInfo.tipoPago || 'Efectivo' }, // {{5}} método de pago
            { type: 'text', text: metodoEntrega }, // {{6}} método de entrega
          ],
        },
      ],
    },
  };

  return postWhatsAppMessage(body, 'confirmación al cliente');
}
