import { getAuthToken, logout } from './auth';

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
