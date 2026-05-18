const WHATSAPP_LINK = 'https://wa.me/573046028579';

const benefitChips = [
  { label: 'Desde 2 paquetes', variant: 'red', icon: '📦' },
  { label: 'Combos desde $55,000', variant: 'gold', icon: '🎁' },
  { label: 'Mayorista 10+ paquetes', variant: 'gold', icon: '🏪' },
  { label: 'Listos para freír', variant: 'dark', icon: '🔥' },
  { label: 'Medellín y Valle de Aburrá', variant: 'dark', icon: '📍' },
  { label: 'Producto congelado', variant: 'dark', icon: '❄️' },
  { label: 'Compra fácil en la web', variant: 'dark', icon: '🛒' },
  { label: 'Ideal para vender', variant: 'dark', icon: '📈' },
];

function Hero() {
  return (
    <section className="tienda-hero">
      <div className="tienda-hero__content">
        <p className="tienda-hero__label">🥟 Empanadas D'lujo</p>
        <h2 className="tienda-hero__title">El sabor auténtico<br />en tu casa</h2>
        <p className="tienda-hero__sub">
          Empanadas y pasteles congelados, listos para freír.<br />
          Alta calidad · Fácil preparación · Excelente margen
        </p>
        <a
          href={`${WHATSAPP_LINK}?text=Hola! Quiero hacer un pedido`}
          className="tienda-hero__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          🛒 Comprar ahora
        </a>
      </div>
      <div className="tienda-chips-wrap">
        <div className="tienda-chips">
          {benefitChips.map((chip, i) => (
            <span key={i} className={`tienda-chip tienda-chip--${chip.variant}`}>
              <span className="tienda-chip__icon">{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
