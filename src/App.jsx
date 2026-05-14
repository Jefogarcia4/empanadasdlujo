import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import LandingPage from './components/landing/LandingPage';
import CartPage from './components/CartPage';
import { fetchProducts } from './services/api';
import './styles/App.css';
import './styles/Landing.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState('landing');
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
          {!loadingProducts && !errorProducts && <ProductGrid products={filteredProducts} />}
        </main>
        <Cart onNavigate={setCurrentPage} />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
