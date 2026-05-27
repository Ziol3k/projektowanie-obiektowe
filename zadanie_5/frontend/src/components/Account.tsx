import { useState } from "react";
import type { SyntheticEvent } from "react";
import { httpClient } from "../api/httpClient";

type AccountUser = {
  email: string;
  username: string;
};

type AccountSettingsResponse = {
  message: string;
  user: AccountUser;
};

export function Account() {
  const [email] = useState(localStorage.getItem("userEmail") ?? "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") ?? ""
  );
  const [message, setMessage] = useState("");

  const isLoggedIn = Boolean(localStorage.getItem("sessionToken") && email);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    void updateSettings();
  }

  async function updateSettings() {
    const sessionToken = localStorage.getItem("sessionToken");

    try {
      const response = await httpClient.post<AccountSettingsResponse>(
        "/account/settings",
        {
          email,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      localStorage.setItem("username", response.data.user.username);
      setUsername(response.data.user.username);
      setMessage(response.data.message);
    } catch {
      setMessage("Nie udało się zaktualizować ustawień konta.");
    }
  }

  if (!isLoggedIn) {
    return (
      <section>
        <h2>Konto</h2>
        <p data-testid="account-not-loaded">
          Zaloguj się, aby zobaczyć dane konta.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2>Konto</h2>

      <p data-testid="account-email">
        E-mail: <strong>{email}</strong>
      </p>

      <p data-testid="account-username">
        Nazwa użytkownika: <strong>{username}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nowa nazwa użytkownika:{" "}
            <input
              data-testid="account-username-input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
        </div>

        <button data-testid="account-save" type="submit">
          Zapisz ustawienia
        </button>
      </form>

      {message && <p data-testid="account-message">{message}</p>}
    </section>
  );
}