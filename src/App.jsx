import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import { products } from './data/products';
import './styles/App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState('home');

  const filteredProducts = activeCategory === 'Todas'
    ? products.filter(p => p.active)
    : products.filter(p => p.category === activeCategory && p.active);

  if (currentPage === 'catalogo') {
    return (
      <CartProvider>
        <div className="app">
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          <Catalogo />
        </div>
      </CartProvider>
    );
  }

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
