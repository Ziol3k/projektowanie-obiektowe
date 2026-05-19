import "./App.css";
import { Products } from "./components/Products";
import { Payments } from "./components/Payments";

function App() {
  return (
    <main>
      <Products />
      <Payments amount={100} />
    </main>
  );
}

export default App;