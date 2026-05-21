import { createContext } from "react";
import type { Product } from "../types";

export type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalAmount: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);