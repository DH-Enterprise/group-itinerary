<?php declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        dd($request->request->all());
    }
}