<?php declare(strict_types=1);

namespace App\Controller;

use App\Entity\Quote;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

final class QuoteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private string $scheduleBaseUrl
    ) {
        $this->scheduleBaseUrl = rtrim($this->scheduleBaseUrl, '/');
    }

    #[Route('/api/quotes', name: 'app_save_quote', methods: ['POST'])]
    public function saveQuote(Request $request): JsonResponse
    {
        return new JsonResponse(['id' => $this->createQuote($request)->getId()], 201);
    }

    #[Route('/api/quotes/preview-blue-page', name: 'app_preview_blue_page', methods: ['POST'])]
    public function previewBluePage(Request $request): JsonResponse
    {
        $encodedQuoteData = base64_encode(gzcompress($request->getContent()));

        return new JsonResponse([
            'status' => 'success',
            'url' => $this->scheduleBaseUrl . '/fit/group-schedule?' . http_build_query([
                'quoteData' => $encodedQuoteData,
            ])
        ]);
    }

    private function createQuote(Request $request): Quote
    {
        $data = json_decode($request->getContent(), true);

        $quote = new Quote();
        $quote->setQuoteData($data);
        $quote->setCreatedAt(new \DateTimeImmutable());
        $quote->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($quote);
        $this->entityManager->flush();

        return $quote;
    }
}
