<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\PermissionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PermissionController extends Controller
{
    /**
     * Submit a new permission/izin request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'notes' => 'required|string',
        ]);

        $user = Auth::user();

        $permission = PermissionRequest::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'type' => $request->type,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        // Create Notification
        Notification::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'title' => 'Pengajuan '.$request->type.' Terkirim',
            'message' => 'Pengajuan '.$request->type.' anda telah berhasil dikirim ke sistem.',
            'type' => 'SYSTEM',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan izin berhasil dikirim!',
            'data' => $permission,
        ]);
    }

    /**
     * Get user's permission history.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $permissions = PermissionRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('limit', 10));

        return response()->json([
            'success' => true,
            'data' => $permissions->items(),
            'meta' => [
                'current_page' => $permissions->currentPage(),
                'last_page' => $permissions->lastPage(),
                'total' => $permissions->total(),
            ],
        ]);
    }
}
