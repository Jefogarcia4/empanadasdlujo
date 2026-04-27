import '../styles/Catalogo.css';

const WHATSAPP_NUMBER = '573046028579';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// ─── Datos del catálogo ────────────────────────────────────────────────────

const catalogSections = [
  {
    id: 'cocteleras',
    sectionTitle: 'Empanadas Cocteleras',
    productos: [
      {
        id: 'c1',
        name: 'Empanadas Cocteleras',
        subtitle: 'Sabor tradicional • Perfectas para eventos',
        topVentas: true,
        units: 50,
        filling: 'Papa y Carne',
        weight: '30 gramos por unidad',
        size: 'Coctelero (pequeño)',
        pricePackage: 24600,
        bulkPrice: 20000,
        sellsFrom: 1200,
        margin: 60,
        image: null,
      },
      {
        id: 'c2',
        name: 'Empanadas Cocteleras',
        subtitle: 'Sabor especial • Más rentabilidad',
        topVentas: true,
        units: 60,
        filling: 'Papa y Pollo',
        weight: '30 gramos por unidad',
        size: 'Coctelero (pequeño)',
        pricePackage: 31800,
        bulkPrice: 26000,
        sellsFrom: 1200,
        margin: 58,
        image: null,
      },
      {
        id: 'c3',
        name: 'Empanadas Cocteleras',
        subtitle: 'Alta rotación • Ideales para negocio y eventos',
        topVentas: true,
        units: 50,
        filling: 'Papa y Queso',
        weight: '30 gramos por unidad',
        size: 'Coctelero (pequeño)',
        pricePackage: 19500,
        bulkPrice: 16000,
        sellsFrom: 800,
        margin: 65,
        image: null,
      },
    ],
  },
  {
    id: 'pastel-pollo',
    sectionTitle: 'Pastel de Pollo',
    productos: [
      {
        id: 'p1',
        name: 'Pastel de Pollo',
        subtitle: 'Bocaditos deliciosos • Rápida rotación',
        topVentas: true,
        units: 30,
        filling: 'Solo Pollo',
        weight: '55 gramos por unidad',
        size: 'G360 (pequeño)',
        pricePackage: 46800,
        bulkPrice: 38000,
        sellsFrom: 2000,
        margin: 48,
        image: null,
      },
      {
        id: 'p2',
        name: 'Pastel de Pollo',
        subtitle: 'Más sabor • Mayor ticket de venta',
        topVentas: true,
        units: 12,
        filling: 'Solo Pollo',
        weight: '130 gramos por unidad',
        size: 'Grande',
        pricePackage: 54600,
        bulkPrice: 42000,
        sellsFrom: 6000,
        margin: 52,
        image: null,
      },
    ],
  },
  {
    id: 'grandes',
    sectionTitle: 'Empanadas Grandes',
    productos: [
      {
        id: 'g1',
        name: 'Empanadas Grandes',
        subtitle: 'Relleno clásico • Producto líder',
        topVentas: true,
        units: 12,
        filling: 'Papa y Carne',
        weight: '130 gramos por unidad',
        size: 'Grande',
        pricePackage: 34900,
        bulkPrice: 29700,
        sellsFrom: 6000,
        margin: 56,
        image: null,
      },
      {
        id: 'g2',
        name: 'Empanadas Grandes',
        subtitle: 'Más cantidad • Almuerzo ideal',
        topVentas: true,
        units: 12,
        filling: 'Papa y Pollo',
        weight: '130 gramos por unidad',
        size: 'Grande',
        pricePackage: 34900,
        bulkPrice: 28700,
        sellsFrom: 6000,
        margin: 55,
        image: null,
      },
    ],
  },
];

const combos = [
  {
    id: 'combo1',
    title: 'Combo $55,000',
    name: 'Antojo Casero',
    color: '#E8F5E9',
    borderColor: '#4CAF50',
    items: [
      '1 Empanada Papa y Guiso 90g • 50 und',
      '1 Pastel de Pollo 55g • 30 und',
    ],
    normalPrice: 80000,
    comboPrice: 55000,
    savings: 25000,
  },
  {
    id: 'combo2',
    title: 'Combo $100,000',
    name: 'Reunión Familiar Plus',
    color: '#FFF8E1',
    borderColor: '#FFB21B',
    items: [
      '1 Pastel Grande Solo Pollo 130g • 12 und',
      '1 Empanada Grande Surtida 130g • 12 und',
      '1 Pastel Mediano Solo Pollo 55g • 30 und',
    ],
    normalPrice: 138700,
    comboPrice: 100000,
    savings: 38700,
  },
  {
    id: 'combo3',
    title: 'Combo $150,000',
    name: 'Hogar de Sabor',
    color: '#FCE4EC',
    borderColor: '#E91E63',
    items: [
      '1 Empanada Grande Surtida 130g • 12 und',
      '1 Pastel Grande Salo Pollo 55g • 30 und',
      '1 Papa Mediana Salo Pollo 55g • 30 und',
    ],
    normalPrice: 210000,
    comboPrice: 150000,
    savings: 60000,
  },
];

