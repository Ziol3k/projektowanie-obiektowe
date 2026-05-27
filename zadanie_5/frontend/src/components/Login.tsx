import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import { httpClient } from "../api/httpClient";

type LoginResponse = {
  message: string;
  sessionToken: string;
  user: {
    name: string;
    email: string;
    username: string;
  };
};

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("Password123");
  const [message, setMessage] = useState("");

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    void submitLogin();
  }

  async function submitLogin() {
    try {
      const response = await httpClient.post<LoginResponse>("/login", {
        email,
        password,
      });

      localStorage.setItem("sessionToken", response.data.sessionToken);
      localStorage.setItem("userEmail", response.data.user.email);
      localStorage.setItem("username", response.data.user.username);

      setMessage(response.data.message);
      navigate("/account");
    } catch {
      setMessage("Logowanie nie powiodło się.");
    }
  }

  return (
    <section>
      <h2>Logowanie</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            E-mail:{" "}
            <input
              data-testid="login-email"
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
              data-testid="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>

        <button data-testid="login-submit" type="submit">
          Zaloguj
        </button>
      </form>

      {message && <p data-testid="login-message">{message}</p>}
    </section>
  );
}