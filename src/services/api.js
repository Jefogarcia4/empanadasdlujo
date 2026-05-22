const API_BASE_URL = 'https://empanadasdlujosapi.azurewebsites.net'; //import.meta.env.VITE_API_BASE_URL || '';
const API_USERNAME = 'admin';
const API_PASSWORD = 'Admin@DLujo2025!';

function getAuthHeaders() {
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
  return {
    Authorization: `Basic ${credentials}`,
  };
}

function mapProducto(item) {
  const precioWeb = item.precios?.find((p) => p.nombreLista === 'Web');
  return {
    id: item.codigoSku,
    category: item.categoria === 'Pastel' ? 'Pasteles' : item.categoria,
    name: item.producto,
    flavor: item.sabor,
    weight: item.gramajeG,
    unitsPerPackage: item.unidadesPorPaquete,
    price: precioWeb?.precioPaquete ?? 0,
    active: item.activo,
    image: item.urlImage ?? null,
  };
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/api/catalogo?activo=true`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error al cargar productos: ${response.status}`);
  }
  const data = await response.json();
  return data.map(mapProducto);
}
