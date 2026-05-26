import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

const WHOLESALE_THRESHOLD = 10;

function isCoctelera(item) {
  return item?.name === 'Empanada Pequeña';
}

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
    let cocteleraQty = 0;
    let combinableQty = 0;
    for (const item of cartItems) {
      if (isCoctelera(item)) cocteleraQty += item.quantity;
      else combinableQty += item.quantity;
    }

    const cocteleraQualifies = cocteleraQty >= WHOLESALE_THRESHOLD;
    const combinableQualifies = combinableQty >= WHOLESALE_THRESHOLD;

    const items = cartItems.map((item) => {
      const coctelera = isCoctelera(item);
      const groupQualifies = coctelera ? cocteleraQualifies : combinableQualifies;
      const canUseWholesale = groupQualifies && item.wholesalePrice > 0;
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
    const totalToPay = items.reduce((sum, it) => sum + it.lineTotal, 0);
    const discount = subtotal - totalToPay;

    return {
      items,
      subtotal,
      totalToPay,
      discount,
      hasDiscount: discount > 0,
      cocteleraQty,
      combinableQty,
    };
  }, [cartItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const value = {
    cartItems,
    cartItemsPricing: pricing.items,
    subtotal: pricing.subtotal,
    totalToPay: pricing.totalToPay,
    discount: pricing.discount,
    hasDiscount: pricing.hasDiscount,
    cocteleraQty: pricing.cocteleraQty,
    combinableQty: pricing.combinableQty,
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
