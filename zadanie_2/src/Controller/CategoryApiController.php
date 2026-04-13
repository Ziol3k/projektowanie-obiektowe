<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories')]
class CategoryApiController extends AbstractController
{
    #[Route('', name: 'category_index', methods: ['GET'])]
    public function index(CategoryRepository $repository): JsonResponse
    {
        $items = $repository->findAll();

        $data = array_map(fn(Category $item) => [
            'id' => $item->getId(),
            'name' => $item->getName(),
            'description' => $item->getDescription(),
        ], $items);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'category_show', methods: ['GET'])]
    public function show(Category $category): JsonResponse
    {
        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
        ]);
    }

    #[Route('', name: 'category_store', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setName($payload['name'] ?? '');
        $category->setDescription($payload['description'] ?? null);

        $em->persist($category);
        $em->flush();

        return $this->json([
            'message' => 'Category created',
            'id' => $category->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'category_update', methods: ['PUT'])]
    public function update(Category $category, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['name'])) {
            $category->setName($payload['name']);
        }

        if (array_key_exists('description', $payload)) {
            $category->setDescription($payload['description']);
        }

        $em->flush();

        return $this->json([
            'message' => 'Category updated',
        ]);
    }

    #[Route('/{id}', name: 'category_delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($category);
        $em->flush();

        return $this->json([
            'message' => 'Category deleted',
        ]);
    }
}