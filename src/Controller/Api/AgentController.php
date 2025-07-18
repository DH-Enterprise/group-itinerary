<?php declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/agents')]
final class AgentController extends AbstractController
{
    private string $orionUrl;
    private string $adminApiToken;
    private string $basicAuthCredentials;

    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->orionUrl = rtrim($parameterBag->get('app.orion_url'), '/');
        $this->adminApiToken = $parameterBag->get('app.admin_api_token');
        $this->basicAuthCredentials = $parameterBag->get('app.basic_auth_credentials');
    }

    #[Route('/search', name: 'api_agents_search', methods: ['GET'])]
    public function search(Request $request, HttpClientInterface $httpClient): JsonResponse
    {
        $searchQuery = trim($request->query->get('search', ''));

        if (empty($searchQuery) || strlen($searchQuery) < 2) {
            return $this->json([]);
        }

        $targetUrl = $this->orionUrl . '/admin/json/agent';

        $authHeaders = array_filter(['Basic' => $this->basicAuthCredentials, 'Bearer' => $this->adminApiToken]);
        $authHeader = '';
        foreach ($authHeaders as $type => $token) {
            $authHeader .= "{$type} {$token}, ";
        }
        $response = $httpClient->request(
            'GET',
            $targetUrl,
            [
                'query' => ['search' => $searchQuery],
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Cache-Control' => 'no-cache',
                    'Authorization' => trim($authHeader, ', '),
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
