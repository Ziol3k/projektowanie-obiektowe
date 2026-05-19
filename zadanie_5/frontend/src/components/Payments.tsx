import { FormEvent, useState } from "react";
import type { PaymentData } from "../types";

type PaymentsProps = {
  amount: number;
  onPaymentSuccess?: () => void;
};

export function Payments({ amount, onPaymentSuccess }: PaymentsProps) {
  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const paymentData: PaymentData = {
      fullName,
      cardNumber,
      amount,
    };

    try {
      const response = await fetch("http://localhost:3001/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      onPaymentSuccess?.();
    } catch {
      setMessage("Nie udało się wysłać płatności.");
    }
  }

  return (
    <section>
      <h2>Płatności</h2>

      <p>
        Kwota do zapłaty: <strong>{amount} zł</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Imię i nazwisko:
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Numer karty:
            <input
              type="text"
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Kwota:
            <input type="number" value={amount} readOnly />
          </label>
        </div>

        <button type="submit" disabled={amount <= 0}>
          Zapłać
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}