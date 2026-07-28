// Lógica de los filtros de la vitrina (categoría, búsqueda y tamaño).
// Vive aparte del componente para poder reusarse desde App sin romper el
// fast-refresh de Vite.

export const TODOS = 'Todos';
export const TODOS_TAMANOS = 'todos';
export const COMBOS = 'Combos';

// Orden preferido de las pestañas; cualquier categoría nueva del API se agrega
// al final para no perderla si cambia el catálogo. Se compara en singular y sin
// mayúsculas porque el API puede devolver "Empanada" o "Empanadas".
const ORDEN_CATEGORIAS = ['empanada', 'pastel', 'masa'];

function ordenCategoria(categoria) {
  const c = String(categoria).toLowerCase().trim();
  const i = ORDEN_CATEGORIAS.findIndex(
    (base) => c === base || c === `${base}s` || c === `${base}es`
  );
  return i === -1 ? ORDEN_CATEGORIAS.length : i;
}

function pesoLabel(gramos) {
  return gramos >= 1000 ? `${gramos / 1000} kg` : `${gramos} g`;
}

function nombreTamano(gramos) {
  if (gramos >= 100) return 'Grande';
  if (gramos >= 50) return 'Mediano';
  return 'Pequeño';
}

export function buildCategorias(products, hayCombos) {
  const presentes = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const ordenadas = presentes.sort((a, b) => {
    const diff = ordenCategoria(a) - ordenCategoria(b);
    return diff !== 0 ? diff : a.localeCompare(b, 'es');
  });
  return [TODOS, ...ordenadas, ...(hayCombos ? [COMBOS] : [])];
}

// El API devuelve las categorías en singular ("Empanada", "Pastel"); en las
// pestañas se muestran en plural sin alterar el valor con el que se filtra.
const ETIQUETAS = { empanada: 'Empanadas', pastel: 'Pasteles' };

export function etiquetaCategoria(categoria) {
  return ETIQUETAS[String(categoria).toLowerCase().trim()] ?? categoria;
}

// Una opción por gramaje distinto: evita ambigüedades entre la "pequeña" de
// 30 g y el "pequeño" de 55 g.
export function buildTamanos(products) {
  const pesos = [...new Set(products.map((p) => p.weight).filter((w) => w > 0))];
  return pesos
    .sort((a, b) => a - b)
    .map((w) => ({
      value: String(w),
      label: w >= 1000 ? pesoLabel(w) : `${nombreTamano(w)} · ${pesoLabel(w)}`,
    }));
}

function coincide(texto, q) {
  return String(texto ?? '').toLowerCase().includes(q);
}

export function filtrarProductos(products, { categoria, busqueda, tamano }) {
  const q = busqueda.trim().toLowerCase();
  return products.filter((p) => {
    if (categoria !== TODOS && p.category !== categoria) return false;
    if (tamano !== TODOS_TAMANOS && String(p.weight) !== tamano) return false;
    if (!q) return true;
    return [p.name, p.flavor, p.category, p.id].some((campo) => coincide(campo, q));
  });
}

export function filtrarCombos(combos, busqueda) {
  const q = busqueda.trim().toLowerCase();
  if (!q) return combos;
  return combos.filter(
    (c) =>
      [c.name, c.flavor, c.subcategory, c.shortDescription, c.id].some((campo) =>
        coincide(campo, q)
      ) ||
      (c.components ?? []).some(
        (comp) => coincide(comp.producto, q) || coincide(comp.sabor, q)
      )
  );
}
