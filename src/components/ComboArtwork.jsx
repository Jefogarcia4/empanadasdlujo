// Ilustración de respaldo para los combos que todavía no tienen foto en el
// backend: reutiliza el ícono y el color con los que ya se identificaban en la
// sección de combos, para que la tarjeta no quede con el espacio vacío.

const ICONS = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

const THEMES = [
  { key: 'inicial', icon: 'home' },
  { key: 'familiar', icon: 'users' },
  { key: 'premium', icon: 'crown' },
];

// Tema estable por combo: el mismo código siempre recibe el mismo ícono, sin
// depender del orden en que llegue la grilla.
function themeFor(id) {
  const key = String(id ?? '');
  let sum = 0;
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i);
  return THEMES[sum % THEMES.length];
}

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n ?? 0);

function ComboArtwork({ combo }) {
  const theme = themeFor(combo.id);

  return (
    <div className={`combo-art combo-art--${theme.key}`} aria-hidden="true">
      <span className="combo-art__icon">{ICONS[theme.icon]}</span>
      {combo.savings > 0 && (
        <span className="combo-art__savings">Ahorras {formatPrice(combo.savings)}</span>
      )}
    </div>
  );
}

export default ComboArtwork;
