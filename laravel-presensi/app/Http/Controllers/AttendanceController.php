<?php

namespace App\Http\Controllers;

use App\Data\AttendanceData;
use App\Http\Controllers\Api\AttendanceController as ApiAttendanceController;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $role = $user->role;

        $query = Attendance::with([
            'user:id,full_name,employee_id,department_id,site_id,profile_photo',
            'user.department:id,name',
            'site:id,name',
            'location',
            'biometric',
            'network',
        ]);

        // Role-based scoping (Strict multi-tenancy)
        if ($role === 'SUPERADMIN') {
            // Global Superadmin sees everything unless restricted to a company
            if ($user->company_id) {
                $query->where('company_id', $user->company_id);
            }
        } elseif ($role === 'OWNER') {
            // Owner is strictly restricted to their own company
            $query->where('company_id', $user->company_id);
        } elseif ($role === 'MANAGER') {
            // Manager restricted to their company AND their specific department
            $query->where('company_id', $user->company_id)
                ->whereHas('user', function ($q) use ($user) {
                    $q->where('department_id', $user->department_id);
                });
        } elseif ($role === 'EMPLOYEE') {
            // Employee only sees their own logs
            $query->where('user_id', $user->id);
        } else {
            // Fallback for unauthorized/unknown roles: see nothing
            $query->whereRaw('1 = 0');
        }

        $attendances = $query->latest('timestamp')->paginate(15);

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
            'role' => $role,
        ]);
    }

    /**
     * Render the UI for performing daily attendance (Clock In/Out).
     */
    public function check()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load(['site', 'shift']);

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('timestamp', now()->toDateString())
            ->latest('timestamp')
            ->first();

        return Inertia::render('checkincheckout/Index', [
            'user' => $user,
            'site' => $user->site,
            'shift' => $user->shift,
            'todayAttendance' => $todayAttendance,
            'isExempt' => in_array($user->role, ['OWNER', 'SUPERADMIN']),
        ]);
    }

    /**
     * Handle the submission of web-based attendance.
     */
    public function storeCheck(AttendanceData $data)
    {
        /** @var User $user */
        $user = Auth::user();

        // Fallback: If web provides no GPS (0,0), use Site's default coordinates
        // This ensures geofencing check passes for fixed web stations.
        if ($data->latitude == 0 && $user->site_id) {
            $site = Site::find($user->site_id);
            if ($site) {
                $data->latitude = $site->latitude;
                $data->longitude = $site->longitude;
            }
        }

        $apiController = new ApiAttendanceController;
        $response = $apiController->store($data);

        $result = $response->getData();

        if ($result->success) {
            return redirect()->route('attendance.check')
                ->with('success', $result->message)
                ->with('attendance_result', $result->data);
        }

        return redirect()->back()->withErrors(['error' => $result->message]);
    }

    public function show($id)
    {
        /** @var User $user */
        $user = Auth::user();
        $role = $user->role;

        $attendance = Attendance::with([
            'user:id,full_name,employee_id,department_id,site_id,profile_photo',
            'user.department:id,name',
            'site:id,name',
            'location',
            'biometric',
            'network',
        ])->findOrFail($id);

        // Security check: ensure user has permission to view this specific record
        if ($role === 'OWNER') {
            if ($attendance->company_id !== $user->company_id) abort(403);
        } elseif ($role === 'MANAGER') {
            if ($attendance->user->department_id !== $user->department_id) abort(403);
        } elseif ($role === 'EMPLOYEE') {
            if ($attendance->user_id !== $user->id) abort(403);
        }

        return Inertia::render('Attendance/Show', [
            'attendance' => $attendance,
            'role' => $role,
        ]);
    }
}
