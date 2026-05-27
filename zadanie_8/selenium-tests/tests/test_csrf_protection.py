import time
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By


APP_URL = "http://localhost:5173"
BACKEND_URL = "http://localhost:3001"


@pytest.fixture()
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,900")

    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(3)

    yield browser

    browser.quit()


def login(driver):
    driver.get(f"{APP_URL}/login")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    time.sleep(1)

    assert driver.current_url.endswith("/account")


def set_username_using_application(driver, username):
    username_input = driver.find_element(
        By.CSS_SELECTOR, '[data-testid="account-username-input"]'
    )

    username_input.clear()
    username_input.send_keys(username)

    driver.find_element(By.CSS_SELECTOR, '[data-testid="account-save"]').click()
    time.sleep(1)

    assert "Ustawienia konta zostały zaktualizowane." in driver.page_source
    assert username in driver.page_source


def create_csrf_attack_page(tmp_path: Path):
    attack_page = tmp_path / "csrf_attack.html"

    attack_page.write_text(
        f"""
        <!doctype html>
        <html lang="pl">
          <head>
            <meta charset="UTF-8" />
            <title>CSRF attack page</title>
          </head>
          <body>
            <h1>Spreparowany link CSRF</h1>

            <form
              id="csrf-form"
              action="{BACKEND_URL}/api/account/settings"
              method="POST"
            >
              <input type="hidden" name="email" value="test@example.com" />
              <input
                type="hidden"
                name="username"
                value="csrf_attacked_username"
              />
            </form>

            <a
              href="#"
              id="csrf-link"
              onclick="document.getElementById('csrf-form').submit(); return false;"
            >
              Kliknij spreparowany link
            </a>
          </body>
        </html>
        """,
        encoding="utf-8",
    )

    return attack_page


def relogin_and_get_account_text(driver):
    driver.execute_script("localStorage.clear();")
    driver.get(f"{APP_URL}/login")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    time.sleep(1)

    assert driver.current_url.endswith("/account")

    return driver.find_element(By.TAG_NAME, "body").text


def test_csrf_attack_cannot_change_username_when_user_has_active_session(driver, tmp_path):
    safe_username = "csrf_safe_username"

    login(driver)
    set_username_using_application(driver, safe_username)

    first_tab = driver.current_window_handle

    csrf_attack_page = create_csrf_attack_page(tmp_path)

    driver.switch_to.new_window("tab")
    second_tab = driver.current_window_handle

    driver.get(csrf_attack_page.as_uri())
    driver.find_element(By.ID, "csrf-link").click()

    time.sleep(1)

    assert "Brak aktywnej sesji" in driver.page_source

    driver.switch_to.window(first_tab)

    account_text = relogin_and_get_account_text(driver)

    assert safe_username in account_text
    assert "csrf_attacked_username" not in account_text