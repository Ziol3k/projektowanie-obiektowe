#!/bin/bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Laptop gamingowy",
    "price": 3499.99,
    "stock": 10
  }'
echo
