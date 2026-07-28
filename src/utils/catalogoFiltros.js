// Lógica de los filtros de la vitrina (categoría, búsqueda y tamaño).
// Vive aparte del componente para poder reusarse desde App sin romper el
// fast-refresh de Vite.

export const TODOS = 'Todos';
export const TODOS_TAMANOS = 'todos';
export const COMBOS = 'Combos';

// Orden preferido de las pestañas; cualquier categoría nueva del API se agrega
// al final para no perderla si cambia el catálogo.
const ORDEN_CATEGORIAS = ['Empanadas', 'Pasteles', 'Masa'];

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
  const ordenadas = [
    ...ORDEN_CATEGORIAS.filter((c) => presentes.includes(c)),
    ...presentes.filter((c) => !ORDEN_CATEGORIAS.includes(c)),
  ];
  return [TODOS, ...ordenadas, ...(hayCombos ? [COMBOS] : [])];
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
