<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'personal_email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('personal_email', $request->personal_email)
            ->with(['company', 'department', 'site', 'shift'])
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'personal_email' => [trans('auth.failed')],
            ]);
        }

        if (! $user->status) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda tidak aktif. Silakan hubungi admin.',
            ], 403);
        }

        $token = $user->createToken('flutter-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'personal_email' => $user->personal_email,
                'personal_phone' => $user->personal_phone,
                'employee_id' => $user->employee_id,
                'role' => $user->role,
                'status' => $user->status,
                'position' => $user->position,
                'department_id' => $user->department_id,
                'department' => $user->department ? ['name' => $user->department->name] : null,
                'site_id' => $user->site_id,
                'site' => $user->site ? ['name' => $user->site->name] : null,
                'shift_id' => $user->shift_id,
                'shift' => $user->shift ? [
                    'name' => $user->shift->name,
                    'start_time' => $user->shift->start_time,
                    'end_time' => $user->shift->end_time,
                ] : null,
                'join_date' => $user->join_date ? $user->join_date->toIso8601String() : null,
                'face_biometric_count' => $user->faceBiometric()->count(),
            ],
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }
}
