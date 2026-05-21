import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CartFab from './components/CartFab';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import LandingPage from './components/landing/LandingPage';
import CartPage from './components/CartPage';
import { fetchProducts } from './services/api';
import './styles/App.css';
import './styles/Landing.css';

const WHATSAPP_BULK = 'https://wa.me/573046028579?text=Hola!%20Quiero%20armar%20un%20pedido%20por%20volumen';

function BulkBanner() {
  return (
    <section className="tienda-bulk">
      <h2 className="tienda-bulk__title">
        Compra 10 paquetes o más<br />y accede a precio por mayor
      </h2>
      <p className="tienda-bulk__desc">
        Puedes combinar referencias. Ideal para negocios, eventos, reuniones o familias que quieren ahorrar comprando más.
      </p>
      <div className="tienda-bulk__chips">
        <span className="tienda-bulk__chip">🔀 Combina referencias</span>
        <span className="tienda-bulk__chip">💰 Ahorra más</span>
        <span className="tienda-bulk__chip">✅ Ideal para vender</span>
      </div>
      <a
        href={WHATSAPP_BULK}
        className="tienda-bulk__btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Armar pedido por volumen
      </a>
    </section>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState('tienda');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setErrorProducts(err.message))
      .finally(() => setLoadingProducts(false));
  }, []);

  const filteredProducts = activeCategory === 'Todas'
    ? products.filter(p => p.active)
    : products.filter(p => p.category === activeCategory && p.active);

  if (currentPage === 'cart') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <CartPage onNavigate={setCurrentPage} />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'catalogo') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <Catalogo />
          <Cart onNavigate={setCurrentPage} />
          <CartFab />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'landing') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <LandingPage onNavigate={setCurrentPage} />
          <Cart onNavigate={setCurrentPage} />
          <CartFab />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  // tienda
  return (
    <CartProvider>
      <div className="app">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <Hero />
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <main className="main-content">
          {loadingProducts && <p className="products-status">Cargando productos...</p>}
          {errorProducts && <p className="products-status products-status--error">Error al cargar productos: {errorProducts}</p>}
          {!loadingProducts && !errorProducts && (
            <>
              <div className="tienda-section-header">
                <h2 className="tienda-section-header__title">
                  Nuestros Productos Estrella{' '}
                  <span className="emoji-apple" role="img" aria-label="estrella">⭐</span>
                </h2>
                <p className="tienda-section-header__sub">Congelados listos para freír · Alta rotación · Excelente margen</p>
              </div>
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </main>
        <BulkBanner />
        <Cart onNavigate={setCurrentPage} />
        <CartFab />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
