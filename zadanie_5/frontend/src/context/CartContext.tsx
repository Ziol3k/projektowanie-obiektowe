import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types";
import { CartContext } from "./cartContext";

type CartProviderProps = Readonly<{
  children: ReactNode;
}>;

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

  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalAmount,
    }),
    [cartItems, totalAmount]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}