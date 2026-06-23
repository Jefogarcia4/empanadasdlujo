import '../styles/Footer.css';

// Íconos de cabecera de cada columna (línea, heredan el color dorado).
const HEAD_ICONS = {
  warehouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5V21H3z" />
      <path d="M7 21v-6h10v6" />
      <path d="M9 13h6" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v16h16" />
      <path d="M7 15l3.5-3.5L13 14l5-5" />
      <path d="M14 9h4v4" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M3 4h2l2.2 11.2a1.4 1.4 0 0 0 1.4 1.1h8.4a1.4 1.4 0 0 0 1.4-1.1L21 8H6" />
    </svg>
  ),
  headset: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 14a2 2 0 0 1 2-2h1v5H6a2 2 0 0 1-2-2v-1z" />
      <path d="M20 14a2 2 0 0 0-2-2h-1v5h1a2 2 0 0 0 2-2v-1z" />
      <path d="M20 17v1a3 3 0 0 1-3 3h-3" />
    </svg>
  ),
};

// Estructura de las columnas. `page` es el destino sugerido dentro de la SPA
// (se navega con onNavigate); ajústalo cuando existan páginas dedicadas.
const LINK_COLUMNS = [
  {
    title: 'Conócenos',
    icon: 'warehouse',
    links: [
      { label: 'Sobre Empanadas D’lujo', page: 'landing' },
      { label: 'Nuestra fábrica', page: 'landing' },
      { label: 'Productos congelados listos para freír', page: 'tienda' },
      { label: 'Cobertura en Medellín y área metropolitana', page: 'landing' },
    ],
  },
  {
    title: 'Gana dinero con nosotros',
    icon: 'chart',
    links: [
      { label: 'Vende empanadas D’lujo', page: 'landing' },
      { label: 'Rentabilidad para negocios', page: 'landing' },
      { label: 'Precio por mayor', page: 'catalogo' },
      { label: 'Casos de uso', page: 'landing' },
      { label: 'Puestos de fritos y cafeterías', page: 'landing' },
      { label: 'Catering e instituciones', page: 'landing' },
    ],
  },
  {
    title: 'Información de compra',
    icon: 'cart',
    links: [
      { label: 'Compra mínima', page: 'tienda' },
      { label: 'Precio por mayor desde 10 paquetes', page: 'tienda' },
      { label: 'Métodos de pago', page: 'cart' },
      { label: 'Despachos y entregas', page: 'landing' },
      { label: 'Preguntas frecuentes', page: 'landing' },
    ],
  },
  {
    title: '¿Necesitas ayuda?',
    icon: 'headset',
    links: [
      { label: 'Radicar una PQR', page: 'landing' },
      { label: 'Garantías y novedades', page: 'landing' },
      { label: 'Estado de tu pedido', page: 'landing' },
      { label: 'Ayuda con tu compra', page: 'landing' },
      { label: 'Contacto de asesoría', page: 'landing' },
    ],
  },
];

// Redes sociales — reemplaza los enlaces por los perfiles reales.
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/empanadasdlujo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@empanadasdlujo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M14 3h2.3a5.3 5.3 0 0 0 4.2 4.2v2.4a7.6 7.6 0 0 1-4.2-1.3v6.4A5.7 5.7 0 1 1 10.6 9v2.5a3.2 3.2 0 1 0 2.9 3.2V3z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/empanadasdlujo',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M14 8.5V7c0-.8.4-1.2 1.3-1.2H17V3h-2.5C11.9 3 11 4.5 11 6.6v1.9H8.7V12H11v9h3v-9h2.4l.4-3.5H14z" />
      </svg>
    ),
  },
];

const LEGAL_LINKS = [
  { label: 'Términos y condiciones', page: 'landing' },
  { label: 'Política de privacidad', page: 'landing' },
  { label: 'Tratamiento de datos', page: 'landing' },
  { label: 'Políticas de garantía', page: 'landing' },
  { label: "PQR's", page: 'landing' },
];

const arrowUp = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);

const flourish = (
  <svg className="site-footer__flourish" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 5l14 4" />
    <path d="M1 12h18" />
    <path d="M3 19l14-4" />
  </svg>
);

function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const go = (page) => {
    if (page && onNavigate) onNavigate(page);
  };

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="site-footer">
      {/* Volver arriba */}
      <div className="site-footer__top">
        <button type="button" className="site-footer__totop" onClick={scrollTop}>
          {arrowUp}
          <span>Volver arriba</span>
        </button>
      </div>

      <div className="site-footer__body">
        {/* Columnas de enlaces */}
        <nav className="site-footer__cols" aria-label="Enlaces del pie de página">
          {LINK_COLUMNS.map((col) => (
            <div key={col.title} className="footer-col">
              <h3 className="footer-col__head">
                <span className="footer-col__icon">{HEAD_ICONS[col.icon]}</span>
                {col.title}
              </h3>
              <ul className="footer-col__links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button type="button" className="footer-link" onClick={() => go(link.page)}>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <hr className="site-footer__divider" />

        {/* Redes sociales */}
        <div className="site-footer__social">
          <span className="site-footer__social-title">Síguenos</span>
          <div className="site-footer__social-icons">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Marca */}
        <div className="site-footer__brand">
          <p className="site-footer__brand-name">
            {flourish}
            Empanadas D’lujo
            <span className="site-footer__flourish--right">{flourish}</span>
          </p>
          <p className="site-footer__brand-meta">
            Medellín, Colombia <span className="site-footer__dot">•</span> Despachos en el área metropolitana
          </p>
          <p className="site-footer__brand-tag">
            Empanadas y pasteles congelados listos para freír
          </p>
        </div>

        {/* Legal */}
        <div className="site-footer__legal">
          <ul className="site-footer__legal-links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <button type="button" className="footer-link footer-link--legal" onClick={() => go(link.page)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="site-footer__copy">
            © {currentYear} Empanadas D’lujo S.A.S. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
