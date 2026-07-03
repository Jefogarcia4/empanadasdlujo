import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CartFab from './components/CartFab';
import WhatsAppFab from './components/WhatsAppFab';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import LandingPage from './components/landing/LandingPage';
import CartPage from './components/CartPage';
import ProductDetail from './components/ProductDetail';
import PedidoDetailPage from './components/PedidoDetailPage';
import CarritoWhatsAppPage from './components/CarritoWhatsAppPage';
import CombosShowcase from './components/CombosShowcase';
import AdminApp from './components/admin/AdminApp';
import { fetchProducts } from './services/api';
import './styles/App.css';
import './styles/Landing.css';

function parseRoute() {
  const path = window.location.pathname;
  if (/^\/admin\/?$/i.test(path)) {
    return { page: 'admin', pedidoId: null, carritoToken: null };
  }
  const match = path.match(/^\/pedido\/(\d+)\/?$/i);
  if (match) {
    return { page: 'pedido_detail', pedidoId: Number(match[1]), carritoToken: null };
  }
  const carritoMatch = path.match(
    /^\/carrito\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i
  );
  if (carritoMatch) {
    return { page: 'carrito_whatsapp', pedidoId: null, carritoToken: carritoMatch[1] };
  }
  return { page: 'tienda', pedidoId: null, carritoToken: null };
}

function App() {
  const initial = parseRoute();
  const [currentPage, setCurrentPage] = useState(initial.page);
  const [selectedPedidoId, setSelectedPedidoId] = useState(initial.pedidoId);
  const [carritoToken, setCarritoToken] = useState(initial.carritoToken);
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
    } else if (
      (currentPage === 'pedido_detail' || currentPage === 'carrito_whatsapp') &&
      page !== 'pedido_detail'
    ) {
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
      setCarritoToken(r.carritoToken);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const filteredProducts = products.filter(p => p.active);

  if (currentPage === 'admin') {
    return <AdminApp />;
  }

  if (currentPage === 'pedido_detail') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <PedidoDetailPage pedidoId={selectedPedidoId} onNavigate={handleNavigate} />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'carrito_whatsapp') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <CarritoWhatsAppPage token={carritoToken} onNavigate={handleNavigate} />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
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
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
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
          <WhatsAppFab />
          <CartFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
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
          <WhatsAppFab />
          <CartFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
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
          <WhatsAppFab />
          <CartFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
        </div>
      </CartProvider>
    );
  }

  // tienda
  return (
    <CartProvider>
      <div className="app">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content">
          {loadingProducts && <p className="products-status">Cargando productos...</p>}
          {errorProducts && <p className="products-status products-status--error">Error al cargar productos: {errorProducts}</p>}
          {!loadingProducts && !errorProducts && (
            <>
              <CombosShowcase
                description="Ideales si no quieres pedir 10 paquetes o si vas a lanzar nuevos productos. Precio fijo: agrégalos al carrito como cualquier producto."
              />
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
        <Cart onNavigate={handleNavigate} />
        <WhatsAppFab />
        <CartFab />
        {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
      </div>
    </CartProvider>
  );
}

export default App;
