import "./App.css";
import { Link, Route, Routes } from "react-router";
import { Products } from "./components/Products";
import { Payments } from "./components/Payments";
import { Cart } from "./components/Cart";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { Account } from "./components/Account";
import { useCart } from "./context/useCart";

function App() {
  const { totalAmount, clearCart } = useCart();

  return (
    <main>
      <nav>
        <Link to="/">Produkty</Link>
        <Link to="/cart">Koszyk</Link>
        <Link to="/payments">Płatności</Link>
        <Link to="/register">Rejestracja</Link>
        <Link to="/login">Logowanie</Link>
        <Link to="/account">Konto</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/payments"
          element={<Payments amount={totalAmount} onPaymentSuccess={clearCart} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </main>
  );
}

export default App;