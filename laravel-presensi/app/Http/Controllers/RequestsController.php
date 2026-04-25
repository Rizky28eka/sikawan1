<?php

namespace App\Http\Controllers;

use App\Models\CorrectionRequest;
use App\Models\Leave;
use App\Models\LeaveType;
use App\Models\OvertimeRequest;
use App\Models\PermissionRequest;
use App\Models\User;
use App\Traits\Loggable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RequestsController extends Controller
{
    use Loggable;

    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        $defaultTab = ($role === 'OWNER') ? 'approvals' : 'my-requests';
        $tab = $request->input('tab', $defaultTab);

        // Base queries for each type with consistent columns
        $queryLeaves = DB::table('leaves')
            ->join('users', 'leaves.user_id', '=', 'users.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->select(
                'leaves.id',
                'leaves.user_id',
                'users.full_name',
                'users.employee_id',
                'users.profile_photo',
                'departments.name as department_name',
                DB::raw("'leave' as type"),
                'leaves.created_at as submission_date',
                'leaves.start_date as request_date',
                'leaves.end_date as end_date',
                'leaves.reason as requester_notes',
                'leaves.notes as approver_notes',
                'leaves.status',
                'leaves.company_id',
                'users.department_id',
                'users.role as requester_role'
            )
            ->whereNull('leaves.deleted_at');

        $queryOvertime = DB::table('overtime_requests')
            ->join('users', 'overtime_requests.user_id', '=', 'users.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->select(
                'overtime_requests.id',
                'overtime_requests.user_id',
                'users.full_name',
                'users.employee_id',
                'users.profile_photo',
                'departments.name as department_name',
                DB::raw("'overtime' as type"),
                'overtime_requests.created_at as submission_date',
                'overtime_requests.start_time as request_date',
                'overtime_requests.end_time as end_date',
                'overtime_requests.notes as requester_notes',
                'overtime_requests.approver_notes',
                'overtime_requests.status',
                'overtime_requests.company_id',
                'users.department_id',
                'users.role as requester_role'
            )
            ->whereNull('overtime_requests.deleted_at');

        $queryPermission = DB::table('permission_requests')
            ->join('users', 'permission_requests.user_id', '=', 'users.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->select(
                'permission_requests.id',
                'permission_requests.user_id',
                'users.full_name',
                'users.employee_id',
                'users.profile_photo',
                'departments.name as department_name',
                DB::raw("'permission' as type"),
                'permission_requests.created_at as submission_date',
                'permission_requests.start_time as request_date',
                'permission_requests.end_time as end_date',
                'permission_requests.notes as requester_notes',
                'permission_requests.approver_notes',
                'permission_requests.status',
                'permission_requests.company_id',
                'users.department_id',
                'users.role as requester_role'
            )
            ->whereNull('permission_requests.deleted_at');

        $queryCorrection = DB::table('correction_requests')
            ->join('users', 'correction_requests.user_id', '=', 'users.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->select(
                'correction_requests.id',
                'correction_requests.user_id',
                'users.full_name',
                'users.employee_id',
                'users.profile_photo',
                'departments.name as department_name',
                DB::raw("'correction' as type"),
                'correction_requests.created_at as submission_date',
                'correction_requests.date as request_date',
                DB::raw('NULL as end_date'),
                'correction_requests.notes as requester_notes',
                'correction_requests.approver_notes',
                'correction_requests.status',
                'correction_requests.company_id',
                'users.department_id',
                'users.role as requester_role'
            )
            ->whereNull('correction_requests.deleted_at');

        // Apply shared filters and scoping
        $unifiedQuery = $queryLeaves
            ->unionAll($queryOvertime)
            ->unionAll($queryPermission)
            ->unionAll($queryCorrection);

        // Wrap in a subquery for global filtering, searching, and pagination
        $finalQuery = DB::query()->fromSub($unifiedQuery, 'unified_requests');

        // Global scopes
        $finalQuery->where('company_id', $user->company_id);

        // Tab Logic & RBAC
        if ($tab === 'my-requests') {
            // EMPLOYEE, MANAGER & ADMIN can see their own requests
            // OWNER & SUPERADMIN do not have my-requests
            if (in_array($role, ['OWNER', 'SUPERADMIN'])) {
                abort(403);
            }
            $finalQuery->where('user_id', $user->id);
        } elseif ($tab === 'team-requests') {
            // Only OWNER, ADMIN, MANAGER, SUPERADMIN can see team requests
            if (! in_array($role, ['OWNER', 'ADMIN', 'MANAGER', 'SUPERADMIN'])) {
                abort(403);
            }
            // MANAGER is scoped to their own department
            if ($role === 'MANAGER') {
                $finalQuery->where('department_id', $user->department_id);
            }
        } elseif ($tab === 'approvals') {
            // Only OWNER, ADMIN, MANAGER, SUPERADMIN can approve
            if (! in_array($role, ['OWNER', 'ADMIN', 'MANAGER', 'SUPERADMIN'])) {
                abort(403);
            }

            // Hierarchical Approval Scoping
            if ($role === 'OWNER') {
                $finalQuery->whereIn('requester_role', ['ADMIN', 'MANAGER', 'EMPLOYEE']);
            } elseif ($role === 'ADMIN') {
                $finalQuery->whereIn('requester_role', ['MANAGER', 'EMPLOYEE']);
            } elseif ($role === 'MANAGER') {
                $finalQuery->where('requester_role', 'EMPLOYEE')
                    ->where('department_id', $user->department_id);
            }
            // SUPERADMIN sees all (global oversee)

            // Only show pending requests
            $finalQuery->where('status', 'pending');
        } elseif ($tab === 'history') {
            if ($role === 'EMPLOYEE') {
                // Employee sees only their own resolved requests
                $finalQuery->where('user_id', $user->id)->where('status', '!=', 'pending');
            } elseif ($role === 'MANAGER') {
                // Manager sees resolved requests of their department
                $finalQuery->where('department_id', $user->department_id)->where('status', '!=', 'pending');
            } else {
                // OWNER, ADMIN & SUPERADMIN see all resolved requests in the company
                $finalQuery->where('status', '!=', 'pending');
            }
        }

        // No filters applied — data is purely tab + role scoped
        $requests = $finalQuery
            ->orderBy('submission_date', 'desc')
            ->paginate(15);

        $leaveTypes = LeaveType::where('company_id', $user->company_id)->get();

        return Inertia::render('Requests/Index', [
            'requests' => $requests,
            'role' => $role,
            'tab' => $tab,
            'leaveTypes' => $leaveTypes,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $request->validate([
            'type' => 'required|in:leave,overtime,permission,correction',
            'reason' => 'required|string|max:1000',
        ]);

        $model = null;
        switch ($request->type) {
            case 'leave':
                $request->validate([
                    'leave_type_id' => 'required|uuid',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                ]);
                $model = Leave::create([
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'leave_type_id' => $request->leave_type_id,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'reason' => $request->reason,
                    'status' => 'pending',
                ]);
                break;

            case 'overtime':
                $request->validate([
                    'start_time' => 'required|date',
                    'end_time' => 'required|date|after:start_time',
                ]);
                $model = OvertimeRequest::create([
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'notes' => $request->reason,
                    'status' => 'pending',
                ]);
                break;

            case 'permission':
                $request->validate([
                    'permission_type' => 'required|string',
                    'start_time' => 'required|date',
                    'end_time' => 'required|date|after:start_time',
                ]);
                $model = PermissionRequest::create([
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'type' => $request->permission_type,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'notes' => $request->reason,
                    'status' => 'pending',
                ]);
                break;

            case 'correction':
                $request->validate([
                    'date' => 'required|date',
                    'check_in' => 'nullable|string',
                    'check_out' => 'nullable|string',
                ]);
                $model = CorrectionRequest::create([
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'date' => $request->date,
                    'check_in' => $request->check_in,
                    'check_out' => $request->check_out,
                    'notes' => $request->reason,
                    'status' => 'pending',
                ]);
                break;
        }

        $this->logActivity('CREATE', "User submitted a new {$request->type} request", ucfirst($request->type), $model->id);

        return back()->with('success', 'Pengajuan berhasil dikirim.');
    }

    public function updateStatus(Request $request, $type, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string|max:500',
        ]);

        $model = $this->findRequestModel($type, $id);
        $user = Auth::user();

        // Authorization
        if (! in_array($user->role, ['OWNER', 'ADMIN', 'MANAGER', 'SUPERADMIN'])) {
            abort(403);
        }

        if ($user->role === 'MANAGER') {
            $reqUser = User::find($model->user_id);
            if ($reqUser->department_id !== $user->department_id) {
                abort(403);
            }
        }

        // Schema difference handling
        if ($type === 'leave') {
            $model->update([
                'status' => $request->status,
                'notes' => $request->notes,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
        } else {
            $model->update([
                'status' => $request->status,
                'approver_notes' => $request->notes,
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);
        }

        $this->logActivity(strtoupper($request->status), "Request #{$id} ({$type}) was {$request->status} by {$user->full_name}", ucfirst($type), $id);

        return back()->with('success', 'Permintaan berhasil '.($request->status === 'approved' ? 'disetujui' : 'ditolak').'.');
    }

    public function destroy($type, $id)
    {
        $model = $this->findRequestModel($type, $id);
        $user = Auth::user();

        if ($model->user_id !== $user->id || $model->status !== 'pending') {
            abort(403);
        }

        $model->delete();

        $this->logActivity('DELETE', "User cancelled their pending {$type} request", ucfirst($type), $id);

        return back()->with('success', 'Pengajuan berhasil dibatalkan.');
    }

    private function findRequestModel($type, $id)
    {
        switch ($type) {
            case 'leave': return Leave::findOrFail($id);
            case 'overtime': return OvertimeRequest::findOrFail($id);
            case 'permission': return PermissionRequest::findOrFail($id);
            case 'correction': return CorrectionRequest::findOrFail($id);
            default: abort(404);
        }
    }
}
