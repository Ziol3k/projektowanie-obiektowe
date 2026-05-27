import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { httpClient } from "../api/httpClient";

type RegisterResponse = {
  message: string;
  user: {
    name: string;
    email: string;
    username: string;
  };
};

type LoginResponse = {
  sessionToken: string;
  user: {
    email: string;
    username: string;
  };
};

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    void submitRegistration();
  }

  async function submitRegistration() {
    try {
      const registerResponse = await httpClient.post<RegisterResponse>(
        "/register",
        {
          name,
          email,
          password,
        }
      );

      const loginResponse = await httpClient.post<LoginResponse>("/login", {
        email,
        password,
      });

      localStorage.setItem("sessionToken", loginResponse.data.sessionToken);
      localStorage.setItem("userEmail", loginResponse.data.user.email);
      localStorage.setItem("username", loginResponse.data.user.username);

      setMessage(registerResponse.data.message);
      navigate("/account");
    } catch {
      setMessage("Rejestracja nie powiodła się.");
    }
  }

  return (
    <section>
      <h2>Rejestracja</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Imię:{" "}
            <input
              data-testid="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            E-mail:{" "}
            <input
              data-testid="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Hasło:{" "}
            <input
              data-testid="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>

        <button data-testid="register-submit" type="submit">
          Zarejestruj
        </button>
      </form>

      {message && <p data-testid="register-message">{message}</p>}
    </section>
  );
}