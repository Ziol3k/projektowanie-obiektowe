import { useContext } from "react";
import { CartContext } from "./cartContext";

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart musi być używany wewnątrz CartProvider.");
  }

  return context;
}