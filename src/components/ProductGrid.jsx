import ProductCard from './ProductCard';

function ProductGrid({ products, onSelectProduct }) {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
