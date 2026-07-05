import { getAuthToken, logout } from './auth';
import { sendOrderViaWhatsAppAPI, sendOrderConfirmationToClient } from './whatsapp';

const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net';

function authHeaders(extra = {}) {
  const token = getAuthToken();
  return {
    Authorization: `Basic ${token}`,
    ...extra,
  };
}

// Si el API responde 401 la sesión guardada ya no sirve: la limpiamos para
// forzar un nuevo login.
function handleUnauthorized() {
  logout();
  throw new Error('SESSION_EXPIRED');
}

export async function fetchOrdenes(estado) {
  const url = new URL(`${API_BASE_URL}/api/ordenes`);
  if (estado) url.searchParams.set('estado', estado);

  const response = await fetch(url, { headers: authHeaders() });
  if (response.status === 401) handleUnauthorized();
  if (!response.ok) {
    throw new Error(`No se pudieron cargar los pedidos: HTTP ${response.status}`);
  }
  return response.json();
}

export async function updateEstadoOrden(idOrden, estado) {
  const response = await fetch(`${API_BASE_URL}/api/ordenes/${idOrden}/estado`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ estado }),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const msg = data?.title || data?.message || `HTTP ${response.status}`;
    throw new Error(`No se pudo actualizar el estado: ${msg}`);
  }
  return true;
}

// Lista de clientes registrados. Filtro opcional por activo (true/false).
// Cada item incluye totalPedidos y ultimoPedido (los calcula el API).
export async function fetchClientes(activo) {
  const url = new URL(`${API_BASE_URL}/api/clientes`);
  if (activo != null) url.searchParams.set('activo', activo);

  const response = await fetch(url, { headers: authHeaders() });
  if (response.status === 401) handleUnauthorized();
  if (!response.ok) {
    throw new Error(`No se pudieron cargar los clientes: HTTP ${response.status}`);
  }
  return response.json();
}

// Actualiza los datos de un cliente. `cliente` debe traer todos los campos editables
// (el PUT del API reemplaza el registro con el DTO recibido).
export async function updateCliente(idCliente, cliente) {
  const response = await fetch(`${API_BASE_URL}/api/clientes/${idCliente}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(cliente),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const msg = data?.title || data?.message || `HTTP ${response.status}`;
    throw new Error(`No se pudo guardar el cliente: ${msg}`);
  }
  return true;
}

// Logs de envíos de WhatsApp (más recientes primero). Filtros opcionales:
// idOrden, estado ('EXITOSO' | 'FALLIDO') y take (máximo de filas).
export async function fetchWhatsAppLogs({ idOrden, estado, take } = {}) {
  const url = new URL(`${API_BASE_URL}/api/whatsapp/logs`);
  if (idOrden != null) url.searchParams.set('idOrden', idOrden);
  if (estado) url.searchParams.set('estado', estado);
  if (take != null) url.searchParams.set('take', take);

  const response = await fetch(url, { headers: authHeaders() });
  if (response.status === 401) handleUnauthorized();
  if (!response.ok) {
    throw new Error(`No se pudieron cargar los logs: HTTP ${response.status}`);
  }
  return response.json();
}

// Reconstruye las formas cartItems/buyerInfo que esperan las funciones de whatsapp.js
// a partir de la orden cargada en el admin (OrdenDto) y el mapa de productos.
function buildResendArgs(orden, products = {}) {
  const cartItems = (orden.detalles ?? []).map((d) => {
    const prod = products[d.codigoSku];
    return {
      quantity: d.cantidadPaquetes,
      name: d.esCombo
        ? d.nombreCombo || d.codigoCombo || 'Combo'
        : prod?.name || d.codigoSku,
      flavor: d.esCombo ? null : prod?.flavor,
      weight: d.esCombo ? null : prod?.weight,
      isCombo: d.esCombo,
      subcategory: d.esCombo ? 'Combo' : undefined,
    };
  });

  const buyerInfo = {
    nombre: orden.nombreCliente ?? '',
    apellidos: orden.apellidosCliente ?? '',
    telefono: orden.telefonoCliente ?? '',
    email: orden.emailCliente ?? '',
    direccion: orden.direccionCliente ?? '',
    casaApartamento: orden.casaApartamentoCliente ?? '',
    ciudad: orden.ciudadCliente ?? '',
    departamento: orden.departamentoCliente ?? '',
    codigoPostal: orden.codigoPostalCliente ?? '',
    pais: orden.paisCliente ?? 'Colombia',
    // tipoPago / tipoEntrega no se almacenan en la orden → usan los defaults de whatsapp.js.
  };

  return { cartItems, buyerInfo };
}

// Reenvía la notificación del pedido al WhatsApp del negocio (plantilla enviar_orden).
// orden.total ya incluye el domicilio (lo persiste el backend al crear la orden).
export async function resendOrderToBusiness(orden, products) {
  const { cartItems, buyerInfo } = buildResendArgs(orden, products);
  return sendOrderViaWhatsAppAPI(cartItems, orden.total, buyerInfo, orden.idOrden);
}

// Reenvía la confirmación del pedido al WhatsApp del cliente.
export async function resendOrderToClient(orden, products) {
  const { cartItems, buyerInfo } = buildResendArgs(orden, products);
  return sendOrderConfirmationToClient(cartItems, orden.total, buyerInfo, orden.idOrden);
}
