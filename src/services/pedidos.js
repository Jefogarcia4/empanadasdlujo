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

export async function createPedido({ cliente, observaciones, items }) {
  const body = {
    cliente: {
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      casaApartamento: cliente.casaApartamento,
      ciudad: cliente.ciudad,
      departamento: cliente.departamento,
      codigoPostal: cliente.codigoPostal,
      pais: cliente.pais ?? 'Colombia',
      activo: true,
      guardarInfo: !!cliente.guardarInfo,
    },
    observaciones,
    detalles: items.map((it) => ({
      codigoSku: it.id,
      cantidadPaquetes: it.quantity,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = data?.error?.message || data?.title || `HTTP ${response.status}`;
    throw new Error(`No se pudo crear el pedido: ${msg}`);
  }
  return data;
}
