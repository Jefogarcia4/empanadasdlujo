import { useCart } from '../context/CartContext';

const PALETTE = [
  { color: '#E8F5E9', borderColor: '#4CAF50' },
  { color: '#FFF8E1', borderColor: '#FFB21B' },
  { color: '#FCE4EC', borderColor: '#E91E63' },
  { color: '#E3F2FD', borderColor: '#2196F3' },
];

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

// Línea legible de un componente: "1x Empanada Pequeña Papa y Guiso · 50 und de 30g"
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

function ComboCard({ combo, index = 0 }) {
  const { addToCart, openCart } = useCart();
  const theme = PALETTE[index % PALETTE.length];

  const handleAdd = () => {
    addToCart(combo);
    openCart();
  };

  const weightLabel = formatWeight(combo.weight);

  return (
    <div
      className="combo-card"
      style={{ background: theme.color, borderColor: theme.borderColor }}
    >
      <div className="combo-card__header">
        <div>
          {combo.subcategory && (
            <span className="combo-card__tag">{combo.subcategory}</span>
          )}
          <h3 className="combo-card__name">{combo.name}</h3>
        </div>
        {combo.badge && <span className="combo-card__badge">{combo.badge}</span>}
      </div>

      {combo.shortDescription && (
        <p className="combo-card__desc">{combo.shortDescription}</p>
      )}

      {combo.components?.length > 0 && (
        <ul className="combo-card__items">
          {combo.components.map((c) => (
            <li key={c.codigoSku}>
              <span aria-hidden="true">🟡</span> {componentLabel(c)}
            </li>
          ))}
        </ul>
      )}

      {(combo.unitsTotal || weightLabel) && (
        <div className="combo-card__meta">
          {combo.unitsTotal && (
            <span>📦 {combo.unitsTotal} unidades</span>
          )}
          {weightLabel && <span>⚖️ {weightLabel}</span>}
        </div>
      )}

      <div className="combo-card__pricing">
        {combo.normalPrice > combo.price && (
          <div className="combo-card__normal">
            Precio normal: <s>{formatPrice(combo.normalPrice)}</s>
          </div>
        )}
        <div className="combo-card__price">
          Precio combo: <strong>{formatPrice(combo.price)}</strong>
        </div>
        {combo.savings > 0 && (
          <div className="combo-card__savings">
            Ahorras: <strong>{formatPrice(combo.savings)}</strong>
          </div>
        )}
      </div>

      <button
        className="combo-card__btn"
        style={{ background: theme.borderColor }}
        onClick={handleAdd}
      >
        🛒 Agregar combo al carrito
      </button>
    </div>
  );
}

export default ComboCard;
