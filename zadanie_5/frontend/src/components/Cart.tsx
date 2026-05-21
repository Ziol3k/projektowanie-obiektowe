import { Link } from "react-router";
import { useCart } from "../context/useCart";

export function Cart() {
  const { cartItems, removeFromCart, clearCart, totalAmount } = useCart();

  return (
    <section>
      <h2>Koszyk</h2>

      {cartItems.length === 0 ? (
        <p>Twój koszyk jest aktualnie pusty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                <span>
                  {item.name} — {item.price} zł
                </span>

                <button type="button" onClick={() => removeFromCart(item.id)}>
                  Usuń
                </button>
              </li>
            ))}
          </ul>

          <p>
            <strong>Suma: {totalAmount} zł</strong>
          </p>

          <button type="button" onClick={clearCart}>
            Wyczyść koszyk
          </button>

          <p>
            <Link to="/payments">Przejdź do płatności</Link>
          </p>
        </>
      )}
    </section>
  );
}