// ─── Sub-componentes ───────────────────────────────────────────────────────

function ProductCatalogCard({ producto }) {
  const formatPrice = (n) => n.toLocaleString('es-CO');

  return (
    <div className="cat-card">
      {/* Encabezado */}
      <div className="cat-card__header">
        <div className="cat-card__titles">
          <h2 className="cat-card__name">{producto.name}</h2>
          <p className="cat-card__subtitle">{producto.subtitle}</p>
        </div>
        {producto.topVentas && (
          <span className="cat-card__badge-top">🔥 Top ventas</span>
        )}
      </div>

      {/* Imagen */}
      <div className="cat-card__image-wrap">
        {producto.image ? (
          <img src={producto.image} alt={producto.name} className="cat-card__image" />
        ) : (
          <div className="cat-card__image-placeholder">
            <span>🥟</span>
            <p>Imagen del producto</p>
          </div>
        )}
      </div>

      {/* Specs */}
      <div className="cat-card__specs">
        <div className="cat-card__spec">
          <span className="cat-card__spec-icon cat-card__spec-icon--units">📦</span>
          <span><strong>{producto.units}</strong> unidades<br /><small>listas para vender</small></span>
        </div>
        <div className="cat-card__spec">
          <span className="cat-card__spec-icon cat-card__spec-icon--filling">🌶️</span>
          <span><strong>Relleno:</strong><br /><small>{producto.filling}</small></span>
        </div>
        <div className="cat-card__spec">
          <span className="cat-card__spec-icon cat-card__spec-icon--weight">⚖️</span>
          <span><strong>Peso:</strong><br /><small>{producto.weight}</small></span>
        </div>
        <div className="cat-card__spec">
          <span className="cat-card__spec-icon cat-card__spec-icon--size">📏</span>
          <span><strong>Tamaño:</strong><br /><small>{producto.size}</small></span>
        </div>
      </div>

      {/* Precio */}
      <div className="cat-card__price-box">
        <div className="cat-card__price-label">
          <span className="cat-card__price-icon">💰</span>
          <div>
            <span className="cat-card__price-amount">${formatPrice(producto.pricePackage)}</span>
            <span className="cat-card__price-per"> por paquete</span>
            <br />
            <small className="cat-card__price-note">(precio por menor)</small>
          </div>
        </div>
        <div className="cat-card__bulk-badge">
          <span className="cat-card__bulk-text">
            💚 Ahorra y paga solo <strong>${formatPrice(producto.bulkPrice)}</strong>
          </span>
          <span className="cat-card__bulk-sub">Compra 10 paquetes o más</span>
        </div>
      </div>

      {/* Rentabilidad */}
      <div className="cat-card__revenue">
        <div className="cat-card__revenue-item cat-card__revenue-item--sells">
          <span>💵</span>
          <div>
            <p className="cat-card__revenue-label">Vende desde</p>
            <p className="cat-card__revenue-value">${formatPrice(producto.sellsFrom)} c/u</p>
          </div>
        </div>
        <div className="cat-card__revenue-divider" />
        <div className="cat-card__revenue-item cat-card__revenue-item--margin">
          <span>📈</span>
          <div>
            <p className="cat-card__revenue-label">Margen estimado</p>
            <p className="cat-card__revenue-value">+{producto.margin}%</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="cat-card__features">
        <div className="cat-card__feature">
          <span className="cat-card__feature-icon">⏱️</span>
          <span>Listas para freír en minutos</span>
        </div>
        <div className="cat-card__feature">
          <span className="cat-card__feature-icon">⭐</span>
          <span>Crocantes, prácticas y de alta demanda</span>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <a
        href={`${WHATSAPP_LINK}?text=Hola! Quiero pedir ${producto.name} - ${producto.subtitle}`}
        className="cat-card__cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="cat-card__cta-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
        <div>
          <p className="cat-card__cta-title">¿Quieres empezar a vender?</p>
          <p className="cat-card__cta-sub">Pide desde 2 paquetes hoy mismo</p>
        </div>
      </a>
    </div>
  );
}

