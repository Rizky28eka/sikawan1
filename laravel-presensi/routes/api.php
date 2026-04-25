<?php

use App\Http\Controllers\Api\AiHealthController;
use App\Http\Controllers\Api\AiProxyController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RegisterController;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// AI Service Health Check
Route::get('/ai-health', [AiHealthController::class, 'check']);

// AI Service Proxy Routes (browser → Laravel HTTPS → internal AI service)
// Prevents Mixed Content errors when the app is served over HTTPS
Route::post('/ai/register-frame', [AiProxyController::class, 'registerFrame']);
Route::post('/ai/verify-frame', [AiProxyController::class, 'verifyFrame']);

// Public Invitation Routes (for Flutter App)
Route::post('/invitation/validate', [InvitationController::class, 'validateToken']);
Route::post('/invitation/register', [RegisterController::class, 'register']);

// Login Route (Sanctum)
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load(['site', 'department', 'shift', 'faceBiometric']);

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereBetween('timestamp', [now()->startOfDay(), now()->endOfDay()])
            ->orderBy('timestamp', 'asc') // Sort by time
            ->get();

        $clockIn = $todayAttendance->where('type', 'CLOCK_IN')->first();
        $clockOut = $todayAttendance->where('type', 'CLOCK_OUT')->last(); // Take the last clock out if multiple exist

        $workDuration = null;
        if ($clockIn && $clockOut) {
            $duration = $clockIn->timestamp->diff($clockOut->timestamp);
            $workDuration = $duration->format('%Hj %Im');
        }

        return response()->json([
            'id' => $user->id,
            'full_name' => $user->full_name,
            'personal_email' => $user->personal_email,
            'personal_phone' => $user->personal_phone,
            'employee_id' => $user->employee_id,
            'role' => $user->role,
            'status' => (bool) $user->status,
            'position' => $user->position,
            'department_id' => $user->department_id,
            'department_name' => $user->department ? $user->department->name : null,
            'site_id' => $user->site_id,
            'site_name' => $user->site ? $user->site->name : null,
            'shift_id' => $user->shift_id,
            'shift_name' => $user->shift ? $user->shift->name : null,
            'shift_start_time' => $user->shift ? $user->shift->start_time : null,
            'shift_end_time' => $user->shift ? $user->shift->end_time : null,
            'join_date' => $user->join_date ? $user->join_date->toIso8601String() : null,
            'face_biometric_count' => $user->faceBiometric ? 1 : 0,
            'requires_re_registration' => $user->faceBiometric ? (bool) $user->faceBiometric->requires_re_registration : false,
            'today_attendance' => [
                'clock_in' => $clockIn ? $clockIn->timestamp->format('H:i') : null,
                'clock_out' => $clockOut ? $clockOut->timestamp->format('H:i') : null,
                'work_duration' => $workDuration,
            ],
        ]);
    });

    // Attendance - Face Recognition
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::post('/attendance/face', [AttendanceController::class, 'faceAttendance']);
    Route::get('/attendance/history', [AttendanceController::class, 'history']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Leave (Cuti)
    Route::get('/leave/types', [LeaveController::class, 'getLeaveTypes']);
    Route::get('/leave/balances', [LeaveController::class, 'getLeaveBalances']);
    Route::get('/leave/history', [LeaveController::class, 'index']);
    Route::post('/leave', [LeaveController::class, 'store']);

    // Permission (Izin)
    Route::get('/permission/history', [PermissionController::class, 'index']);
    Route::post('/permission', [PermissionController::class, 'store']);

    // Profile
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/profile/reregister-face', [ProfileController::class, 'reregisterFace']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
