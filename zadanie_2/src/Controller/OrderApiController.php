<?php

namespace App\Controller;

use App\Entity\Order;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/orders')]
class OrderApiController extends AbstractController
{
    #[Route('', name: 'order_index', methods: ['GET'])]
    public function index(OrderRepository $repository): JsonResponse
    {
        $items = $repository->findAll();

        $data = array_map(fn(Order $item) => [
            'id' => $item->getId(),
            'customerName' => $item->getCustomerName(),
            'totalAmount' => $item->getTotalAmount(),
            'status' => $item->getStatus(),
        ], $items);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'order_show', methods: ['GET'])]
    public function show(Order $order): JsonResponse
    {
        return $this->json([
            'id' => $order->getId(),
            'customerName' => $order->getCustomerName(),
            'totalAmount' => $order->getTotalAmount(),
            'status' => $order->getStatus(),
        ]);
    }

    #[Route('', name: 'order_store', methods: ['POST'])]
    public function store(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        $order = new Order();
        $order->setCustomerName($payload['customerName'] ?? '');
        $order->setTotalAmount((float) ($payload['totalAmount'] ?? 0));
        $order->setStatus($payload['status'] ?? 'new');

        $em->persist($order);
        $em->flush();

        return $this->json([
            'message' => 'Order created',
            'id' => $order->getId(),
        ], 201);
    }

    #[Route('/{id}', name: 'order_update', methods: ['PUT'])]
    public function update(Order $order, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['customerName'])) {
            $order->setCustomerName($payload['customerName']);
        }

        if (isset($payload['totalAmount'])) {
            $order->setTotalAmount((float) $payload['totalAmount']);
        }

        if (isset($payload['status'])) {
            $order->setStatus($payload['status']);
        }

        $em->flush();

        return $this->json([
            'message' => 'Order updated',
        ]);
    }

    #[Route('/{id}', name: 'order_delete', methods: ['DELETE'])]
    public function delete(Order $order, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($order);
        $em->flush();

        return $this->json([
            'message' => 'Order deleted',
        ]);
    }
}