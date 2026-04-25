<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Company;
use App\Models\FaceBiometric;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class InvitationController extends Controller
{
    public function accept($token)
    {
        $invitation = UserInvitation::where('token', $token)->firstOrFail();

        if (! $invitation->isValid()) {
            return Inertia::render('Auth/InvitationInvalid', [
                'message' => $invitation->isUsed() ? 'Undangan ini sudah digunakan.' : 'Undangan ini sudah kedaluwarsa.',
            ]);
        }

        $company = Company::find($invitation->company_id);

        $user_data = null;
        if ($invitation->type === 'face_registration' && $invitation->user_id) {
            $user_data = User::find($invitation->user_id);
        }

        return Inertia::render('Auth/RegisterInvite', [
            'invitation' => $invitation,
            'company_name' => $company->company_name,
            'existing_user' => $user_data,
        ]);
    }

    public function register(Request $request)
    {
        $invitation = UserInvitation::where('token', $request->token)->firstOrFail();
        $isFaceOnly = $invitation->type === 'face_registration';

        $rules = [
            'token' => 'required|exists:user_invitations,token',
            'image_base64' => 'required|string',
        ];

        if (! $isFaceOnly) {
            $rules['full_name'] = 'required|string|max:255';
            $rules['personal_phone'] = 'required|string|unique:users,personal_phone';
            $rules['password'] = ['required', 'confirmed', Password::defaults()];
            $rules['join_date'] = 'required|date';

            if (! $invitation->email) {
                $rules['email'] = 'required|email|unique:users,personal_email';
            }
        }

        $request->validate($rules);

        if (! $invitation->isValid()) {
            return back()->withErrors(['token' => 'Undangan tidak valid atau sudah kedaluwarsa.']);
        }

        $aiServiceUrl = config('services.ai.url', 'http://localhost:8088');

        try {
            DB::transaction(function () use ($request, $invitation, $isFaceOnly, $aiServiceUrl) {
                if ($isFaceOnly) {
                    $user = User::findOrFail($invitation->user_id);
                } else {
                    $user = User::create([
                        'full_name' => $request->full_name,
                        'personal_email' => $invitation->email ?? $request->email,
                        'personal_phone' => $request->personal_phone,
                        'password' => Hash::make($request->password),
                        'role' => $invitation->role,
                        'company_id' => $invitation->company_id,
                        'department_id' => $invitation->department_id,
                        'direct_manager_id' => $invitation->direct_manager_id,
                        'site_id' => $invitation->site_id,
                        'shift_id' => $invitation->shift_id,
                        'position' => $invitation->position,
                        'employment_type' => $invitation->employment_type,
                        'employee_id' => User::generateEmployeeId($invitation->company_id),
                        'join_date' => $request->join_date,
                        'status' => true,
                    ]);
                }

                // ── AI Service: Register Face (Base64) ──
                // AI Service handles master save, augmentations, and 128D embedding
                $response = Http::timeout(30)->post("{$aiServiceUrl}/api/v1/faces/register-base64", [
                    'user_id' => (string) $user->id,
                    'image_base64' => $request->image_base64,
                ]);

                $aiResponse = $response->json();
                if ($response->failed() || ! ($aiResponse['success'] ?? false)) {
                    throw new \RuntimeException('Gagal mendaftarkan wajah ke AI Service: '.($aiResponse['message'] ?? 'Unknown Error'));
                }

                // Sync Face Biometric in Laravel
                FaceBiometric::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'face_embedding' => $aiResponse['face_embedding'], // Store the 128D vector
                        'embedding_version' => 1,
                        'last_trained_at' => now(),
                        'requires_re_registration' => false,
                    ]
                );

                // Trigger Retrain (Async in AI Service, 5s timeout in Laravel)
                try {
                    Http::timeout(5)->post("{$aiServiceUrl}/api/v1/faces/train");
                } catch (\Exception $e) {
                    Log::warning('Retrain trigger timed out or failed (non-critical): '.$e->getMessage());
                }

                $invitation->update([
                    'status' => 'accepted',
                    'used_at' => now(),
                ]);

                // Log Activity
                ActivityLog::create([
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'action' => 'CREATE',
                    'entity' => 'User',
                    'entity_id' => $user->id,
                    'description' => "Employee registered via invitation link: {$user->full_name}",
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            });

            return redirect()->route('login')->with('success', 'Registrasi berhasil! Wajah Anda telah terdaftar.');

        } catch (\Exception $e) {
            Log::error('Registration error:', ['error' => $e->getMessage()]);

            return back()->withErrors(['image_base64' => 'Terjadi kesalahan sistem: '.$e->getMessage()]);
        }
    }
}
