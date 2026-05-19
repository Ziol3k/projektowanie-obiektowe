import { useEffect, useState } from "react";
import type { Product } from "../types";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3001/api/products");

        if (!response.ok) {
          throw new Error("Nie udało się pobrać produktów.");
        }

        const data: Product[] = await response.json();
        setProducts(data);
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
            {product.name} — {product.price} zł
          </li>
        ))}
      </ul>
    </section>
  );
}