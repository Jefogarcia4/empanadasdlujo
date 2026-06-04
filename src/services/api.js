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
  const precioMayor = item.precios?.find((p) => p.nombreLista === 'PVxM');
  return {
    id: item.codigoSku,
    category: item.categoria === 'Pastel' ? 'Pasteles' : item.categoria,
    name: item.producto,
    flavor: item.sabor,
    weight: item.gramajeG,
    unitsPerPackage: item.unidadesPorPaquete,
    price: precioWeb?.precioPaquete ?? 0,
    suggestedRetailUnit: precioWeb?.precioPorUnidad ?? 0,
    estimatedMargin: precioWeb?.margen ?? null,
    wholesalePrice: precioMayor?.precioPaquete ?? 0,
    active: item.activo,
    image: item.urlImage ?? null,
    orden: item.orden ?? null,
    badge: item.badgeDescripcion ?? null,
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

// Un combo se mapea a la misma forma que un producto para poder agregarlo al
// carrito igual que cualquier item. Claves específicas: isCombo, idCombo,
// normalPrice, savings y components. wholesalePrice = 0 → nunca se reprecio a
// mayorista, y CartContext lo excluye además del umbral de 10 paquetes.
function mapCombo(item) {
  return {
    id: item.codigoCombo,
    idCombo: item.idCombo,
    isCombo: true,
    category: 'Combos',
    name: item.nombre,
    flavor: item.subcategoria ?? 'Combo',
    subcategory: item.subcategoria ?? null,
    shortDescription: item.descripcionCorta ?? null,
    longDescription: item.descripcionLarga ?? null,
    price: item.precioCombo ?? 0,
    normalPrice: item.precioNormal ?? 0,
    savings: item.ahorro ?? Math.max((item.precioNormal ?? 0) - (item.precioCombo ?? 0), 0),
    wholesalePrice: 0,
    weight: item.pesoTotalG ?? null,
    unitsTotal: item.unidadesTotales ?? null,
    active: item.activo,
    image: item.urlImage ?? null,
    orden: item.orden ?? null,
    badge: item.badgeDescripcion ?? null,
    components: (item.componentes ?? []).map((c) => ({
      codigoSku: c.codigoSku,
      producto: c.producto,
      sabor: c.sabor,
      weight: c.gramajeG,
      unitsPerPackage: c.unidadesPorPaquete,
      quantity: c.cantidadPaquetes,
    })),
  };
}

export async function fetchCombos() {
  const response = await fetch(`${API_BASE_URL}/api/combos?activo=true`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Error al cargar combos: ${response.status}`);
  }
  const data = await response.json();
  return data.map(mapCombo);
}
