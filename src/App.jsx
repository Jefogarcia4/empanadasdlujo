import { useState, useEffect, useMemo } from 'react';
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
import MisPedidosPage from './components/MisPedidosPage';
import CombosShowcase from './components/CombosShowcase';
import AdminApp from './components/admin/AdminApp';
import CatalogoFiltros from './components/CatalogoFiltros';
import {
  TODOS,
  TODOS_TAMANOS,
  COMBOS,
  buildCategorias,
  buildTamanos,
  filtrarProductos,
  filtrarCombos,
} from './utils/catalogoFiltros';
import { fetchProducts, fetchCombos } from './services/api';
import './styles/App.css';
import './styles/Landing.css';

function parseRoute() {
  const path = window.location.pathname;
  if (/^\/admin\/?$/i.test(path)) {
    return { page: 'admin', pedidoId: null, carritoToken: null };
  }
  if (/^\/mis-pedidos\/?$/i.test(path)) {
    return { page: 'mis_pedidos', pedidoId: null, carritoToken: null };
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
  // Acceso temporal por URL a la landing mientras se prueba antes de publicarla
  // como inicio del sitio (el menú Inicio/Vitrina está oculto).
  if (/^\/inicio\/?$/i.test(path)) {
    return { page: 'landing', pedidoId: null, carritoToken: null };
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
  const [combos, setCombos] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(true);

  // Filtros de la vitrina
  const [categoria, setCategoria] = useState(TODOS);
  const [busqueda, setBusqueda] = useState('');
  const [tamano, setTamano] = useState(TODOS_TAMANOS);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
  };

  const handleNavigate = (page, opts) => {
    if (page === 'pedido_detail' && opts?.pedidoId) {
      setSelectedPedidoId(opts.pedidoId);
      window.history.pushState({}, '', `/pedido/${opts.pedidoId}`);
    } else if (page === 'mis_pedidos') {
      window.history.pushState({}, '', '/mis-pedidos');
    } else if (
      (currentPage === 'pedido_detail' || currentPage === 'carrito_whatsapp' || currentPage === 'mis_pedidos' || currentPage === 'landing') &&
      page !== 'pedido_detail' &&
      page !== 'landing'
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
    fetchCombos()
      .then((data) => setCombos(data))
      .catch(() => setCombos([]))
      .finally(() => setLoadingCombos(false));
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

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const categorias = useMemo(
    () => buildCategorias(activeProducts, combos.length > 0),
    [activeProducts, combos.length]
  );
  const tamanos = useMemo(() => buildTamanos(activeProducts), [activeProducts]);

  const filteredProducts = useMemo(
    () => filtrarProductos(activeProducts, { categoria, busqueda, tamano }),
    [activeProducts, categoria, busqueda, tamano]
  );
  const filteredCombos = useMemo(() => filtrarCombos(combos, busqueda), [combos, busqueda]);

  const mostrarProductos = categoria !== COMBOS;
  const mostrarCombos = categoria === TODOS || categoria === COMBOS;
  const resultCount =
    (mostrarProductos ? filteredProducts.length : 0) +
    (mostrarCombos ? filteredCombos.length : 0);

  const limpiarFiltros = () => {
    setCategoria(TODOS);
    setBusqueda('');
    setTamano(TODOS_TAMANOS);
  };

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

  if (currentPage === 'mis_pedidos') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <MisPedidosPage onNavigate={handleNavigate} />
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
              <div className="tienda-section-header">
                <h2 className="tienda-section-header__title">
                  Vitrina digital
                </h2>
                <p className="tienda-section-header__sub">Congelados listos para freír · Alta rotación · Excelente margen</p>
              </div>

              <CatalogoFiltros
                categorias={categorias}
                categoria={categoria}
                onCategoriaChange={setCategoria}
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
                tamanos={tamanos}
                tamano={tamano}
                onTamanoChange={setTamano}
                resultCount={resultCount}
              />

              {resultCount === 0 && !loadingCombos ? (
                <div className="cfiltros-empty">
                  <div className="cfiltros-empty__emoji">🔍</div>
                  <p className="cfiltros-empty__title">No encontramos productos</p>
                  <p className="cfiltros-empty__text">
                    Prueba con otra búsqueda o cambia los filtros.
                  </p>
                  <button type="button" className="cfiltros-empty__btn" onClick={limpiarFiltros}>
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <>
                  {mostrarCombos && (
                    <CombosShowcase
                      combos={filteredCombos}
                      loading={loadingCombos}
                      description="Ideales si no quieres pedir 10 paquetes o si vas a lanzar nuevos productos. Precio fijo: agrégalos al carrito como cualquier producto."
                    />
                  )}
                  {mostrarProductos && filteredProducts.length > 0 && (
                    <ProductGrid products={filteredProducts} onSelectProduct={handleSelectProduct} />
                  )}
                </>
              )}
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
