// Helpers compartidos por la pantalla de productos y precios del admin.

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatNumero = (value, decimales = 2) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: decimales }).format(Number(value) || 0);

// Convierte lo que escribe el usuario a número. En es-CO el punto separa miles y
// la coma decimales ("12.500" → 12500). Devuelve null si no hay nada usable.
export function parsePrecio(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  const limpio = String(input ?? '').replace(/[^\d,.-]/g, '').trim();
  if (!limpio) return null;
  const normalizado = limpio.replace(/\./g, '').replace(',', '.');
  const n = Number(normalizado);
  return Number.isFinite(n) ? n : null;
}

// Redondea al múltiplo indicado (50, 100, 500…). paso <= 1 → entero.
export function redondear(valor, paso) {
  if (!Number.isFinite(valor)) return 0;
  if (!paso || paso <= 1) return Math.round(valor);
  return Math.round(valor / paso) * paso;
}

// Precio por unidad sugerido a partir del precio del paquete.
export function sugerirPrecioUnidad(precioPaquete, unidadesPorPaquete) {
  const paquete = Number(precioPaquete);
  const unidades = Number(unidadesPorPaquete);
  if (!Number.isFinite(paquete) || !Number.isFinite(unidades) || unidades <= 0) return 0;
  return Math.round(paquete / unidades);
}

// Texto de la presentación: "500 g · 12 und".
export function describirPresentacion(item) {
  const partes = [];
  if (item.gramajeG) partes.push(`${formatNumero(item.gramajeG, 0)} g`);
  if (item.unidadesPorPaquete) partes.push(`${item.unidadesPorPaquete} und`);
  return partes.join(' · ') || '—';
}
