import { useEffect, useState } from "react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { httpClient } from "../api/httpClient";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await httpClient.get<Product[]>("/products");
        setProducts(response.data);
      } catch {
        setError("Wystąpił błąd podczas pobierania produktów.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Ładowanie produktów...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Produkty</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>
              {product.name} — {product.price} zł
            </span>

            <button type="button" onClick={() => addToCart(product)}>
              Dodaj do koszyka
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}