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
import ProductDetail from './components/ProductDetail';
import PedidoDetailPage from './components/PedidoDetailPage';
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

function parseRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/pedido\/(\d+)\/?$/i);
  if (match) {
    return { page: 'pedido_detail', pedidoId: Number(match[1]) };
  }
  return { page: 'tienda', pedidoId: null };
}

function App() {
  const initial = parseRoute();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(initial.page);
  const [selectedPedidoId, setSelectedPedidoId] = useState(initial.pedidoId);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
  };

  const handleNavigate = (page, opts) => {
    if (page === 'pedido_detail' && opts?.pedidoId) {
      setSelectedPedidoId(opts.pedidoId);
      window.history.pushState({}, '', `/pedido/${opts.pedidoId}`);
    } else if (currentPage === 'pedido_detail' && page !== 'pedido_detail') {
      window.history.pushState({}, '', '/');
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setErrorProducts(err.message))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    const onPop = () => {
      const r = parseRoute();
      setCurrentPage(r.page);
      setSelectedPedidoId(r.pedidoId);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const filteredProducts = activeCategory === 'Todas'
    ? products.filter(p => p.active)
    : products.filter(p => p.category === activeCategory && p.active);

  if (currentPage === 'pedido_detail') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <PedidoDetailPage pedidoId={selectedPedidoId} onNavigate={handleNavigate} />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'cart') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <CartPage onNavigate={handleNavigate} />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'product_detail') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <ProductDetail product={selectedProduct} onNavigate={handleNavigate} />
          <Cart onNavigate={handleNavigate} />
          <CartFab />
          <Footer />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'catalogo') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <Catalogo />
          <Cart onNavigate={handleNavigate} />
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
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <LandingPage onNavigate={handleNavigate} />
          <Cart onNavigate={handleNavigate} />
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
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
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
                  Vitrina digital
                </h2>
                <p className="tienda-section-header__sub">Congelados listos para freír · Alta rotación · Excelente margen</p>
              </div>
              <ProductGrid products={filteredProducts} onSelectProduct={handleSelectProduct} />
            </>
          )}
        </main>
        <BulkBanner />
        <Cart onNavigate={handleNavigate} />
        <CartFab />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
