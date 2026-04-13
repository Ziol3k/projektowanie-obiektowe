#!/bin/bash
curl -X PUT http://localhost:8000/api/products/2 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Pro",
    "description": "Zmieniony opis",
    "price": 3999.99,
    "stock": 7
  }'
echo
