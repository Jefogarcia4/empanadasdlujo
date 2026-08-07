import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DELIVERY_FEE, WHOLESALE_THRESHOLD } from '../config/constants';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, quantity = 1) => {
    const qty = Math.max(1, Math.trunc(Number(quantity)) || 1);
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
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

  // Carga masiva del carrito (reemplaza su contenido). La usa el flujo de carrito por
  // WhatsApp para precargar los items del borrador antes de mostrar el checkout.
  const hydrateCart = useCallback((items) => {
    setCartItems(Array.isArray(items) ? items : []);
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
    hydrateCart,
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
