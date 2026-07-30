import { useState } from 'react';
import {
  FaBoxOpen,
  FaMotorcycle,
  FaStopwatch,
  FaUser,
  FaShoppingCart,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import ClienteLoginModal from './ClienteLoginModal';
import { isClienteAuthenticated } from '../services/clienteAuth';

function Header({ currentPage, onNavigate }) {
  const { totalItems } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const authed = isClienteAuthenticated();

  const go = (page) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const handleIngreso = () => {
    setMenuOpen(false);
    if (authed) {
      onNavigate('mis_pedidos');
    } else {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    onNavigate('mis_pedidos');
  };

  return (
    <header className="header">
      <div className="header-banner" role="note" aria-label="Anuncios de la tienda">
        <ul className="header-banner__list">
          <li className="header-banner__item">
            <FaBoxOpen className="header-banner__icon" aria-hidden="true" />
            <span>Compra <strong>10 paquetes o más</strong> y accede a precio por mayor</span>
          </li>
          <li className="header-banner__item">
            <FaMotorcycle className="header-banner__icon" aria-hidden="true" />
            <span>Envíos a domicilio en el <strong>Área Metropolitana</strong></span>
          </li>
          <li className="header-banner__item">
            <FaStopwatch className="header-banner__icon" aria-hidden="true" />
            <span><strong>Listas para freír</strong> en minutos · Alta rotación</span>
          </li>
          <li className="header-banner__item" aria-hidden="true">
            <FaBoxOpen className="header-banner__icon" />
            <span>Compra <strong>10 paquetes o más</strong> y accede a precio por mayor</span>
          </li>
        </ul>
      </div>
      <div className="header-content">
        <div className="logo" onClick={() => go('tienda')}>
          <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="logo-img" />
        </div>

        <button
          type="button"
          className={`header-hamburger${menuOpen ? ' header-hamburger--open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header-hamburger__bar" />
          <span className="header-hamburger__bar" />
          <span className="header-hamburger__bar" />
        </button>

        <div className={`header-menu${menuOpen ? ' header-menu--open' : ''}`}>
          {/* Menú Inicio/Vitrina oculto temporalmente mientras se prueba la
              landing antes de publicarla. Descomentar para reactivar. */}
          {/* <nav className="header-nav">
            <button
              className={`header-nav__link${currentPage === 'landing' ? ' header-nav__link--active' : ''}`}
              onClick={() => go('landing')}
            >
              Inicio
            </button>
            <button
              className={`header-nav__link${currentPage === 'tienda' ? ' header-nav__link--active' : ''}`}
              onClick={() => go('tienda')}
            >
              Vitrina
            </button>
          </nav> */}
          <button className="header-login" onClick={handleIngreso}>
            <FaUser aria-hidden="true" /> {authed ? 'Mis pedidos' : 'Ingreso'}
          </button>
          <button className="cart-button" onClick={() => go('cart')}>
            <FaShoppingCart aria-hidden="true" /> Carrito
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {showLogin && (
        <ClienteLoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </header>
  );
}

export default Header;
