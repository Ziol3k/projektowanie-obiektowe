import "./App.css";
import { Link, Route, Routes } from "react-router";
import { Products } from "./components/Products";
import { Payments } from "./components/Payments";
import { Cart } from "./components/Cart";
import { useCart } from "./context/CartContext";

function App() {
  const { totalAmount, clearCart } = useCart();

  return (
    <main>
      <nav>
        <Link to="/">Produkty</Link>
        <Link to="/cart">Koszyk</Link>
        <Link to="/payments">Płatności</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/payments"
          element={<Payments amount={totalAmount} onPaymentSuccess={clearCart} />}/>
      </Routes>
    </main>
  );
}

export default App;