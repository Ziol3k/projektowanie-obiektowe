<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products')]
class ProductApiController extends AbstractController
{
    #[Route('', name: 'product_index', methods: ['GET'])]
    public function index(ProductRepository $productRepository): JsonResponse
    {
        $products = $productRepository->findAll();

        $data = array_map(fn(Product $product) => [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
        ], $products);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'product_show', methods: ['GET'])]
    public function show(Product $product): JsonResponse
    {
        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
        ]);
    }

    #[Route('', name: 'product_store', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        $product = new Product();
        $product->setName($payload['name'] ?? '');
        $product->setDescription($payload['description'] ?? null);
        $product->setPrice((float) ($payload['price'] ?? 0));
        $product->setStock((int) ($payload['stock'] ?? 0));

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product created',
            'id' => $product->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'product_update', methods: ['PUT'])]
    public function update(Product $product, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['name'])) {
            $product->setName($payload['name']);
        }

        if (array_key_exists('description', $payload)) {
            $product->setDescription($payload['description']);
        }

        if (isset($payload['price'])) {
            $product->setPrice((float) $payload['price']);
        }

        if (isset($payload['stock'])) {
            $product->setStock((int) $payload['stock']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Product updated',
        ]);
    }

    #[Route('/{id}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product deleted',
        ]);
    }
}