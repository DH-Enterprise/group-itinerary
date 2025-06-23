<?php declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[Route('/api/agents')]
final class AgentController extends AbstractController
{
    private string $adminBaseUrl;
    private string $adminApiToken;

    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->adminBaseUrl = rtrim($parameterBag->get('app.admin_base_url'), '/');
        $this->adminApiToken = $parameterBag->get('app.admin_api_token');
    }

    #[Route('/search', name: 'api_agents_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $searchQuery = trim($request->query->get('search', ''));

        if (empty($searchQuery) || strlen($searchQuery) < 2) {
            return $this->json([]);
        }

        $httpClient = HttpClient::create([
            'timeout' => 5,
            'max_redirects' => 3,
        ]);

        $targetUrl = $this->adminBaseUrl . '/json/agent';

        $response = $httpClient->request(
            'GET',
            $targetUrl,
            [
                'query' => ['search' => $searchQuery],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Cache-Control' => 'no-cache',
                    'Authorization' => 'Bearer ' . $this->adminApiToken,
                ],
            ]
        );

        $statusCode = $response->getStatusCode();

        if ($statusCode !== 200) {
            throw new \RuntimeException(sprintf('Unexpected HTTP status: %d', $statusCode));
        }

        $content = $response->getContent();
        $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

        if (!is_array($data)) {
            throw new \RuntimeException('Invalid response format from admin API');
        }

        return $this->json($data);
    }
}
