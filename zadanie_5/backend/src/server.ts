import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

type Product = {
  id: number;
  name: string;
  price: number;
};

type PaymentRequest = {
  fullName: string;
  cardNumber: string;
  amount: number;
};

const products: Product[] = [
  { id: 1, name: "Laptop", price: 3500 },
  { id: 2, name: "Klawiatura", price: 250 },
  { id: 3, name: "Mysz", price: 120 },
];

app.get("/api/products", (_req: Request, res: Response) => {
  res.json(products);
});

app.post("/api/payments", (req: Request<{}, {}, PaymentRequest>, res: Response) => {
  const { fullName, cardNumber, amount } = req.body;

  if (!fullName || !cardNumber || !amount) {
    return res.status(400).json({
      message: "Brakuje wymaganych danych płatności.",
    });
  }

  return res.status(201).json({
    message: "Płatność została przyjęta.",
    payment: {
      fullName,
      amount,
      lastFourDigits: cardNumber.slice(-4),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});