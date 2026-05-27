import { useCart } from '../context/CartContext';

function Header({ currentPage, onNavigate }) {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header-banner" role="note">
        <span className="header-banner__icon" aria-hidden="true">📦</span>
        <span className="header-banner__text">
          Compra <strong>10 paquetes o más</strong> y accede a precio por mayor
        </span>
      </div>
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('tienda')}>
          <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="logo-img" />
        </div>
        <nav className="header-nav">
          <button
            className={`header-nav__link${currentPage === 'landing' ? ' header-nav__link--active' : ''}`}
            onClick={() => onNavigate('landing')}
          >
            Inicio
          </button>
          <button
            className={`header-nav__link${currentPage === 'tienda' ? ' header-nav__link--active' : ''}`}
            onClick={() => onNavigate('tienda')}
          >
            Tienda
          </button>
          <button
            className={`header-nav__link${currentPage === 'catalogo' ? ' header-nav__link--active' : ''}`}
            onClick={() => onNavigate('catalogo')}
          >
            Catálogo
          </button>
        </nav>
        <button className="cart-button" onClick={() => onNavigate('cart')}>
          🛒 Carrito
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
