import {
  FaCookieBite,
  FaDrumstickBite,
  FaBreadSlice,
  FaThLarge,
} from 'react-icons/fa';
import { categories } from '../data/products';

// Icono por categoría; las que no estén aquí se muestran solo con texto.
const CATEGORY_ICONS = {
  Empanadas: FaCookieBite,
  Pasteles: FaDrumstickBite,
  Masa: FaBreadSlice,
  Todas: FaThLarge,
};

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <nav className="category-filter">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        return (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {Icon && <Icon aria-hidden="true" />}
            {category}
          </button>
        );
      })}
    </nav>
  );
}

export default CategoryFilter;
