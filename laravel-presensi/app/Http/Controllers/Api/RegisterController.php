<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FaceBiometric;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class RegisterController extends Controller
{
    /**
     * Register new employee from Flutter app via invitation.
     */
    public function register(Request $request)
    {
        $request->validate([
            'token' => 'required|uuid',
            'full_name' => 'required|string|max:255',
            'personal_phone' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'image_base64' => 'required|string', // Foto wajah utama (Base64)
        ]);

        $invitation = UserInvitation::where('token', $request->token)->first();

        if (! $invitation || ! $invitation->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Token undangan tidak valid atau sudah kadaluarsa.',
            ], 400);
        }

        // ── Create User and Save Data ──
        try {
            return DB::transaction(function () use ($request, $invitation) {
                $user = User::create([
                    'full_name' => $request->full_name,
                    'personal_email' => $invitation->email,
                    'personal_phone' => $request->personal_phone,
                    'password' => Hash::make($request->password),
                    'role' => $invitation->role,
                    'company_id' => $invitation->company_id,
                    'department_id' => $invitation->department_id,
                    'site_id' => $invitation->site_id,
                    'position' => $invitation->position,
                    'employee_id' => User::generateEmployeeId($invitation->company_id),
                    'join_date' => now(),
                    'status' => true,
                ]);

                // ── AI Service: Register Face (retrieves embedding and bbox) ──
                $aiServiceUrl = config('services.ai.url', 'http://localhost:8088');

                $response = Http::timeout(20)->post("{$aiServiceUrl}/api/v1/faces/register-base64", [
                    'user_id' => (string) $user->id,
                    'image_base64' => $request->image_base64,
                ]);

                if ($response->failed() || ! ($response->json()['success'] ?? false)) {
                    throw new \RuntimeException('AI Service gagal mendaftarkan wajah: '.($response->json()['message'] ?? 'Unknown Error'));
                }

                $aiResult = $response->json();

                // Save Biometric metadata ke Laravel untuk UI
                FaceBiometric::create([
                    'user_id' => $user->id,
                    'face_embedding' => [], // Kita tidak perlu simpan embedding besar di Laravel lagi (opsional)
                    'embedding_version' => 1,
                    'last_trained_at' => now(),
                ]);

                // ── AI Service: Trigger Retrain ──
                // Penting agar wajah baru langsung dikenali
                Http::post("{$aiServiceUrl}/api/v1/faces/train");

                // Mark invitation as used
                $invitation->update([
                    'status' => 'accepted',
                    'used_at' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Registrasi berhasil. Data wajah telah dilatih.',
                    'user' => [
                        'full_name' => $user->full_name,
                        'employee_id' => $user->employee_id,
                    ],
                ]);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan registrasi: '.$e->getMessage(),
            ], 500);
        }
    }
}
