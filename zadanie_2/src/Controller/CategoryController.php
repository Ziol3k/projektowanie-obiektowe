<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    #[Route('/categories', name: 'category_view_index', methods: ['GET'])]
    public function index(CategoryRepository $repository): Response
    {
        return $this->render('category/index.html.twig', [
            'categories' => $repository->findAll(),
        ]);
    }
}