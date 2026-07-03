const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net';
const API_USERNAME = 'admin';
const API_PASSWORD = 'Admin@DLujo2025!';

function getAuthHeaders() {
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
  return {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

// Carrito borrador generado desde WhatsApp. Devuelve null si el token no existe (404).
export async function fetchCarrito(token) {
  const response = await fetch(`${API_BASE_URL}/api/carrito/${token}`, {
    headers: getAuthHeaders(),
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`No se pudo cargar el carrito: HTTP ${response.status}`);
  }
  return response.json();
}

// Marca el carrito como CONVERTIDO tras crear el pedido. Best-effort: no debe romper el
// flujo de compra si falla.
export async function marcarCarritoConvertido(token, idOrden) {
  const response = await fetch(`${API_BASE_URL}/api/carrito/${token}/convertir`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ idOrden }),
  });
  if (!response.ok) {
    throw new Error(`No se pudo marcar el carrito como convertido: HTTP ${response.status}`);
  }
  return response.json().catch(() => ({}));
}
