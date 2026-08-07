import ProductCard from './ProductCard';

// Bloque "Productos disponibles" de la vitrina: una sola grilla para productos
// y combos (3 columnas en escritorio, 2 en tableta, 1 en móvil).
function ProductGrid({
  products,
  onSelectProduct,
  title = 'Productos disponibles',
  subtitle = 'Selecciona la cantidad de paquetes y agrégalos directamente a tu carrito.',
}) {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No se encontraron productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <section className="vitrina-block">
      <header className="vitrina-block__head">
        <h2 className="vitrina-block__title">{title}</h2>
        {subtitle && <p className="vitrina-block__sub">{subtitle}</p>}
      </header>

      <div className="vitrina-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
