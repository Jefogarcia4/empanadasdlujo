// Contenido de un combo ("Incluye: ...") normalizado para pintarlo como lista.
// Lo comparten la tarjeta de la vitrina y la tarjeta de la sección de combos.

// Línea legible cuando el API sí entrega componentes.
function componentLabel(c) {
  const nombre = [c.producto, c.sabor].filter(Boolean).join(' ');
  const detalle = [
    c.unitsPerPackage ? `${c.unitsPerPackage} und` : null,
    c.weight ? `de ${c.weight}g` : null,
  ]
    .filter(Boolean)
    .join(' ');
  return `${c.quantity}x ${nombre}${detalle ? ` · ${detalle}` : ''}`;
}

// Convierte la descripción larga ("Incluye A + B + C. Productos congelados...")
// en items individuales para el checklist.
function splitIncludes(longDescription) {
  if (!longDescription) return [];
  let text = longDescription.replace(/^[\s\S]*?incluye\s*/i, '');
  text = text.replace(/\.?\s*productos congelados[\s\S]*$/i, '');
  text = text.replace(/\.\s*$/, '').trim();
  return text
    .split(/\s*\+\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function comboIncludes(combo) {
  return combo?.components?.length > 0
    ? combo.components.map(componentLabel)
    : splitIncludes(combo?.longDescription);
}

// Total de paquetes que trae el combo (solo si el API envía los componentes).
export function comboPackages(combo) {
  return (combo?.components ?? []).reduce((sum, c) => sum + (c.quantity ?? 0), 0);
}
