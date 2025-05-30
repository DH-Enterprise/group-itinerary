<?php

namespace App\Controller;

use App\Entity\Quote;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class QuoteController extends AbstractController
{
    #[Route('/api/quotes', name: 'app_save_quote', methods: ['POST'])]
    public function saveQuote(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $quote = new Quote();
        $quote->setQuoteData($data);
        $quote->setCreatedAt(new \DateTimeImmutable());
        $quote->setUpdatedAt(new \DateTimeImmutable());
        
        $entityManager->persist($quote);
        $entityManager->flush();
        
        return new JsonResponse(['id' => $quote->getId()], 201);
    }
}
