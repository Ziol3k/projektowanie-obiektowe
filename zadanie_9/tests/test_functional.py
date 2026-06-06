import requests


def test_backend_health():
    response = requests.get("http://localhost:3001/health", timeout=10)

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_backend_products():
    response = requests.get("http://localhost:3001/api/products", timeout=10)

    assert response.status_code == 200

    products = response.json()

    assert isinstance(products, list)
    assert len(products) > 0
    assert "name" in products[0]
    assert "price" in products[0]


def test_frontend_loads():
    response = requests.get("http://localhost:8080", timeout=10)

    assert response.status_code == 200
    assert "<html" in response.text.lower()