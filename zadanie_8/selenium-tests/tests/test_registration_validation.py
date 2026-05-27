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


def open_register_page(driver):
    driver.get(f"{APP_URL}/register")


def get_register_fields(driver):
    return {
        "name": driver.find_element(By.CSS_SELECTOR, '[data-testid="register-name"]'),
        "email": driver.find_element(By.CSS_SELECTOR, '[data-testid="register-email"]'),
        "password": driver.find_element(By.CSS_SELECTOR, '[data-testid="register-password"]'),
        "submit": driver.find_element(By.CSS_SELECTOR, '[data-testid="register-submit"]'),
    }


def test_required_fields_block_empty_registration(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    fields["submit"].click()

    assert driver.current_url.endswith("/register")
    assert fields["name"].get_attribute("validationMessage") != ""


def test_name_field_is_required(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    fields["email"].send_keys("user@example.com")
    fields["password"].send_keys("Password123")
    fields["submit"].click()

    assert driver.current_url.endswith("/register")
    assert fields["name"].get_attribute("validationMessage") != ""


def test_email_field_is_required(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    fields["name"].send_keys("Test User")
    fields["password"].send_keys("Password123")
    fields["submit"].click()

    assert driver.current_url.endswith("/register")
    assert fields["email"].get_attribute("validationMessage") != ""


def test_password_field_is_required(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    fields["name"].send_keys("Test User")
    fields["email"].send_keys("user@example.com")
    fields["submit"].click()

    assert driver.current_url.endswith("/register")
    assert fields["password"].get_attribute("validationMessage") != ""


def test_invalid_email_format_blocks_registration(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    fields["name"].send_keys("Test User")
    fields["email"].send_keys("invalid-email")
    fields["password"].send_keys("Password123")
    fields["submit"].click()

    assert driver.current_url.endswith("/register")
    assert fields["email"].get_attribute("validationMessage") != ""


def test_valid_registration_redirects_to_account_page(driver):
    open_register_page(driver)
    fields = get_register_fields(driver)

    unique_email = f"user{int(time.time())}@example.com"

    fields["name"].send_keys("Selenium User")
    fields["email"].send_keys(unique_email)
    fields["password"].send_keys("Password123")
    fields["submit"].click()

    time.sleep(1)

    assert driver.current_url.endswith("/account")
    assert "Selenium User" in driver.page_source or "selenium_user" in driver.page_source
    assert unique_email in driver.page_source