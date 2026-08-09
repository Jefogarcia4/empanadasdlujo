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
// forzar un nuevo login (mismo contrato que services/admin.js).
function handleUnauthorized() {
  logout();
  throw new Error('SESSION_EXPIRED');
}

// El API responde texto plano en los BadRequest y ProblemDetails en los de validación.
async function lanzarError(response, errorMsg) {
  const raw = await response.text().catch(() => '');
  let detalle = raw;
  try {
    const data = JSON.parse(raw);
    detalle =
      data?.title ||
      data?.message ||
      Object.values(data?.errors ?? {}).flat().join(' ') ||
      raw;
  } catch {
    /* respuesta no-JSON: se usa el texto tal cual */
  }
  throw new Error(`${errorMsg}: ${detalle || `HTTP ${response.status}`}`);
}

async function request(path, { method = 'GET', body, errorMsg } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? authHeaders({ 'Content-Type': 'application/json' }) : authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok) await lanzarError(response, errorMsg);

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ─── Lectura ──────────────────────────────────────────────────────────────

// Une en una sola estructura lo que el API expone en endpoints separados:
// cada item queda con sus datos maestros y un mapa de precios por idLista.
export async function fetchCatalogoAdmin() {
  const [skus, productos, categorias, sabores, listas, precios] = await Promise.all([
    request('/api/skus', { errorMsg: 'No se pudieron cargar los productos' }),
    request('/api/productos', { errorMsg: 'No se pudieron cargar los productos' }),
    request('/api/categorias', { errorMsg: 'No se pudieron cargar las categorías' }),
    request('/api/sabores', { errorMsg: 'No se pudieron cargar los sabores' }),
    request('/api/listasprecios', { errorMsg: 'No se pudieron cargar las listas de precios' }),
    request('/api/preciossku', { errorMsg: 'No se pudieron cargar los precios' }),
  ]);

  const productoPorId = new Map(productos.map((p) => [p.idProducto, p]));

  const preciosPorSku = new Map();
  for (const precio of precios) {
    if (!preciosPorSku.has(precio.codigoSku)) preciosPorSku.set(precio.codigoSku, {});
    preciosPorSku.get(precio.codigoSku)[precio.idLista] = {
      idPrecio: precio.idPrecio,
      idLista: precio.idLista,
      precioPaquete: precio.precioPaquete,
      precioPorUnidad: precio.precioPorUnidad,
      margen: precio.margen ?? null,
    };
  }

  const items = skus.map((sku) => {
    const producto = productoPorId.get(sku.idProducto);
    return {
      codigoSku: sku.codigoSku,
      idProducto: sku.idProducto,
      nombreProducto: sku.nombreProducto ?? producto?.nombre ?? '',
      idCategoria: producto?.idCategoria ?? null,
      nombreCategoria: producto?.nombreCategoria ?? '',
      idSabor: sku.idSabor,
      nombreSabor: sku.nombreSabor ?? '',
      gramajeG: sku.gramajeG,
      unidadesPorPaquete: sku.unidadesPorPaquete,
      activo: sku.activo,
      orden: sku.orden ?? null,
      badgeDescripcion: sku.badgeDescripcion ?? '',
      urlImage: sku.urlImage ?? '',
      precios: preciosPorSku.get(sku.codigoSku) ?? {},
    };
  });

  return {
    items,
    productos,
    categorias,
    sabores,
    listas: [...listas].sort((a, b) => a.idLista - b.idLista),
  };
}

// ─── Escritura ────────────────────────────────────────────────────────────

// El PUT reemplaza el registro completo: hay que mandar todos los campos del SKU.
export async function updateSku(codigoSku, sku) {
  await request(`/api/skus/${encodeURIComponent(codigoSku)}`, {
    method: 'PUT',
    body: {
      idProducto: sku.idProducto,
      idSabor: sku.idSabor,
      gramajeG: sku.gramajeG,
      unidadesPorPaquete: sku.unidadesPorPaquete,
      activo: !!sku.activo,
      orden: sku.orden ?? null,
      badgeDescripcion: sku.badgeDescripcion || null,
      urlImage: sku.urlImage || null,
    },
    errorMsg: 'No se pudo guardar el producto',
  });
  return true;
}

export async function setSkuActivo(codigoSku, activo) {
  await request(`/api/skus/${encodeURIComponent(codigoSku)}/activo`, {
    method: 'PATCH',
    body: { activo },
    errorMsg: 'No se pudo cambiar la disponibilidad',
  });
  return true;
}

// Alta transaccional: crea categoría/producto/sabor si no existen, el SKU y sus precios.
// Se envía idX cuando el admin eligió uno existente y nombreX cuando escribió uno nuevo.
export async function createSkuCompleto(payload) {
  return request('/api/skus/completo', {
    method: 'POST',
    body: payload,
    errorMsg: 'No se pudo crear el producto',
  });
}

// ─── Maestros ─────────────────────────────────────────────────────────────
// Al crear un item se resuelven dentro de /api/skus/completo; estas funciones son
// para el modo edición, donde el PUT del SKU solo acepta ids ya existentes.

export async function crearCategoria(nombre) {
  return request('/api/categorias', {
    method: 'POST',
    body: { nombre },
    errorMsg: 'No se pudo crear la categoría',
  });
}

export async function crearProducto(nombre, idCategoria) {
  return request('/api/productos', {
    method: 'POST',
    body: { nombre, idCategoria },
    errorMsg: 'No se pudo crear el producto',
  });
}

export async function crearSabor(nombre) {
  return request('/api/sabores', {
    method: 'POST',
    body: { nombre },
    errorMsg: 'No se pudo crear el sabor',
  });
}

// Upsert por (codigoSku, idLista): crea el precio si el SKU aún no lo tiene en esa lista.
export async function upsertPrecios(precios) {
  if (!precios.length) return { creados: 0, actualizados: 0, precios: [] };
  return request('/api/preciossku/bulk', {
    method: 'PUT',
    body: { precios },
    errorMsg: 'No se pudieron guardar los precios',
  });
}

// ─── Imágenes ─────────────────────────────────────────────────────────────

export const IMAGEN_MAX_MB = 5;
export const IMAGEN_TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Sube el archivo al API y devuelve { url, archivo, bytes }. La URL resultante es la
// que se guarda en el SKU. Ojo: NO se fija Content-Type a mano — el navegador tiene
// que ponerlo con el boundary del multipart.
export async function subirImagenProducto(file) {
  const form = new FormData();
  form.append('archivo', file);

  const response = await fetch(`${API_BASE_URL}/api/imagenes/productos`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });

  if (response.status === 401) handleUnauthorized();
  if (response.status === 413) {
    throw new Error(`La imagen supera el máximo de ${IMAGEN_MAX_MB} MB.`);
  }
  if (!response.ok) await lanzarError(response, 'No se pudo subir la imagen');

  return response.json();
}

// Saca el SKU de una lista de precios (deja de venderse a ese precio).
export async function eliminarPrecio(idPrecio) {
  await request(`/api/preciossku/${idPrecio}`, {
    method: 'DELETE',
    errorMsg: 'No se pudo quitar el precio',
  });
  return true;
}
