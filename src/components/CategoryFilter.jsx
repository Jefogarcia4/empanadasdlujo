import { categories } from '../data/products';

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <nav className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category === 'Empanadas' && '🥟 '}
          {category === 'Pasteles' && '🥧 '}
          {category === 'Masa' && '🌽 '}
          {category === 'Todas' && '📋 '}
          {category}
        </button>
      ))}
    </nav>
  );
}

export default CategoryFilter;
