import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:5173";

test("full React shop flow", async ({ page }) => {
    const uniqueEmail = `playwright_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}@example.com`;
    const safeUsername = `playwright_user_${Date.now()}`;

    await page.goto(APP_URL);

    await expect(page).toHaveURL(APP_URL + "/");
    await expect(page.getByRole("link", { name: "Produkty" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Koszyk" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Płatności" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Produkty" })).toBeVisible();

    await expect(page.getByText("Laptop — 3500 zł")).toBeVisible();
    await expect(page.getByText("Klawiatura — 250 zł")).toBeVisible();
    await expect(page.getByText("Mysz — 120 zł")).toBeVisible();
    await expect(page.getByRole("button", { name: "Dodaj do koszyka" })).toHaveCount(3);

    await page.getByRole("button", { name: "Dodaj do koszyka" }).nth(0).click();
    await page.getByRole("button", { name: "Dodaj do koszyka" }).nth(1).click();
    await page.getByRole("link", { name: "Koszyk" }).click();

    await expect(page).toHaveURL(APP_URL + "/cart");
    await expect(page.getByRole("heading", { name: "Koszyk" })).toBeVisible();
    await expect(page.getByText("Laptop — 3500 zł")).toBeVisible();
    await expect(page.getByText("Klawiatura — 250 zł")).toBeVisible();
    await expect(page.getByText("Suma: 3750 zł")).toBeVisible();
    await expect(page.getByRole("button", { name: "Usuń" })).toHaveCount(2);

    await page.getByRole("button", { name: "Usuń" }).first().click();

    await expect(page.getByText("Laptop — 3500 zł")).toBeHidden();
    await expect(page.getByText("Suma: 250 zł")).toBeVisible();
    await expect(page.getByRole("button", { name: "Usuń" })).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Przejdź do płatności" })).toBeVisible();

    await page.getByRole("link", { name: "Przejdź do płatności" }).click();

    await expect(page).toHaveURL(APP_URL + "/payments");
    await expect(page.getByRole("heading", { name: "Płatności" })).toBeVisible();
    await expect(page.getByText("250 zł")).toBeVisible();
    await expect(page.locator('input[type="number"]')).toHaveValue("250");
    await expect(page.locator('input[type="number"]')).not.toBeEditable();
    await expect(page.getByRole("button", { name: "Zapłać" })).toBeEnabled();

    await page.locator('input[type="text"]').first().fill("Jan Playwright");
    await page.locator('input[type="text"]').nth(1).fill("1234567812345678");
    await page.getByRole("button", { name: "Zapłać" }).click();

    await expect(page.getByText("Płatność została przyjęta.")).toBeVisible();
    await expect(page.locator('input[type="number"]')).toHaveValue("0");
    await expect(page.getByRole("button", { name: "Zapłać" })).toBeDisabled();

    await page.getByRole("link", { name: "Koszyk" }).click();

    await expect(page).toHaveURL(APP_URL + "/cart");
    await expect(page.getByText("Twój koszyk jest aktualnie pusty.")).toBeVisible();

    await page.getByRole("link", { name: "Rejestracja" }).click();

    await expect(page).toHaveURL(APP_URL + "/register");
    await expect(page.getByRole("heading", { name: "Rejestracja" })).toBeVisible();
    await expect(page.getByTestId("register-name")).toBeVisible();
    await expect(page.getByTestId("register-email")).toBeVisible();
    await expect(page.getByTestId("register-password")).toBeVisible();
    await expect(page.getByTestId("register-submit")).toBeVisible();
    await expect(page.getByTestId("register-email")).toBeEditable();

    await page.getByTestId("register-name").fill("Playwright User");
    await page.getByTestId("register-email").fill("invalid-email");
    await page.getByTestId("register-password").fill("Password123");
    await page.getByTestId("register-submit").click();

    await expect(page).toHaveURL(APP_URL + "/register");
    await expect(page.getByTestId("register-email")).toHaveValue("invalid-email");
    await expect(page.getByRole("heading", { name: "Konto" })).toHaveCount(0);

    await page.getByTestId("register-email").fill(uniqueEmail);
    await page.getByTestId("register-submit").click();

    await expect(page).toHaveURL(APP_URL + "/account");
    await expect(page.getByRole("heading", { name: "Konto" })).toBeVisible();
    await expect(page.getByTestId("account-email")).toContainText(uniqueEmail);
    await expect(page.getByTestId("account-username")).toContainText("playwright_user");
    await expect(page.getByTestId("account-username-input")).toBeEditable();

    await page.getByTestId("account-username-input").fill(safeUsername);
    await page.getByTestId("account-save").click();

    await expect(page.getByTestId("account-message")).toContainText(
        "Ustawienia konta zostały zaktualizowane."
    );
    await expect(page.getByTestId("account-username")).toContainText(safeUsername);

    await page.evaluate(() => localStorage.clear());
    await page.getByRole("link", { name: "Logowanie" }).click();

    await expect(page).toHaveURL(APP_URL + "/login");
    await expect(page.getByTestId("login-email")).toHaveValue("test@example.com");

    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(APP_URL + "/account");
});