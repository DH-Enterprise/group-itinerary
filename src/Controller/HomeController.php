<?php declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/')]
    public function homepage(): Response
    {
        return $this->render('builder.html.twig');
    }

    #[Route('/save-quote', name: 'save_quote', methods: ['POST'])]
    public function saveQuote(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        
        // Use dd() to dump and die with the quote data
        dd($data['quote']);
        
        // This line won't be reached because of dd()
        return new JsonResponse(['success' => true]);
    }
}