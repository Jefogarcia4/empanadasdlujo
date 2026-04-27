import { useCart } from '../context/CartContext';

function Header({ currentPage, onNavigate }) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🥟</div>
          <h1>Empanadas <span>D'Lujo</span></h1>
        </div>
        <nav className="header-nav">
          <button
            className={`header-nav__link${currentPage === 'home' ? ' header-nav__link--active' : ''}`}
            onClick={() => onNavigate('home')}
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
        <button className="cart-button" onClick={openCart}>
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
