import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types";
import { CartContext } from "./cartContext";

const CART_STORAGE_KEY = "cartItems";

type CartProviderProps = Readonly<{
  children: ReactNode;
}>;

function readCartFromStorage(): Product[] {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    return JSON.parse(storedCart) as Product[];
  } catch {
    return [];
  }
}

function saveCartToStorage(cartItems: Product[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Product[]>(readCartFromStorage);

  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const nextItems = [...currentItems, product];
      saveCartToStorage(nextItems);
      return nextItems;
    });
  }

  function removeFromCart(productId: number) {
    setCartItems((currentItems) => {
      const indexToRemove = currentItems.findIndex(
        (item) => item.id === productId
      );

      if (indexToRemove === -1) {
        return currentItems;
      }

      const nextItems = currentItems.filter(
        (_, index) => index !== indexToRemove
      );

      saveCartToStorage(nextItems);
      return nextItems;
    });
  }

  function clearCart() {
    setCartItems([]);
    saveCartToStorage([]);
  }

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY) {
        setCartItems(readCartFromStorage());
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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