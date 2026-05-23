// =====================================================================
// Servicio de datos geográficos de Colombia
// Fuente principal (open source): https://api-colombia.com
//   - GET /api/v1/Department  → 32 departamentos
// Si la API externa falla (timeout/red/CORS) se usa el listado estático
// como fallback para que el formulario siga funcionando.
// =====================================================================

const API_COLOMBIA_URL = 'https://api-colombia.com/api/v1/Department';

// Listado oficial de 32 departamentos + Bogotá D.C. (fallback estático)
export const DEPARTAMENTOS_FALLBACK = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bogotá D.C.',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
];

export async function fetchDepartamentosColombia() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(API_COLOMBIA_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const nombres = data
      .map((d) => d?.name)
      .filter((n) => typeof n === 'string' && n.length > 0)
      .sort((a, b) => a.localeCompare(b, 'es'));

    return nombres.length > 0 ? nombres : DEPARTAMENTOS_FALLBACK;
  } catch (err) {
    console.warn('[colombia] Falla al consultar api-colombia.com, usando fallback estático.', err);
    return DEPARTAMENTOS_FALLBACK;
  }
}
