import time

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By


APP_URL = "http://localhost:5173"


@pytest.fixture()
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1280,900")

    browser = webdriver.Chrome(options=options)
    browser.implicitly_wait(3)

    yield browser

    browser.quit()


def set_xss_marker(driver):
    driver.execute_script("window.__xssExecuted = false;")


def get_xss_marker(driver):
    return driver.execute_script("return window.__xssExecuted === true;")


def count_script_tags(driver):
    return len(driver.find_elements(By.TAG_NAME, "script"))


def test_xss_payload_in_registration_name_is_not_executed(driver):
    payload = '<img src=x onerror="window.__xssExecuted = true">'

    driver.get(f"{APP_URL}/register")
    initial_script_count = count_script_tags(driver)
    set_xss_marker(driver)

    driver.find_element(By.CSS_SELECTOR, '[data-testid="register-name"]').send_keys(payload)
    driver.find_element(By.CSS_SELECTOR, '[data-testid="register-email"]').send_keys(
        f"xss{int(time.time())}@example.com"
    )
    driver.find_element(By.CSS_SELECTOR, '[data-testid="register-password"]').send_keys(
        "Password123"
    )
    driver.find_element(By.CSS_SELECTOR, '[data-testid="register-submit"]').click()

    time.sleep(1)

    assert driver.current_url.endswith("/account")
    assert get_xss_marker(driver) is False
    assert count_script_tags(driver) == initial_script_count
    assert len(driver.find_elements(By.CSS_SELECTOR, "img[onerror]")) == 0


def test_xss_payload_in_account_username_is_not_executed(driver):
    payload = '<script>window.__xssExecuted = true</script>'

    driver.get(f"{APP_URL}/login")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

    time.sleep(1)

    assert driver.current_url.endswith("/account")

    initial_script_count = count_script_tags(driver)
    set_xss_marker(driver)

    username_input = driver.find_element(
        By.CSS_SELECTOR, '[data-testid="account-username-input"]'
    )
    username_input.clear()
    username_input.send_keys(payload)

    driver.find_element(By.CSS_SELECTOR, '[data-testid="account-save"]').click()

    time.sleep(1)

    assert get_xss_marker(driver) is False
    assert "Ustawienia konta zostały zaktualizowane." in driver.page_source
    assert count_script_tags(driver) == initial_script_count


def test_xss_payload_is_rendered_as_text_not_html(driver):
    payload = '<img src=x onerror="window.__xssExecuted = true">'

    driver.get(f"{APP_URL}/login")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

    time.sleep(1)

    set_xss_marker(driver)

    username_input = driver.find_element(
        By.CSS_SELECTOR, '[data-testid="account-username-input"]'
    )
    username_input.clear()
    username_input.send_keys(payload)

    driver.find_element(By.CSS_SELECTOR, '[data-testid="account-save"]').click()

    time.sleep(1)

    account_username = driver.find_element(
        By.CSS_SELECTOR, '[data-testid="account-username"]'
    )

    assert payload in account_username.text
    assert len(account_username.find_elements(By.TAG_NAME, "img")) == 0
    assert get_xss_marker(driver) is False