import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import LandingPage from './components/landing/LandingPage';
import { products } from './data/products';
import './styles/App.css';
import './styles/Landing.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState('landing');

  const filteredProducts = activeCategory === 'Todas'
    ? products.filter(p => p.active)
    : products.filter(p => p.category === activeCategory && p.active);

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
          <Cart />
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
          <ProductGrid products={filteredProducts} />
        </main>
        <Cart />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
