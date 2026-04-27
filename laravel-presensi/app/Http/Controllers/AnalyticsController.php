<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\FaceRegistrationTest;
use App\Models\Leave;
use App\Models\OvertimeRequest;
use App\Models\PermissionRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        $tab = $request->input('tab', 'reports');
        if (! in_array($tab, ['reports', 'activity', 'research'])) {
            $tab = 'reports';
        }

        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        $departmentId = $request->filled('department_id') && $request->department_id !== 'all'
            ? $request->department_id
            : null;
        $employeeId = $request->filled('employee_id') && $request->employee_id !== 'all'
            ? $request->employee_id
            : null;

        $data = [];
        $totalStats = [];
        $departments = [];
        $employeeList = [];

        if ($tab === 'reports' || $tab === 'attendance' || $tab === 'employee') {
            $reportData = $this->getReportData($startDate, $endDate, $departmentId, $employeeId, $user, $request->search);

            $totalStats = [
                'attendance' => array_sum(array_column($reportData, 'attendance_count')),
                'late' => array_sum(array_column($reportData, 'late_count')),
                'leave' => array_sum(array_column($reportData, 'leave_days')),
                'absent' => array_sum(array_column($reportData, 'absent_count')),
                'hours' => array_sum(array_column($reportData, 'working_hours')),
            ];

            $data = $reportData;

            // Filter data
            $deptsQuery = Department::query();
            if ($role !== 'SUPERADMIN') {
                $deptsQuery->where('company_id', $user->company_id);
            }
            $departments = ($role === 'SUPERADMIN' || $role === 'OWNER' || $role === 'MANAGER')
                ? $deptsQuery->get(['id', 'name'])
                : [];

            if (in_array($role, ['SUPERADMIN', 'OWNER', 'MANAGER'])) {
                $empQuery = User::query();
                if ($role === 'OWNER') {
                    $empQuery->where('company_id', $user->company_id);
                }
                if ($role === 'MANAGER') {
                    $empQuery->where('department_id', $user->department_id);
                }
                if ($departmentId) {
                    $empQuery->where('department_id', $departmentId);
                }
                $employeeList = $empQuery->get(['id', 'full_name']);
            }
        } elseif ($tab === 'activity') {
            $query = ActivityLog::with(['user:id,full_name,personal_email', 'company:id,company_name'])
                ->orderBy('created_at', 'desc');

            if ($role === 'SUPERADMIN') {
            } elseif ($role === 'OWNER') {
                $query->where('company_id', $user->company_id);
            } elseif ($role === 'MANAGER') {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('department_id', $user->department_id);
                });
            } elseif ($role === 'EMPLOYEE') {
                $query->where('user_id', $user->id);
            }

            if ($request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('action', 'like', "%{$search}%")
                        ->orWhere('entity', 'like', "%{$search}%");
                });
            }

            if ($request->module) {
                $query->where('entity', $request->module);
            }

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
            }

            $data = $query->paginate(15)->withQueryString();
        } elseif ($tab === 'research') {
            // Dynamic data from database with filtering
            $researchQuery = FaceRegistrationTest::orderBy('created_at', 'desc');
            
            if ($startDate && $endDate) {
                $researchQuery->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
            }
            
            if ($request->search) {
                $researchQuery->where('user_name', 'like', "%{$request->search}%");
            }

            $researchData = $researchQuery->get();

            $data = $researchData->take(100)->map(function ($item, $index) {
                return [
                    'id' => $item->id,
                    'no' => $index + 1,
                    'user_name' => $item->user_name,
                    'testing_condition' => $item->testing_condition,
                    'frames_collected' => $item->frames_collected,
                    'frames_valid' => $item->frames_valid,
                    'duration' => $item->duration,
                    'frame_quality' => $item->frame_quality,
                    'face_detected' => $item->face_detected,
                    'recognition_result' => $item->recognition_result,
                    'confidence_score' => $item->confidence_score,
                    'embedding_stability' => $item->embedding_stability,
                    'pose_variation' => $item->pose_variation,
                    'stop_reason' => $item->stop_reason,
                    'final_status' => $item->final_status,
                ];
            });

            // Calculate dynamic stats
            $total = $researchData->count();
            $successCount = $researchData->where('final_status', 'Berhasil')->count();
            $avgDuration = $total > 0 ? round($researchData->avg('duration'), 1) : 0;
            $accuracy = $total > 0 ? round(($successCount / $total) * 100, 1) : 0;

            // Attendance stats for summary cards
            $reportData = $this->getReportData($startDate, $endDate, $departmentId, $employeeId, $user, $request->search);
            $totalStats = [
                'attendance' => array_sum(array_column($reportData, 'attendance_count')),
                'late' => array_sum(array_column($reportData, 'late_count')),
                'leave' => array_sum(array_column($reportData, 'leave_days')),
                'absent' => array_sum(array_column($reportData, 'absent_count')),
                'hours' => array_sum(array_column($reportData, 'working_hours')),
            ];

            return Inertia::render('Analytics/Index', [
                'data' => $data,
                'tab' => $tab,
                'totalStats' => $totalStats,
                'researchSummary' => [
                    'accuracy' => $accuracy.'%',
                    'avg_duration' => $avgDuration.'s',
                    'model_version' => 'V1.0 Stable',
                    'total_tests' => $total,
                ],
                'filters' => $request->only(['start_date', 'end_date', 'department_id', 'employee_id', 'search']),
                'departments' => Department::select('id', 'name')->get(),
                'employeeList' => User::select('id', 'full_name')->get(),
                'role' => Auth::user()->role,
            ]);
        }

        return Inertia::render('Analytics/Index', [
            'data' => $data,
            'tab' => $tab,
            'totalStats' => $totalStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'department_id' => $departmentId,
                'employee_id' => $employeeId,
                'search' => $request->search,
                'module' => $request->module,
                'tab' => $tab,
            ],
            'departments' => $departments,
            'employeeList' => $employeeList,
            'role' => $role,
        ]);
    }

    private function getReportData($startDate, $endDate, $departmentId, $employeeId, $user, $search = null)
    {
        $role = $user->role;
        $statsQuery = User::query();

        if ($role === 'SUPERADMIN') {
        } elseif ($role === 'OWNER') {
            $statsQuery->where('company_id', $user->company_id);
        } elseif ($role === 'MANAGER') {
            $statsQuery->where('department_id', $user->department_id);
        } elseif ($role === 'EMPLOYEE') {
            $statsQuery->where('id', $user->id);
            $employeeId = $user->id;
        }

        if ($departmentId && $departmentId !== 'all') {
            $statsQuery->where('department_id', $departmentId);
        }
        if ($employeeId && $employeeId !== 'all' && $role !== 'EMPLOYEE') {
            $statsQuery->where('id', $employeeId);
        }

        if ($search) {
            $statsQuery->where('full_name', 'like', "%{$search}%");
        }

        // Exclude system/owner roles from operational attendance analytics
        $statsQuery->whereNotIn('role', ['OWNER', 'SUPERADMIN']);

        $employees = $statsQuery->with(['department'])->get();
        $reportData = [];

        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $totalDaysInRange = 0;
        $tempDate = $start->copy();
        while ($tempDate->lte($end)) {
            if (! $tempDate->isWeekend()) {
                $totalDaysInRange++;
            }
            $tempDate->addDay();
        }

        foreach ($employees as $emp) {
            $attendanceCount = Attendance::where('user_id', $emp->id)
                ->whereIn('type', ['IN', 'CLOCK_IN'])
                ->whereBetween('timestamp', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->count();

            $lateCount = Attendance::where('user_id', $emp->id)
                ->whereIn('type', ['IN', 'CLOCK_IN'])
                ->where('is_late', true)
                ->whereBetween('timestamp', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->count();

            $leaveDays = Leave::where('user_id', $emp->id)
                ->where('status', 'approved')
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate]);
                })
                ->get()
                ->sum(function ($l) {
                    return Carbon::parse($l->start_date)->diffInDays(Carbon::parse($l->end_date)) + 1;
                });

            $permissionCount = PermissionRequest::where('user_id', $emp->id)
                ->where('status', 'approved')
                ->whereBetween('start_time', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->count();

            $overtimeHours = OvertimeRequest::where('user_id', $emp->id)
                ->where('status', 'approved')
                ->whereBetween('start_time', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->get()
                ->sum(function ($ot) {
                    return Carbon::parse($ot->start_time)->diffInMinutes(Carbon::parse($ot->end_time)) / 60;
                });

            $workingTimeSeconds = 0;
            $attendances = Attendance::where('user_id', $emp->id)
                ->whereBetween('timestamp', [$startDate.' 00:00:00', $endDate.' 23:59:59'])
                ->orderBy('timestamp')
                ->get()
                ->groupBy(function ($date) {
                    return Carbon::parse($date->timestamp)->format('Y-m-d');
                });

            foreach ($attendances as $day => $records) {
                $in = $records->whereIn('type', ['IN', 'CLOCK_IN'])->first();
                $out = $records->whereIn('type', ['OUT', 'CLOCK_OUT'])->last();
                
                if ($in) {
                    $startTime = Carbon::parse($in->timestamp);
                    $endTime = $out ? Carbon::parse($out->timestamp) : ($day === now()->toDateString() ? now() : null);
                    
                    if ($endTime) {
                        $workingTimeSeconds += $startTime->diffInSeconds($endTime);
                    }
                }
            }
            $workingHours = round($workingTimeSeconds / 3600, 2);
            $absentCount = max(0, $totalDaysInRange - $attendanceCount - $leaveDays - $permissionCount);

            $reportData[] = [
                'id' => $emp->id,
                'employee_id' => $emp->employee_id,
                'name' => $emp->full_name,
                'department' => $emp->department->name ?? 'N/A',
                'attendance_count' => $attendanceCount,
                'late_count' => $lateCount,
                'leave_days' => $leaveDays,
                'absent_count' => $absentCount,
                'permission_count' => $permissionCount,
                'overtime_hours' => $overtimeHours,
                'working_hours' => $workingHours,
            ];
        }

        return $reportData;
    }

    public function exportReport(Request $request)
    {
        $user = Auth::user();
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        $departmentId = $request->input('department_id');
        $employeeId = $request->input('employee_id');
        $search = $request->input('search');

        $reportData = $this->getReportData($startDate, $endDate, $departmentId, $employeeId, $user, $search);

        $response = new StreamedResponse(function () use ($reportData) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Nama Karyawan', 'Departemen', 'Kehadiran', 'Keterlambatan', 'Cuti (Hari)', 'Alpha/Absent', 'Izin', 'Lembur (Jam)', 'Total Jam Kerja']);

            foreach ($reportData as $row) {
                fputcsv($handle, [
                    $row['name'],
                    $row['department'],
                    $row['attendance_count'],
                    $row['late_count'],
                    $row['leave_days'],
                    $row['absent_count'],
                    $row['permission_count'],
                    $row['overtime_hours'],
                    $row['working_hours'],
                ]);
            }
            fclose($handle);
        });

        $filename = 'analytics_report_'.date('Ymd_His').'.csv';
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$filename.'"');

        return $response;
    }

    public function exportLogs(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $query = ActivityLog::with(['user', 'company'])->orderBy('created_at', 'desc');

        if ($role === 'SUPERADMIN') {
        } elseif ($role === 'OWNER') {
            $query->where('company_id', $user->company_id);
        } elseif ($role === 'MANAGER') {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('department_id', $user->department_id);
            });
        } elseif ($role === 'EMPLOYEE') {
            $query->where('user_id', $user->id);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate.' 00:00:00', $endDate.' 23:59:59']);
        }

        $response = new StreamedResponse(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Tanggal', 'User', 'Action', 'Module', 'Description', 'IP Address']);

            $query->chunk(100, function ($logs) use ($handle) {
                foreach ($logs as $log) {
                    fputcsv($handle, [
                        $log->created_at->format('Y-m-d H:i:s'),
                        $log->user->full_name ?? 'System',
                        $log->action,
                        $log->entity ?? 'N/A',
                        $log->description,
                        $log->ip_address,
                    ]);
                }
            });
            fclose($handle);
        });

        $filename = 'activity_audit_'.date('Ymd_His').'.csv';
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$filename.'"');

        return $response;
    }

    public function exportResearch(Request $request)
    {
        $data = FaceRegistrationTest::orderBy('created_at', 'desc')->get();

        if ($data->isEmpty()) {
            return back()->with('error', 'Tidak ada data riset untuk diekspor.');
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="face_recognition_research_report.csv"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'No', 'ID', 'Nama Pengguna', 'Kondisi Pengujian', 'Frame Terkumpul', 'Frame Valid',
                'Durasi (s)', 'Kualitas Frame', 'Deteksi Wajah', 'Hasil Pengenalan', 'Confidence Score (%)',
                'Stabilitas Embedding', 'Variasi Pose', 'Alasan Berhenti', 'Status Akhir', 'Tanggal Pengujian',
            ]);

            foreach ($data as $index => $row) {
                fputcsv($file, [
                    $index + 1,
                    $row->id,
                    $row->user_name,
                    $row->testing_condition,
                    $row->frames_collected,
                    $row->frames_valid,
                    $row->duration,
                    $row->frame_quality,
                    $row->face_detected,
                    $row->recognition_result,
                    $row->confidence_score,
                    $row->embedding_stability,
                    $row->pose_variation,
                    $row->stop_reason,
                    $row->final_status,
                    $row->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
