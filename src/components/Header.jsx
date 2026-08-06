import { useState, useEffect } from 'react';
import {
  FaBoxOpen,
  FaMotorcycle,
  FaStopwatch,
  FaUser,
  FaShoppingCart,
  FaHome,
  FaBriefcase,
  FaStore,
  FaClipboardCheck,
  FaUsers,
  FaHeadset,
  FaTimes,
  FaChevronRight,
  FaWhatsapp,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import ClienteLoginModal from './ClienteLoginModal';
import { isClienteAuthenticated } from '../services/clienteAuth';
import { MENU_ITEMS, WHATSAPP_COMERCIAL } from '../config/navigation';

// Íconos del menú, por la clave declarada en MENU_ITEMS.
const MENU_ICONS = {
  home: FaHome,
  briefcase: FaBriefcase,
  store: FaStore,
  quality: FaClipboardCheck,
  users: FaUsers,
  contact: FaHeadset,
};

// Páginas que son "hijas" de Productos: mantienen esa opción marcada.
const PAGE_ALIASES = {
  product_detail: 'tienda',
  catalogo: 'tienda',
};

function Header({ currentPage, onNavigate }) {
  const { totalItems } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const authed = isClienteAuthenticated();
  const activePage = PAGE_ALIASES[currentPage] ?? currentPage;

  // Con el menú abierto: cerrar con Escape y bloquear el scroll del fondo.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const go = (page) => {
    setMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0 });
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
    <header className={`header${menuOpen ? ' header--menu-open' : ''}`}>
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
        <button
          type="button"
          className={`header-hamburger${menuOpen ? ' header-hamburger--open' : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header-hamburger__bars" aria-hidden="true">
            <span className="header-hamburger__bar" />
            <span className="header-hamburger__bar" />
            <span className="header-hamburger__bar" />
          </span>
          <span className="header-hamburger__label">Menú</span>
        </button>

        <div className="logo" onClick={() => go('tienda')}>
          <img src="/fondo_menu.png" alt="Empanadas D'lujo" className="logo-img" />
        </div>

        <div className="header-actions">
          <button className="header-login" onClick={handleIngreso}>
            <FaUser aria-hidden="true" />
            <span className="header-login__text">{authed ? 'Mis pedidos' : 'Ingreso'}</span>
          </button>
          <button className="cart-button" onClick={() => go('cart')} aria-label="Ver carrito">
            <FaShoppingCart aria-hidden="true" />
            <span className="cart-button__text">Carrito</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Menú hamburguesa: panel lateral + fondo oscuro */}
      <div
        className={`header-drawer-overlay${menuOpen ? ' header-drawer-overlay--open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="menu-principal"
        className={`header-drawer${menuOpen ? ' header-drawer--open' : ''}`}
        aria-label="Menú principal"
        aria-hidden={!menuOpen}
      >
        <div className="header-drawer__head">
          <span className="header-drawer__title">Menú</span>
          <button
            type="button"
            className="header-drawer__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            tabIndex={menuOpen ? 0 : -1}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <ul className="header-drawer__list">
          {MENU_ITEMS.map(({ page, label, icon }) => {
            const Icon = MENU_ICONS[icon];
            const active = activePage === page;
            return (
              <li key={page}>
                <button
                  type="button"
                  className={`header-drawer__link${active ? ' header-drawer__link--active' : ''}`}
                  onClick={() => go(page)}
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="header-drawer__icon" aria-hidden="true" />
                  <span className="header-drawer__label">{label}</span>
                  <FaChevronRight className="header-drawer__chevron" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="header-drawer__foot">
          <button
            type="button"
            className="header-drawer__account"
            onClick={handleIngreso}
            tabIndex={menuOpen ? 0 : -1}
          >
            <FaUser aria-hidden="true" /> {authed ? 'Mis pedidos' : 'Ingresar a mi cuenta'}
          </button>
          <a
            className="header-drawer__wa"
            href={`https://wa.me/${WHATSAPP_COMERCIAL}`}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            <FaWhatsapp aria-hidden="true" /> Asesoría comercial
          </a>
        </div>
      </nav>

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
