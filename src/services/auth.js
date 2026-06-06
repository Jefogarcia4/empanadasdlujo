const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net';
const STORAGE_KEY = 'edl_admin_session';

// Llama al endpoint de login del API. Si las credenciales son válidas guarda la
// sesión (token Basic + datos del usuario) en sessionStorage para reutilizarla en
// las llamadas a los endpoints protegidos.
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 401) {
    throw new Error('Usuario o contraseña incorrectos.');
  }
  if (!response.ok) {
    throw new Error(`No se pudo iniciar sesión: HTTP ${response.status}`);
  }

  const data = await response.json();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getSession()?.token ?? null;
}

export function isAuthenticated() {
  return !!getAuthToken();
}
