<?php declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class HomeController extends AbstractController
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

    #[Route('/')]
    public function homepage(HttpClientInterface $httpClient): Response
    {
        $targetUrl = $this->orionUrl . '/v1';

        $authHeaders = array_filter(['Basic' => $this->basicAuthCredentials, 'Bearer' => $this->adminApiToken]);
        $authHeader = '';
        foreach ($authHeaders as $type => $token) {
            $authHeader .= "{$type} {$token}, ";
        }
        $response = $httpClient->request(
            'POST',
            $targetUrl,
            [
                'headers' => [
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Cache-Control' => 'no-cache',
                    'Authorization' => trim($authHeader, ', '),
                ],
                'json' => [
                    'jsonrpc' => '2.0',
                    'method' => 'getExchangeRates',
                    'params' => [],
                    'id' => uniqid('', true), // for now just uniqid
                ],
            ]
        );
        $responseData = json_decode($response->getContent(), true);
        $usdRates = array_values(array_filter($responseData['result'], static fn (
            array $rateData,
        ): bool => $rateData['toCode'] === 'USD' && in_array($rateData['code'], ['GBP', 'EUR'], true)));
        array_unshift($usdRates, ['code' => 'USD', 'toCode' => 'USD', 'rate' => 1]);
//        $usdRates[1]['rate'] = 2;
//        dd($usdRates);

        return $this->render('builder.html.twig', ['exchangeRates' => $usdRates]);
    }
}
