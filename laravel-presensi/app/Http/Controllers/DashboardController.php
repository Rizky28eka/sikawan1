<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Device;
use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\OvertimeRequest;
use App\Models\PermissionRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $role = $user->role;

        $data = [
            'role' => $role,
            'stats' => [],
            'recent_activity' => [],
            'attendanceTrend' => $this->getAttendanceTrend($user),
        ];

        switch ($role) {
            case 'SUPERADMIN':
                $data['stats'] = $this->getSuperAdminStats();
                $data['summary'] = $this->getSuperSummary();
                break;
            case 'OWNER':
                $data['stats'] = $this->getOwnerStats($user->company_id);
                $data['summary'] = $this->getOwnerSummary($user->company_id);
                break;
            case 'MANAGER':
                $data['stats'] = $this->getManagerStats($user);
                $data['summary'] = $this->getManagerSummary($user);
                break;
            case 'EMPLOYEE':
                $data['stats'] = $this->getEmployeeStats($user);
                $data['summary'] = $this->getEmployeeSummary($user);
                break;
        }

        return Inertia::render('Dashboard/Index', $data);
    }

    private function getAttendanceTrend($user): array
    {
        $days = [];
        $counts = [];
        $companyId = $user->company_id;
        $deptId = $user->department_id;

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $query = Attendance::whereDate('timestamp', $date)
                ->whereIn('type', ['IN', 'CLOCK_IN']);

            if ($user->role === 'OWNER') {
                $query->where('company_id', $companyId);
            } elseif ($user->role === 'MANAGER') {
                $query->whereHas('user', fn ($q) => $q->where('department_id', $deptId));
            }

            $days[] = $date->isoFormat('ddd');
            $counts[] = $query->count();
        }

        return [
            'labels' => $days,
            'data' => $counts,
        ];
    }

    private function getSuperAdminStats()
    {
        return [
            ['label' => 'Total Perusahaan', 'value' => Company::count(), 'icon' => 'Building'],
            ['label' => 'Total User Global', 'value' => User::count(), 'icon' => 'Users'],
            ['label' => 'Device Aktif', 'value' => Device::count(), 'icon' => 'Laptop'],
            ['label' => 'Status Sistem', 'value' => 'Normal', 'icon' => 'Activity', 'color' => 'text-green-500'],
        ];
    }

    private function getOwnerStats($companyId)
    {
        $today = Carbon::today();

        $totalEmployees = User::where('company_id', $companyId)->count();
        $todayAttendance = Attendance::where('company_id', $companyId)
            ->whereDate('timestamp', $today)
            ->whereIn('type', ['IN', 'CLOCK_IN'])
            ->count();
        $todayLate = Attendance::where('company_id', $companyId)
            ->whereDate('timestamp', $today)
            ->whereIn('type', ['IN', 'CLOCK_IN'])
            ->where('is_late', true)
            ->count();

        $pendingLeave = Leave::where('company_id', $companyId)->where('status', 'pending')->count();
        $pendingPermissions = PermissionRequest::where('company_id', $companyId)->where('status', 'pending')->count();
        $pendingOvertime = OvertimeRequest::where('company_id', $companyId)->where('status', 'pending')->count();

        return [
            ['label' => 'Total Karyawan', 'value' => $totalEmployees, 'icon' => 'Users'],
            ['label' => 'Presensi Hari Ini', 'value' => $todayAttendance, 'icon' => 'CalendarCheck'],
            ['label' => 'Terlambat Hari Ini', 'value' => $todayLate, 'icon' => 'Clock'],
            ['label' => 'Approval Pending', 'value' => $pendingLeave + $pendingPermissions + $pendingOvertime, 'icon' => 'FileCheck'],
        ];
    }

    private function getSuperSummary(): array
    {
        $today = Carbon::today();

        return [
            'present_today' => Attendance::whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->count(),
            'late_today' => Attendance::whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->where('is_late', true)->count(),
            'leave_today' => Leave::where('status', 'approved')->whereDate('start_date', '<=', $today)->whereDate('end_date', '>=', $today)->count(),
            'permission_today' => PermissionRequest::where('status', 'approved')->whereDate('start_time', '>=', $today->startOfDay())->whereDate('start_time', '<=', $today->endOfDay())->count(),
            'pending_leave' => Leave::where('status', 'pending')->count(),
            'pending_permission' => PermissionRequest::where('status', 'pending')->count(),
            'pending_overtime' => OvertimeRequest::where('status', 'pending')->count(),
        ];
    }

    private function getOwnerSummary(string $companyId): array
    {
        $today = Carbon::today();

        return [
            'present_today' => Attendance::where('company_id', $companyId)->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->count(),
            'late_today' => Attendance::where('company_id', $companyId)->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->where('is_late', true)->count(),
            'leave_today' => Leave::where('company_id', $companyId)->where('status', 'approved')->whereDate('start_date', '<=', $today)->whereDate('end_date', '>=', $today)->count(),
            'permission_today' => PermissionRequest::where('company_id', $companyId)->where('status', 'approved')->whereDate('start_time', '<=', $today->endOfDay())->whereDate('start_time', '>=', $today->startOfDay())->count(),
            'pending_leave' => Leave::where('company_id', $companyId)->where('status', 'pending')->count(),
            'pending_permission' => PermissionRequest::where('company_id', $companyId)->where('status', 'pending')->count(),
            'pending_overtime' => OvertimeRequest::where('company_id', $companyId)->where('status', 'pending')->count(),
        ];
    }

    private function getManagerStats($user)
    {
        $today = Carbon::today();
        $teamCount = User::where('department_id', $user->department_id)->count();
        $presentToday = Attendance::whereHas('user', fn ($q) => $q->where('department_id', $user->department_id))->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->count();
        $lateToday = Attendance::whereHas('user', fn ($q) => $q->where('department_id', $user->department_id))->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->where('is_late', true)->count();
        $pending = Leave::whereHas('user', fn ($q) => $q->where('department_id', $user->department_id))->where('status', 'pending')->count();

        return [
            ['label' => 'Anggota Tim', 'value' => $teamCount, 'icon' => 'Users'],
            ['label' => 'Hadir Hari Ini', 'value' => $presentToday, 'icon' => 'CalendarCheck'],
            ['label' => 'Terlambat Hari Ini', 'value' => $lateToday, 'icon' => 'Clock'],
            ['label' => 'Pending Approval', 'value' => $pending, 'icon' => 'FileCheck'],
        ];
    }

    private function getManagerSummary(User $user): array
    {
        $today = Carbon::today();
        $deptId = $user->department_id;

        return [
            'present_today' => Attendance::whereHas('user', fn ($q) => $q->where('department_id', $deptId))->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->count(),
            'late_today' => Attendance::whereHas('user', fn ($q) => $q->where('department_id', $deptId))->whereIn('type', ['IN', 'CLOCK_IN'])->whereDate('timestamp', $today)->where('is_late', true)->count(),
            'leave_today' => Leave::whereHas('user', fn ($q) => $q->where('department_id', $deptId))->where('status', 'approved')->whereDate('start_date', '<=', $today)->whereDate('end_date', '>=', $today)->count(),
            'permission_today' => PermissionRequest::where('company_id', $user->company_id)->where('status', 'approved')->whereHas('user', fn ($q) => $q->where('department_id', $deptId))->whereDate('start_time', '>=', $today->startOfDay())->whereDate('start_time', '<=', $today->endOfDay())->count(),
            'pending_leave' => Leave::whereHas('user', fn ($q) => $q->where('department_id', $deptId))->where('status', 'pending')->count(),
            'pending_permission' => PermissionRequest::where('company_id', $user->company_id)->where('status', 'pending')->whereHas('user', fn ($q) => $q->where('department_id', $deptId))->count(),
            'pending_overtime' => OvertimeRequest::where('company_id', $user->company_id)->where('status', 'pending')->whereHas('user', fn ($q) => $q->where('department_id', $deptId))->count(),
        ];
    }

    private function getEmployeeStats($user)
    {
        $today = Carbon::today();
        $attendance = Attendance::where('user_id', $user->id)->whereDate('timestamp', $today)->first();
        $year = $today->year;
        $balance = LeaveBalance::where('user_id', $user->id)->where('year', $year)->first();
        $remainingLeave = $balance ? max(0, $balance->allocated - $balance->used) : 0;
        $shiftLabel = $user->shift ? ($user->shift->start_time.' - '.$user->shift->end_time) : '-';
        $pendingRequests = Leave::where('user_id', $user->id)->where('status', 'pending')->count();

        return [
            ['label' => 'Status Hari Ini', 'value' => $attendance ? ($attendance->is_late ? 'Terlambat' : 'Hadir') : 'Belum Absen', 'icon' => 'UserCheck'],
            ['label' => 'Sisa Cuti', 'value' => $remainingLeave.' Hari', 'icon' => 'Calendar'],
            ['label' => 'Shift Berikutnya', 'value' => $shiftLabel, 'icon' => 'Clock'],
            ['label' => 'Request Aktif', 'value' => $pendingRequests, 'icon' => 'FileText'],
        ];
    }

    private function getEmployeeSummary(User $user): array
    {
        $today = Carbon::today();
        $attendance = Attendance::where('user_id', $user->id)->whereDate('timestamp', $today)->first();

        // Hitung jam kerja bulan ini
        $workMinutes = Attendance::where('user_id', $user->id)
            ->whereMonth('timestamp', Carbon::now()->month)
            ->whereNotNull('actual_duration')
            ->sum('actual_duration');

        $balance = LeaveBalance::where('user_id', $user->id)->where('year', $today->year)->first();

        return [
            'shift_name' => $user->shift?->name ?? 'Default Shift',
            'shift_time' => $user->shift ? ($user->shift->start_time.' - '.$user->shift->end_time) : '08:00 - 17:00',
            'attendance_status' => $attendance ? ($attendance->is_late ? 'Terlambat' : 'Hadir') : 'Belum Absen',
            'remaining_leave' => $balance ? ($balance->allocated - $balance->used) : 0,
            'worked_hours' => round($workMinutes / 60, 1),
        ];
    }
}
