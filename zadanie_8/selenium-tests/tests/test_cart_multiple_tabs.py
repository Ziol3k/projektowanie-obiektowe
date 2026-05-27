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


def clear_cart_storage(driver):
    driver.get(APP_URL)
    driver.execute_script("localStorage.removeItem('cartItems');")
    driver.refresh()


def get_cart_text(driver):
    driver.get(f"{APP_URL}/cart")
    time.sleep(0.5)
    return driver.find_element(By.TAG_NAME, "body").text


def add_product_to_cart(driver, product_button_index=0):
    driver.get(APP_URL)
    buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Dodaj do koszyka')]")
    buttons[product_button_index].click()
    time.sleep(0.5)


def test_cart_state_is_shared_between_two_tabs(driver):
    clear_cart_storage(driver)

    first_tab = driver.current_window_handle

    driver.switch_to.new_window("tab")
    second_tab = driver.current_window_handle

    driver.switch_to.window(first_tab)
    add_product_to_cart(driver, 0)

    driver.switch_to.window(second_tab)
    cart_text = get_cart_text(driver)

    assert "Laptop" in cart_text
    assert "Suma: 3500 zł" in cart_text


def test_cart_updates_after_adding_products_in_different_tabs(driver):
    clear_cart_storage(driver)

    first_tab = driver.current_window_handle

    driver.switch_to.new_window("tab")
    second_tab = driver.current_window_handle

    driver.switch_to.window(first_tab)
    add_product_to_cart(driver, 0)

    driver.switch_to.window(second_tab)
    add_product_to_cart(driver, 1)

    driver.switch_to.window(first_tab)
    cart_text = get_cart_text(driver)

    assert "Laptop" in cart_text
    assert "Klawiatura" in cart_text
    assert "Suma: 3750 zł" in cart_text


def test_cart_clear_in_one_tab_is_visible_in_another_tab(driver):
    clear_cart_storage(driver)

    first_tab = driver.current_window_handle

    add_product_to_cart(driver, 0)

    driver.switch_to.new_window("tab")
    second_tab = driver.current_window_handle

    driver.switch_to.window(second_tab)
    driver.get(f"{APP_URL}/cart")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Wyczyść koszyk')]").click()
    time.sleep(0.5)

    driver.switch_to.window(first_tab)
    cart_text = get_cart_text(driver)

    assert "Twój koszyk jest aktualnie pusty." in cart_text
    assert "Laptop" not in cart_text


def test_cart_remove_item_in_one_tab_is_visible_in_another_tab(driver):
    clear_cart_storage(driver)

    first_tab = driver.current_window_handle

    add_product_to_cart(driver, 0)
    add_product_to_cart(driver, 1)

    driver.switch_to.new_window("tab")
    second_tab = driver.current_window_handle

    driver.switch_to.window(second_tab)
    driver.get(f"{APP_URL}/cart")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Usuń')]").click()
    time.sleep(0.5)

    driver.switch_to.window(first_tab)
    cart_text = get_cart_text(driver)

    assert "Suma: 250 zł" in cart_text
    assert "Klawiatura" in cart_text