import { FiGrid, FiShoppingBag, FiPackage, FiTag, FiInfo } from 'react-icons/fi';
import { MIN_PACKAGES, WHOLESALE_THRESHOLD } from '../config/constants';

// Encabezado de la vitrina: presenta el portafolio y deja explícitas las tres
// condiciones de compra antes de que el cliente empiece a agregar productos.
const FEATURES = [
  {
    key: 'minima',
    icon: <FiShoppingBag aria-hidden="true" />,
    label: 'Compra mínima',
    title: 'Compra desde ',
    highlight: `${MIN_PACKAGES} paquetes`,
    desc: 'Combina referencias del portafolio según lo que necesites.',
    descShort: 'Combina referencias del portafolio según lo que necesites.',
  },
  {
    key: 'mayorista',
    icon: <FiPackage aria-hidden="true" />,
    label: 'Precio mayorista',
    title: 'Desde ',
    highlight: `${WHOLESALE_THRESHOLD} paquetes combinados`,
    desc: `Al alcanzar ${WHOLESALE_THRESHOLD} paquetes combinados, se aplican los precios mayoristas a todas las referencias elegibles del pedido.`,
    descShort:
      'Se aplican precios mayoristas a las referencias elegibles del pedido.',
  },
  {
    key: 'combos',
    icon: <FiTag aria-hidden="true" />,
    label: 'Combos',
    title: 'Combos con ',
    highlight: 'precio especial',
    desc: 'Los combos ya incluyen una condición especial y no reciben descuento mayorista adicional.',
    descShort: 'No reciben descuento mayorista adicional.',
  },
];

// Ilustración de línea que ocupa el espacio de la foto mientras no haya una
// imagen definitiva. Al pasar `image` se reemplaza por la foto real.
function IntroArtwork() {
  return (
    <svg className="vintro__artwork" viewBox="0 0 420 260" role="img" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Arcos punteados que enlazan los tres formatos */}
        <path d="M78 128C78 74 138 40 196 40s118 34 118 88" strokeDasharray="2 9" opacity="0.55" />
        <path d="M108 150C108 106 152 78 200 78s92 28 92 72" strokeDasharray="2 9" opacity="0.35" />

        {/* Empanada pequeña */}
        <g transform="translate(52 120)">
          <path d="M2 34a34 34 0 0 1 68 0" />
          <path d="M2 34q4 7 8 0t8 0 8 0 8 0 8 0 8 0 8 0 8 0 4 0" />
        </g>

        {/* Empanada grande */}
        <g transform="translate(150 96)">
          <path d="M2 44a44 44 0 0 1 88 0" />
          <path d="M2 44q5 8 10 0t10 0 10 0 10 0 10 0 10 0 10 0 10 0 8 0" />
        </g>

        {/* Caja de despacho */}
        <g transform="translate(272 106)">
          <path d="M4 30h84v56H4z" />
          <path d="M4 30 20 6h52l16 24" />
          <path d="M46 6v24" />
          <path d="M34 48h24" />
        </g>
      </g>
    </svg>
  );
}

function VitrinaIntro({ image = null }) {
  return (
    <section className="vintro">
      <div className="vintro__main">
        <div className="vintro__copy">
          <span className="vintro__eyebrow">
            <span className="vintro__eyebrow-icon">
              <FiGrid aria-hidden="true" />
            </span>
            Nuestros productos
          </span>

          <h1 className="vintro__title">Encuentra el formato que necesitas</h1>
          <span className="vintro__rule" aria-hidden="true" />

          <p className="vintro__lead">
            Explora empanadas, pasteles y combos congelados listos para freír.
            <br />
            Compara tamaños, rellenos, cantidades y precios antes de agregarlos a tu
            carrito.
          </p>
        </div>

        <div className="vintro__art">
          {image ? (
            <img src={image} alt="Portafolio de Empanadas D'lujo" className="vintro__photo" />
          ) : (
            <IntroArtwork />
          )}
        </div>
      </div>

      <ul className="vintro__features">
        {FEATURES.map((f) => (
          <li key={f.key} className="vintro__feature">
            <span className="vintro__feature-icon">{f.icon}</span>
            <div className="vintro__feature-text">
              <span className="vintro__feature-label">{f.label}</span>
              <p className="vintro__feature-title">
                {f.title}
                <strong>{f.highlight}</strong>
              </p>
              <p className="vintro__feature-desc">{f.desc}</p>
              <p className="vintro__feature-desc vintro__feature-desc--short">
                {f.descShort}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="vintro__note">
        <span className="vintro__note-icon">
          <FiInfo aria-hidden="true" />
        </span>
        La disponibilidad de las referencias y la fecha de despacho se confirman después
        de enviar el pedido.
      </p>
    </section>
  );
}

export default VitrinaIntro;
