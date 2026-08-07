import { useState, useEffect, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CartFab from './components/CartFab';
import CartProgressToast from './components/CartProgressToast';
import WhatsAppFab from './components/WhatsAppFab';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import LandingPage from './components/landing/LandingPage';
import CartPage from './components/CartPage';
import ProductDetail from './components/ProductDetail';
import PedidoDetailPage from './components/PedidoDetailPage';
import CarritoWhatsAppPage from './components/CarritoWhatsAppPage';
import MisPedidosPage from './components/MisPedidosPage';
import AdminApp from './components/admin/AdminApp';
import EnConstruccionPage from './components/EnConstruccionPage';
import NosotrosPage from './components/nosotros/NosotrosPage';
import NegociosPage from './components/negocios/NegociosPage';
import CatalogoFiltros, { CatalogoVacio } from './components/CatalogoFiltros';
import VitrinaIntro from './components/VitrinaIntro';
import VitrinaCondiciones from './components/VitrinaCondiciones';
import VitrinaAyuda from './components/VitrinaAyuda';
import { PAGE_PATHS, EN_CONSTRUCCION } from './config/navigation';
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

// Quita la barra final y normaliza a minúsculas para comparar con PAGE_PATHS.
function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  return clean === '' ? '/' : clean;
}

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
  // Páginas del menú principal (Inicio, Productos, secciones en construcción…).
  const normalized = normalizePath(path);
  const entry = Object.entries(PAGE_PATHS).find(([, p]) => p === normalized);
  return { page: entry ? entry[0] : 'tienda', pedidoId: null, carritoToken: null };
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
    } else {
      // Las páginas sin ruta propia (carrito, detalle de producto) se muestran
      // sobre la raíz del sitio.
      const path = PAGE_PATHS[page] ?? '/';
      if (path !== normalizePath(window.location.pathname)) {
        window.history.pushState({}, '', path);
      }
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

  // Productos y combos comparten la grilla de la vitrina; los combos van al
  // final porque su tarjeta es más alta.
  const vitrinaItems = useMemo(
    () => [
      ...(mostrarProductos ? filteredProducts : []),
      ...(mostrarCombos ? filteredCombos : []),
    ],
    [mostrarProductos, filteredProducts, mostrarCombos, filteredCombos]
  );

  const limpiarFiltros = () => {
    setCategoria(TODOS);
    setBusqueda('');
    setTamano(TODOS_TAMANOS);
  };

  // "Ver combos" del bloque de ayuda: activa la categoría Combos, restablece el
  // tamaño, descarta una búsqueda que dejaría la lista vacía y lleva el foco al
  // catálogo.
  const verCombos = () => {
    setCategoria(COMBOS);
    setTamano(TODOS_TAMANOS);
    if (filtrarCombos(combos, busqueda).length === 0) setBusqueda('');
    document
      .querySelector('.vitrina-block')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (currentPage === 'admin') {
    return <AdminApp />;
  }

  if (currentPage === 'negocios') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <NegociosPage onNavigate={handleNavigate} />
          <WhatsAppFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'nosotros') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <NosotrosPage onNavigate={handleNavigate} />
          <WhatsAppFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
        </div>
      </CartProvider>
    );
  }

  if (EN_CONSTRUCCION[currentPage]) {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          <EnConstruccionPage page={currentPage} onNavigate={handleNavigate} />
          <WhatsAppFab />
          {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
        </div>
      </CartProvider>
    );
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
          <CartProgressToast />
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
          <CartProgressToast />
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
          <CartProgressToast />
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
              <VitrinaIntro />

              <VitrinaCondiciones />

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
                <CatalogoVacio onLimpiar={limpiarFiltros} />
              ) : (
                <ProductGrid
                  products={vitrinaItems}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              <VitrinaAyuda onVerCombos={verCombos} onNavigate={handleNavigate} />
            </>
          )}
        </main>
        <Cart onNavigate={handleNavigate} />
        <WhatsAppFab />
        <CartFab />
        <CartProgressToast />
        {/* Footer deshabilitado temporalmente — descomentar para reactivar */}
          {/* <Footer onNavigate={handleNavigate} /> */}
      </div>
    </CartProvider>
  );
}

export default App;
