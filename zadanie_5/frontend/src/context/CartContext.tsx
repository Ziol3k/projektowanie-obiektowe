import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { Product } from "../types";

type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  function addToCart(product: Product) {
    setCartItems((currentItems) => [...currentItems, product]);
  }

  function removeFromCart(productId: number) {
    setCartItems((currentItems) => {
      const indexToRemove = currentItems.findIndex(
        (item) => item.id === productId
      );

      if (indexToRemove === -1) {
        return currentItems;
      }

      return currentItems.filter((_, index) => index !== indexToRemove);
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart musi być używany wewnątrz CartProvider.");
  }

  return context;
}