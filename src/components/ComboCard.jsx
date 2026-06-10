import { useCart } from '../context/CartContext';
import { trackAddToCart } from '../services/metaPixel';

// Tema por posición: inicial (dorado) → familiar (naranja) → premium (rojo).
// El 4º reutiliza el primero si algún día hay más combos.
const THEMES = [
  { key: 'inicial',  icon: 'home',  premium: false },
  { key: 'familiar', icon: 'users', premium: false },
  { key: 'premium',  icon: 'crown', premium: true  },
  { key: 'inicial',  icon: 'home',  premium: false },
];

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.5a3.2 3.2 0 0 1 0 5" />
      <path d="M17.5 20a5.5 5.5 0 0 0-2.8-4.8" />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M2.6 7.4 7 10.6 12 4.4l5 6.2 4.4-3.2L19.4 18H4.6L2.6 7.4zM4.6 20h14.8v1.6H4.6V20z" />
    </svg>
  ),
};

const cartIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.2 4l.94 2H21a1 1 0 0 1 .96 1.28l-2.2 7.5A1.5 1.5 0 0 1 18.32 16H8.1a1.5 1.5 0 0 1-1.45-1.11L4.1 4H1.5a1 1 0 0 1 0-2h3.4a1 1 0 0 1 .96.72L6.2 4z" />
  </svg>
);

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);

const formatWeight = (w) => {
  if (!w) return null;
  return w >= 1000 ? `${(w / 1000).toLocaleString('es-CO')} kg` : `${w} g`;
};

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

function ComboCard({ combo, index = 0 }) {
  const { addToCart, openCart } = useCart();
  const theme = THEMES[index % THEMES.length];

  const handleAdd = () => {
    addToCart(combo);
    trackAddToCart(combo);
    openCart();
  };

  const includes =
    combo.components?.length > 0
      ? combo.components.map(componentLabel)
      : splitIncludes(combo.longDescription);

  // "Combo Antojo Casero" → línea 1 "Combo" (suave), línea 2 "Antojo Casero" (fuerte).
  const nameParts = (combo.name || '').trim().split(' ');
  const namePre = nameParts.length > 1 ? nameParts[0] : null;
  const nameMain = nameParts.length > 1 ? nameParts.slice(1).join(' ') : combo.name;

  return (
    <article className={`combo-card combo-card--${theme.key}`}>
      {/* Encabezado: ícono + etiqueta + sello de ahorro */}
      <div className="combo-card__top">
        <div className="combo-card__id">
          <span className="combo-card__icon">{ICONS[theme.icon]}</span>
          {combo.subcategory && (
            <span className="combo-card__label">{combo.subcategory}</span>
          )}
        </div>
        {combo.savings > 0 && (
          <div className="combo-card__seal">
            <span className="combo-card__seal-top">Ahorras</span>
            <span className="combo-card__seal-amount">{formatPrice(combo.savings)}</span>
          </div>
        )}
      </div>

      {/* Nombre + tagline */}
      <h3 className="combo-card__name">
        {namePre && <span className="combo-card__name-pre">{namePre}</span>}
        <span className="combo-card__name-main">{nameMain}</span>
      </h3>
      {combo.shortDescription && (
        <p className="combo-card__tagline">{combo.shortDescription}</p>
      )}

      {/* Precios */}
      <div className="combo-card__prices">
        {combo.normalPrice > combo.price && (
          <div className="combo-card__normal">
            <span className="combo-card__normal-label">Precio normal</span>
            <s className="combo-card__normal-value">{formatPrice(combo.normalPrice)}</s>
          </div>
        )}
        <div className="combo-card__pricebox">
          <span className="combo-card__pricebox-label">Precio combo</span>
          <span className="combo-card__pricebox-value">{formatPrice(combo.price)}</span>
        </div>
      </div>

      {/* Incluye */}
      {includes.length > 0 && (
        <div className="combo-card__includes">
          <p className="combo-card__includes-title">Incluye:</p>
          <ul className="combo-card__includes-list">
            {includes.map((item, i) => (
              <li key={i}>
                <span className="combo-card__check" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <button className="combo-card__btn" onClick={handleAdd}>
        {cartIcon}
        <span>Agregar combo al carrito</span>
      </button>
    </article>
  );
}

export default ComboCard;
