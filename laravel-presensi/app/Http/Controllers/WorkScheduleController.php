<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Shift;
use App\Models\User;
use App\Models\WorkSchedule;
use App\Traits\Loggable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkScheduleController extends Controller
{
    use Loggable;

    public function index(Request $request): Response
    {
        $user = Auth::user();
        $role = $user->role;
        $tab = $request->input('tab', 'schedules');

        if (! in_array($role, ['OWNER', 'MANAGER', 'EMPLOYEE', 'SUPERADMIN'])) {
            abort(403);
        }

        $data = [];
        $shiftsQuery = Shift::query();
        if ($role !== 'SUPERADMIN') {
            $shiftsQuery->where('company_id', $user->company_id);
        }
        $shifts = $shiftsQuery->get();

        $deptsQuery = Department::query();
        if ($role !== 'SUPERADMIN') {
            $deptsQuery->where('company_id', $user->company_id);
        }
        $departments = $deptsQuery->get(['id', 'name']);
        $employees = [];

        if ($tab === 'shifts') {
            if (! in_array($role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
                abort(403);
            }

            $query = Shift::withCount('users');
            if ($role !== 'SUPERADMIN') {
                $query->where('company_id', $user->company_id);
            }

            if ($role === 'MANAGER') {
                $shiftIds = User::where('department_id', $user->department_id)->whereNotNull('shift_id')->pluck('shift_id')->unique();
                $query->whereIn('id', $shiftIds);
            }

            if ($request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }

            $data = $query->paginate(15)->withQueryString();

        } elseif ($tab === 'schedules') {
            $query = WorkSchedule::with(['user:id,full_name,employee_id,department_id', 'user.department:id,name', 'shift:id,name']);

            if ($role !== 'SUPERADMIN') {
                $query->where('company_id', $user->company_id);
            }

            // RBAC Scoping
            if ($role === 'MANAGER') {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('department_id', $user->department_id);
                });
            } elseif ($role === 'EMPLOYEE') {
                $query->where('user_id', $user->id);
            }

            // Filters
            if ($request->search) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('full_name', 'like', "%{$request->search}%")
                        ->orWhere('employee_id', 'like', "%{$request->search}%");
                });
            }

            if ($request->department_id && $request->department_id !== 'all') {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('department_id', $request->department_id);
                });
            }

            if ($request->shift_id && $request->shift_id !== 'all') {
                $query->where('shift_id', $request->shift_id);
            }

            if ($request->date_from) {
                $query->where('date', '>=', $request->date_from);
            }
            if ($request->date_to) {
                $query->where('date', '<=', $request->date_to);
            }

            $data = $query->orderBy('date', 'desc')->paginate(15)->withQueryString();

            // Employees for dropdown
            $empQuery = User::where('status', true);
            if ($role !== 'SUPERADMIN') {
                $empQuery->where('company_id', $user->company_id);
                if ($role === 'MANAGER') {
                    $empQuery->where('department_id', $user->department_id);
                }
            }
            $employees = $empQuery->get(['id', 'full_name', 'employee_id']);
        }

        return Inertia::render('WorkSchedule/Index', [
            'data' => $data,
            'tab' => $tab,
            'filters' => $request->only(['search', 'department_id', 'shift_id', 'date_from', 'date_to', 'tab']),
            'shifts' => $shifts,
            'departments' => $departments,
            'employees' => $employees,
            'role' => $role,
        ]);
    }

    // Shift Management
    public function storeShift(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'late_tolerance' => 'required|integer|min:0',
            'grace_period_check_in' => 'nullable|integer|min:0',
            'grace_period_check_out' => 'nullable|integer|min:0',
            'minimum_work_hours' => 'nullable|integer|min:1',
            'is_night_shift' => 'required|boolean',
            'status' => 'required|boolean',
        ]);

        Shift::create(array_merge($request->all(), ['company_id' => Auth::user()->company_id]));
        $this->logActivity('CREATE', "Created shift: {$request->name}", 'Shift');

        return back()->with('success', 'Shift berhasil dibuat.');
    }

    public function updateShift(Request $request, string $id): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }
        $query = Shift::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $shift = $query->firstOrFail();
        $shift->update($request->all());
        $this->logActivity('UPDATE', "Updated shift: {$shift->name}", 'Shift', $id);

        return back()->with('success', 'Shift berhasil diperbarui.');
    }

    public function destroyShift(string $id): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }
        $query = Shift::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $query->firstOrFail()->delete();
        $this->logActivity('DELETE', "Deleted shift ID: {$id}", 'Shift', $id);

        return back()->with('success', 'Shift berhasil dihapus.');
    }

    // Schedule Management
    public function storeSchedule(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
            abort(403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($user->role === 'MANAGER') {
            $emp = User::find($request->user_id);
            if ($emp->department_id !== $user->department_id) {
                abort(403);
            }
        }

        WorkSchedule::create(array_merge($request->all(), [
            'company_id' => $user->company_id,
            'status' => 'active',
        ]));

        $this->logActivity('CREATE', "Assigned schedule for date {$request->date}", 'WorkSchedule');

        return back()->with('success', 'Jadwal kerja berhasil disimpan.');
    }

    public function updateSchedule(Request $request, string $id): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
            abort(403);
        }
        $query = WorkSchedule::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $schedule = $query->firstOrFail();

        if ($user->role === 'MANAGER' && $schedule->user->department_id !== $user->department_id) {
            abort(403);
        }

        $schedule->update($request->only(['shift_id', 'date', 'start_time', 'end_time', 'notes']));
        $this->logActivity('UPDATE', "Updated schedule ID: {$id}", 'WorkSchedule', $id);

        return back()->with('success', 'Jadwal kerja berhasil diperbarui.');
    }

    public function destroySchedule(string $id): RedirectResponse
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
            abort(403);
        }
        $query = WorkSchedule::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $schedule = $query->firstOrFail();

        if ($user->role === 'MANAGER' && $schedule->user->department_id !== $user->department_id) {
            abort(403);
        }

        $schedule->delete();
        $this->logActivity('DELETE', "Deleted schedule ID: {$id}", 'WorkSchedule', $id);

        return back()->with('success', 'Jadwal kerja berhasil dihapus.');
    }

    public function getShiftMembers(string $id): JsonResponse
    {
        $user = Auth::user();
        $query_shift = Shift::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query_shift->where('company_id', $user->company_id);
        }
        $shift = $query_shift->firstOrFail();

        $query = User::where('shift_id', $shift->id);
        if ($user->role === 'MANAGER') {
            $query->where('department_id', $user->department_id);
        }

        return response()->json($query->get(['id', 'full_name', 'employee_id', 'position', 'status']));
    }
}
