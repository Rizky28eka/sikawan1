<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiHealthController extends Controller
{
    /**
     * Check AI Service health status
     */
    public function check()
    {
        $aiServiceUrl = config('services.ai.url', 'http://127.0.0.1:8088');

        // The proxy base URL is the Laravel app's own HTTPS origin.
        // The browser will call /api/ai/* routes, which Laravel then forwards
        // internally to the AI service — preventing Mixed Content errors.
        $proxyBaseUrl = rtrim(config('app.url'), '/');

        try {
            $response = Http::timeout(5)->get("{$aiServiceUrl}/health");

            if ($response->successful()) {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'AI Service is healthy',
                    'service_url' => $proxyBaseUrl,
                ]);
            }

            Log::warning('AI Service returned non-200 status', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'status' => 'degraded',
                'message' => 'AI Service returned unexpected status',
                'service_url' => $aiServiceUrl,
            ], 503);

        } catch (\Exception $e) {
            Log::error('AI Service health check failed', [
                'error' => $e->getMessage(),
                'service_url' => $aiServiceUrl,
            ]);

            return response()->json([
                'status' => 'offline',
                'message' => 'AI Service is not reachable',
                'service_url' => $aiServiceUrl,
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
