// Portal de clientes: login por OTP (código de 6 dígitos vía WhatsApp) + consulta de pedidos.
// La sesión (JWT) se guarda en localStorage para que persista entre recargas.

const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net';
const STORAGE_KEY = 'edl_cliente_session';

async function parseError(response, fallback) {
  const data = await response.json().catch(() => ({}));
  return data?.message || data?.title || fallback || `HTTP ${response.status}`;
}

// Paso 1: pide al API que genere y envíe el código por WhatsApp.
export async function solicitarOtp(telefono) {
  const response = await fetch(`${API_BASE_URL}/api/portal/otp/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, 'No se pudo enviar el código.'));
  }
  return response.json();
}

// Paso 2: valida el código y guarda la sesión (JWT + datos). Devuelve la sesión.
export async function verificarOtp(telefono, codigo) {
  const response = await fetch(`${API_BASE_URL}/api/portal/otp/verificar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono, codigo }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, 'Código inválido.'));
  }

  const data = await response.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

// Pedidos del cliente autenticado. Si el token venció (401) cierra la sesión.
export async function fetchMisPedidos() {
  const token = getClienteToken();
  if (!token) throw new Error('SESSION_EXPIRED');

  const response = await fetch(`${API_BASE_URL}/api/portal/mis-pedidos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    logoutCliente();
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    throw new Error(`No se pudieron cargar tus pedidos: HTTP ${response.status}`);
  }
  return response.json();
}

export function logoutCliente() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getClienteSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getClienteToken() {
  const session = getClienteSession();
  if (!session?.token) return null;
  // Descarta la sesión si el JWT ya venció (evita llamadas que fallarán con 401).
  if (session.expiraEn && new Date(session.expiraEn) <= new Date()) {
    logoutCliente();
    return null;
  }
  return session.token;
}

export function isClienteAuthenticated() {
  return !!getClienteToken();
}
