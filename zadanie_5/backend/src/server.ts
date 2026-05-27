import express from "express";
import type { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type AccountRequest = {
  email: string;
};

type AccountSettingsRequest = {
  email: string;
  username: string;
};

type User = {
  name: string;
  email: string;
  password: string;
  username: string;
};

const products: Product[] = [
  { id: 1, name: "Laptop", price: 3500 },
  { id: 2, name: "Klawiatura", price: 250 },
  { id: 3, name: "Mysz", price: 120 },
];

const users: User[] = [
  {
    name: "Jan Testowy",
    email: "test@example.com",
    password: "Password123",
    username: "jan_testowy",
  },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasValidSession(req: Request) {
  return req.headers.authorization === "Bearer test-session-token";
}

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

app.post("/api/register", (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Wszystkie pola są wymagane.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      message: "Niepoprawny format adresu e-mail.",
    });
  }

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    return res.status(409).json({
      message: "Użytkownik o takim adresie e-mail już istnieje.",
    });
  }

  const username = name.toLowerCase().replaceAll(" ", "_");

  users.push({
    name,
    email,
    password,
    username,
  });

  return res.status(201).json({
    message: "Rejestracja zakończona sukcesem.",
    user: {
      name,
      email,
      username,
    },
  });
});

app.post("/api/login", (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(
    (currentUser) =>
      currentUser.email === email && currentUser.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Niepoprawny e-mail lub hasło.",
    });
  }

  return res.status(200).json({
    message: "Logowanie zakończone sukcesem.",
    sessionToken: "test-session-token",
    user: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });
});

app.post("/api/account", (req: Request<{}, {}, AccountRequest>, res: Response) => {
  if (!hasValidSession(req)) {
    return res.status(401).json({
      message: "Brak aktywnej sesji.",
    });
  }

  const { email } = req.body;

  const user = users.find((currentUser) => currentUser.email === email);

  if (!user) {
    return res.status(404).json({
      message: "Nie znaleziono użytkownika.",
    });
  }

  return res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });
});

app.post(
  "/api/account/settings",
  (req: Request<{}, {}, AccountSettingsRequest>, res: Response) => {
    if (!hasValidSession(req)) {
      return res.status(401).json({
        message: "Brak aktywnej sesji.",
      });
    }

    const { email, username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Nazwa użytkownika jest wymagana.",
      });
    }

    const user = users.find((currentUser) => currentUser.email === email);

    if (!user) {
      return res.status(404).json({
        message: "Nie znaleziono użytkownika.",
      });
    }

    user.username = username;

    return res.status(200).json({
      message: "Ustawienia konta zostały zaktualizowane.",
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  }
);

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});