import { useRef } from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onSelectProduct }) {
  const trackRef = useRef(null);

  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos en esta categoría.</p>
      </div>
    );
  }

  // Desplaza ~1.5 tarjetas en la dirección indicada (-1 izq, 1 der).
  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.pcard');
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step * 1.5, behavior: 'smooth' });
  };

  return (
    <div className="products-carousel">
      <button
        type="button"
        className="products-carousel__nav products-carousel__nav--prev"
        onClick={() => scrollByCards(-1)}
        aria-label="Productos anteriores"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <div className="products-carousel__track" ref={trackRef}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>

      <button
        type="button"
        className="products-carousel__nav products-carousel__nav--next"
        onClick={() => scrollByCards(1)}
        aria-label="Productos siguientes"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default ProductGrid;
