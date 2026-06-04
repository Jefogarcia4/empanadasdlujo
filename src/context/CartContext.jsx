import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { trackAddToCart } from '../services/metaPixel';
import { DELIVERY_FEE } from '../config/constants';

const CartContext = createContext();

const WHOLESALE_THRESHOLD = 10;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    trackAddToCart(product);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const pricing = useMemo(() => {
    // Los combos tienen precio fijo: no suman al umbral ni se reprecian a mayorista.
    const totalQty = cartItems.reduce(
      (sum, it) => sum + (it.isCombo ? 0 : it.quantity),
      0
    );
    const qualifiesWholesale = totalQty >= WHOLESALE_THRESHOLD;

    const items = cartItems.map((item) => {
      const canUseWholesale =
        qualifiesWholesale && !item.isCombo && item.wholesalePrice > 0;
      const effectivePrice = canUseWholesale ? item.wholesalePrice : item.price;
      return {
        ...item,
        appliesWholesale: canUseWholesale,
        effectivePrice,
        lineRetail: item.price * item.quantity,
        lineTotal: effectivePrice * item.quantity,
      };
    });

    const subtotal = items.reduce((sum, it) => sum + it.lineRetail, 0);
    const itemsTotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const discount = subtotal - itemsTotal;
    const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
    const totalToPay = itemsTotal + deliveryFee;

    return {
      items,
      subtotal,
      itemsTotal,
      deliveryFee,
      totalToPay,
      discount,
      hasDiscount: discount > 0,
      qualifiesWholesale,
    };
  }, [cartItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const value = {
    cartItems,
    cartItemsPricing: pricing.items,
    subtotal: pricing.subtotal,
    deliveryFee: pricing.deliveryFee,
    totalToPay: pricing.totalToPay,
    discount: pricing.discount,
    hasDiscount: pricing.hasDiscount,
    qualifiesWholesale: pricing.qualifiesWholesale,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
