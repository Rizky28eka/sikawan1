<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiProxyController extends Controller
{
    /**
     * Proxy: POST /api/ai/register-frame → AI Service /api/v1/faces/dynamic-register-frame
     */
    public function registerFrame(Request $request)
    {
        $aiServiceUrl = config('services.ai.url', 'http://127.0.0.1:8088');

        try {
            $response = Http::timeout(10)->post(
                "{$aiServiceUrl}/api/v1/faces/dynamic-register-frame",
                $request->only(['session_id', 'user_id', 'image_base64'])
            );

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('AI Proxy registerFrame failed', [
                'error' => $e->getMessage(),
                'ai_service_url' => $aiServiceUrl,
            ]);

            return response()->json([
                'detail' => [
                    'message' => 'Koneksi ke AI Service terputus: '.$e->getMessage(),
                ],
            ], 503);
        }
    }

    /**
     * Proxy: POST /api/ai/verify-frame → AI Service /api/v1/faces/dynamic-verify-frame
     */
    public function verifyFrame(Request $request)
    {
        $aiServiceUrl = config('services.ai.url', 'http://localhost:8088');

        try {
            $response = Http::timeout(10)->post(
                "{$aiServiceUrl}/api/v1/faces/dynamic-verify-frame",
                $request->all()
            );

            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('AI Proxy verifyFrame failed', [
                'error' => $e->getMessage(),
                'ai_service_url' => $aiServiceUrl,
            ]);

            return response()->json([
                'detail' => [
                    'message' => 'Koneksi ke AI Service terputus: '.$e->getMessage(),
                ],
            ], 503);
        }
    }
}