function InfoCards() {
  return (
    <div className="cat-info-cards">
      <div className="cat-info-card">
        <div className="cat-info-card__icon">📋</div>
        <div>
          <h3>Catálogo único</h3>
          <p>Manejamos un solo catálogo para hogar y negocios. Puedes pedir desde 2 paquetes. El precio mayorista aplica desde 10 paquetes combinados.</p>
        </div>
      </div>
      <div className="cat-info-card">
        <div className="cat-info-card__icon">🎁</div>
        <div>
          <h3>Muestras</h3>
          <p>No entregamos muestras gratis. Puedes probar desde 2 paquetes con una inversión mínima.</p>
        </div>
      </div>
      <div className="cat-info-card cat-info-card--prices">
        <div className="cat-info-card__icon">💲</div>
        <div className="cat-info-card__prices-content">
          <h3>Precios claros</h3>
          <div className="cat-info-card__price-rows">
            <div>
              <p className="cat-info-card__price-type">Precio por menor:</p>
              <p className="cat-info-card__price-desc">desde 2 paquetes</p>
            </div>
            <div>
              <p className="cat-info-card__price-type">Precio por mayor:</p>
              <p className="cat-info-card__price-desc">desde 10 paquetes o más</p>
            </div>
          </div>
          <div className="cat-info-card__bulk-highlight">
            <span>🏆 Desde 10 paquetes accedes a mejor precio</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoImportante() {
  return (
    <section className="cat-info-importante">
      <h2 className="cat-info-importante__title">Información<br />Importante</h2>
      <div className="cat-info-importante__grid">
        <div className="cat-info-importante__item">
          <div className="cat-info-importante__item-icon">🛒</div>
          <h4>Cómo pedir</h4>
          <ul>
            <li>Elegir tus productos</li>
            <li>Escribirnos por WhatsApp</li>
            <li>Confirmamos tu pedido y envío</li>
          </ul>
        </div>
        <div className="cat-info-importante__item">
          <div className="cat-info-importante__item-icon">💳</div>
          <h4>Pagos</h4>
          <ul>
            <li>Efectivo, transferencia</li>
            <li>o contra entrega</li>
            <li>(según volumen)</li>
          </ul>
        </div>
        <div className="cat-info-importante__item">
          <div className="cat-info-importante__item-icon">🛵</div>
          <h4>Envíos</h4>
          <ul>
            <li>Área Metropolitana del</li>
            <li>Valle de Aburrá</li>
            <li>Domicilio a partir de $8,000</li>
          </ul>
        </div>
        <div className="cat-info-importante__item">
          <div className="cat-info-importante__item-icon">🕐</div>
          <h4>Horarios</h4>
          <ul>
            <li>9 am – 6 pm</li>
            <li>Pide con anticipación</li>
          </ul>
        </div>
      </div>
      <a
        href={`${WHATSAPP_LINK}?text=Hola! Estoy listo para pedir`}
        className="cat-info-importante__cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>📱</span> ¿Listo para pedir?<br />
        <small>Escríbenos y agenda tu pedido</small>
      </a>
    </section>
  );
}

function CombosSection() {
  const formatPrice = (n) => n.toLocaleString('es-CO');

  return (
    <section className="cat-combos">
      <div className="cat-combos__header">
        <h2 className="cat-combos__title">Combos para empezar</h2>
        <p className="cat-combos__subtitle">Empieza fácil, ahorra más</p>
        <p className="cat-combos__desc">
          Son ideales si no quieres pedir 10 paquetes o si vas a lanzar nuevos productos a tus clientes por primera vez.<br />
          <strong>Recuerda:</strong> Si ya sabes cuáles son tus favoritos, pedir de 10 paquetes o más te saldrá al mejor precio.
        </p>
      </div>
      <div className="cat-combos__list">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="cat-combo-card"
            style={{ background: combo.color, borderColor: combo.borderColor }}
          >
            <div className="cat-combo-card__header">
              <h3 className="cat-combo-card__title">{combo.title}</h3>
              <span className="cat-combo-card__name">{combo.name}</span>
            </div>
            <ul className="cat-combo-card__items">
              {combo.items.map((item, i) => (
                <li key={i}>
                  <span>🟡</span> {item}
                </li>
              ))}
            </ul>
            <div className="cat-combo-card__pricing">
              <div className="cat-combo-card__normal">
                Precio normal: <s>${formatPrice(combo.normalPrice)}</s>
              </div>
              <div className="cat-combo-card__price">
                Precio combo: <strong>${formatPrice(combo.comboPrice)}</strong>
              </div>
              <div className="cat-combo-card__savings">
                Ahorras: <strong>${formatPrice(combo.savings)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a
        href={`${WHATSAPP_LINK}?text=Hola! Quiero información sobre los combos`}
        className="cat-combos__cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>📱</span> ¿Listo para empezar?<br />
        <small>Escríbenos y te ayudamos a elegir el mejor combo para ti</small>
      </a>
    </section>
  );
}

function BrandFooter() {
  return (
    <section className="cat-brand-footer">
      <div className="cat-brand-footer__logo">
        <div className="cat-brand-footer__logo-icon">🥟</div>
        <div>
          <p className="cat-brand-footer__logo-brand">EMPANADAS</p>
          <p className="cat-brand-footer__logo-name">D'lujo</p>
        </div>
      </div>

      <h2 className="cat-brand-footer__headline">
        Empieza tu negocio o disfruta<br />en casa con calidad profesional
      </h2>

      <div className="cat-brand-footer__quote">
        <p>"El lujo no está en el precio.</p>
        <p>Está en el proceso."</p>
        <small>Productos consistentes, listos para crecer contigo.</small>
      </div>

      <div className="cat-brand-footer__features">
        <div className="cat-brand-footer__feature">✅ Listas para freír en minutos</div>
        <div className="cat-brand-footer__feature">🔄 Alta rotación</div>
        <div className="cat-brand-footer__feature">🏪 Ideales para negocio o consumo</div>
        <div className="cat-brand-footer__feature">📦 Comienza desde 2 paquetes</div>
      </div>

      <a
        href={`${WHATSAPP_LINK}?text=Hola! Quiero hacer un pedido`}
        className="cat-brand-footer__cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <div>
          <p>Escríbenos y anota tu pedido</p>
          <p className="cat-brand-footer__cta-number">+57 3046028579</p>
        </div>
      </a>

      <div className="cat-brand-footer__social">
        <p>Síguenos y conoce más de nuestros productos</p>
        <div className="cat-brand-footer__social-links">
          <a href="https://www.tiktok.com/@empanadas_dlujo" target="_blank" rel="noopener noreferrer" className="cat-brand-footer__social-link">TikTok</a>
          <a href="https://www.instagram.com/empanadas_dlujo" target="_blank" rel="noopener noreferrer" className="cat-brand-footer__social-link">Instagram</a>
          <a href="https://www.facebook.com/empanadas_dlujo" target="_blank" rel="noopener noreferrer" className="cat-brand-footer__social-link">Facebook</a>
        </div>
        <p className="cat-brand-footer__social-handle">@empanadas_dlujo</p>
      </div>

      <div className="cat-brand-footer__divider" />

      <div className="cat-brand-footer__tag">
        <span>🌆</span> Emprende con empanadas en Medellín
      </div>

      <p className="cat-brand-footer__legal">
        Fabricación profesional de congelado alimenticio<br />
        Reg. INVIMA FDA-100399-2025
      </p>
    </section>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

function Catalogo() {
  return (
    <div className="catalogo">
      {/* Hero */}
      <section className="cat-hero">
        <div className="cat-hero__top-label">CATÁLOGO 2026</div>
        <div className="cat-hero__logo">🥟 Empanadas <strong>D'lujo</strong></div>
        <h1 className="cat-hero__title">Empanadas<br />y Pasteles</h1>
        <div className="cat-hero__subtitle-badge">
          Para vender o disfrutar en casa
        </div>
        <div className="cat-hero__image-wrap">
          <div className="cat-hero__image-placeholder">
            <span>🥟</span>
          </div>
        </div>
        <p className="cat-hero__tagline">
          Producto congelados listos para freír<br />
          Alta rotación • Fácil preparación • Excelente margen
        </p>
        <a
          href={`${WHATSAPP_LINK}?text=Hola! Quiero ver el catálogo y hacer un pedido`}
          className="cat-hero__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pide ahora por WhatsApp
        </a>
        <p className="cat-hero__phone">+57 3046028579</p>
      </section>

      {/* Info cards */}
      <InfoCards />

      {/* Secciones de productos */}
      {catalogSections.map((section) => (
        <section key={section.id} className="cat-section">
          <div className="cat-section__products">
            {section.productos.map((producto) => (
              <ProductCatalogCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      ))}

      {/* Información Importante */}
      <InfoImportante />

      {/* Combos */}
      <CombosSection />

      {/* Footer de marca */}
      <BrandFooter />
    </div>
  );
}

export default Catalogo;
