<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FaceBiometric;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $rules = [
            'full_name' => 'required|string|max:255',
            'personal_phone' => 'nullable|string|max:20',
        ];

        // Allow Owners and Managers to change their own work location/site
        if (in_array($user->role, ['OWNER', 'MANAGER'])) {
            $rules['site_id'] = 'nullable|exists:sites,id';
        }

        $validated = $request->validate($rules);

        Log::info('API Profile Update', [
            'user_id' => $user->id,
            'role' => $user->role,
            'old_site' => $user->site_id,
            'new_site' => $validated['site_id'] ?? $user->site_id,
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'personal_phone' => $user->personal_phone,
                'site_id' => $user->site_id,
                'site' => $user->site ? ['name' => $user->site->name] : null,
            ],
        ]);
    }

    /**
     * Reregister or update face biometric data via Smart Hybrid in AI Service.
     */
    public function reregisterFace(Request $request)
    {
        $request->validate([
            'image_base64' => 'required|string',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $aiServiceUrl = config('services.ai.url', 'http://localhost:8088');

        try {
            // ── AI Service: Register Face (Base64) ──
            $response = Http::timeout(20)->post("{$aiServiceUrl}/api/v1/faces/register-base64", [
                'user_id' => (string) $user->id,
                'image_base64' => $request->image_base64,
            ]);

            $aiResponse = $response->json();
            if ($response->failed() || ! ($aiResponse['success'] ?? false)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memperbarui wajah: '.($aiResponse['message'] ?? 'Unknown Error'),
                ], 502);
            }

            // ── AI Service: Trigger Retrain (Async in AI Service, 5s timeout in Laravel) ──
            try {
                Http::timeout(5)->post("{$aiServiceUrl}/api/v1/faces/train");
            } catch (\Exception $e) {
                Log::warning('Profile retrain trigger timed out (non-critical): '.$e->getMessage());
            }

            // Update database Laravel
            $faceBio = FaceBiometric::where('user_id', $user->id)->first();
            if ($faceBio) {
                $faceBio->update([
                    'face_embedding' => $aiResponse['face_embedding'], // Update the 128D vector
                    'embedding_version' => ($faceBio->embedding_version ?? 0) + 1,
                    'requires_re_registration' => false,
                    'last_trained_at' => now(),
                ]);
            } else {
                FaceBiometric::create([
                    'id' => Str::uuid(), // In case it's manually needed, though trait handles it
                    'user_id' => $user->id,
                    'face_embedding' => $aiResponse['face_embedding'], // Store the 128D vector
                    'embedding_version' => 1,
                    'requires_re_registration' => false,
                    'last_trained_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data wajah berhasil diperbaharui dan model telah dilatih.',
            ]);

        } catch (\Exception $e) {
            Log::error('Re-Register Face Error:', ['msg' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat registrasi wajah.',
            ], 500);
        }
    }
}
