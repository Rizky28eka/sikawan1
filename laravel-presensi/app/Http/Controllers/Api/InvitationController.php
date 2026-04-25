<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserInvitation;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    /**
     * Validate invitation token from Flutter app.
     */
    public function validateToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string|uuid',
        ]);

        $invitation = UserInvitation::where('token', $request->token)->first();

        if (! $invitation) {
            return response()->json([
                'success' => false,
                'message' => 'Token undangan tidak ditemukan.',
            ], 404);
        }

        if (! $invitation->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Undangan sudah kadaluwarsa atau sudah digunakan.',
                'status' => $invitation->effective_status,
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token valid.',
            'data' => [
                'email' => $invitation->email,
                'role' => $invitation->role,
                'position' => $invitation->position,
                'company_id' => $invitation->company_id,
                'department_id' => $invitation->department_id,
                'site_id' => $invitation->site_id,
            ],
        ]);
    }
}
