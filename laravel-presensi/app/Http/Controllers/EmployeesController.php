<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Shift;
use App\Models\Site;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class EmployeesController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $role = $user->role;

        $query = User::query()->with([
            'department',
            'site',
            'company',
            'directManager',
            'shift',
            'workSchedules',
            'faceBiometric',
        ])->withCount('faceBiometric');

        // RBAC: SUPERADMIN can see all, OWNER/MANAGER restricted by company
        if ($role !== 'SUPERADMIN') {
            $query->where('company_id', '=', $user->company_id);

            if ($role === 'MANAGER') {
                $query->where('department_id', '=', $user->department_id);
            }
        }

        // Filters
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', "%{$request->search}%")
                    ->orWhere('personal_email', 'like', "%{$request->search}%")
                    ->orWhere('employee_id', 'like', "%{$request->search}%");
            });
        }

        if ($request->department_id) {
            $query->where('department_id', '=', $request->department_id);
        }

        if ($request->site_id) {
            $query->where('site_id', '=', $request->site_id);
        }

        if ($request->role && $request->role !== 'all') {
            $query->where('role', '=', $request->role);
        }

        if ($request->status !== null && $request->status !== '' && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('status', true);
            } elseif ($request->status === 'inactive') {
                $query->where('status', false);
            } else {
                $query->where('status', '=', $request->status);
            }
        }

        $employees = $query->latest()->paginate(10)->withQueryString();

        // Invitations list
        $invitationsQuery = UserInvitation::with(['department', 'site', 'inviter']);

        if ($role !== 'SUPERADMIN') {
            $invitationsQuery->where('company_id', '=', $user->company_id);
            if ($role === 'MANAGER') {
                $invitationsQuery->where('department_id', '=', $user->department_id);
            }
        }

        $invitations = $invitationsQuery->latest()->get()->map(function ($inv) {
            return $inv;
        });

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'department_id', 'role', 'status', 'site_id']),
            'departments' => $role === 'SUPERADMIN' ? Department::all() : Department::where('company_id', $user->company_id)->get(),
            'sites' => $role === 'SUPERADMIN' ? Site::all() : Site::where('company_id', $user->company_id)->get(),
            'shifts' => $role === 'SUPERADMIN' ? Shift::all() : Shift::where('company_id', $user->company_id)->get(),
            'managers' => $role === 'SUPERADMIN'
                ? User::whereIn('role', ['MANAGER', 'OWNER'])->get(['id', 'full_name'])
                : User::where('company_id', $user->company_id)
                    ->whereIn('role', ['MANAGER', 'OWNER'])
                    ->get(['id', 'full_name']),
            'invitations' => $invitations,
            'auth_user' => $user,
        ]);
    }

    public function show(string $id): Response
    {
        $user = Auth::user();
        $employee = User::with([
            'department',
            'site',
            'company',
            'directManager',
            'shift',
            'workSchedules',
            'faceBiometric',
        ])->withCount('faceBiometric')->findOrFail($id);

        // RBAC Check
        if ($user->role !== 'SUPERADMIN') {
            if ($employee->company_id !== $user->company_id) {
                abort(403, 'Unauthorized');
            }
            if ($user->role === 'MANAGER' && $employee->department_id !== $user->department_id) {
                abort(403, 'Unauthorized');
            }
        }

        // Fetch recent attendance
        $attendances = Attendance::where('user_id', $id)
            ->with(['site', 'biometric', 'location', 'network'])
            ->latest('timestamp')
            ->limit(50)
            ->get();

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'attendances' => $attendances,
            'auth_user' => $user,
            'departments' => $user->role === 'SUPERADMIN' ? Department::all() : Department::where('company_id', $user->company_id)->get(),
            'sites' => $user->role === 'SUPERADMIN' ? Site::all() : Site::where('company_id', $user->company_id)->get(),
            'shifts' => $user->role === 'SUPERADMIN' ? Shift::all() : Shift::where('company_id', $user->company_id)->get(),
            'managers' => $user->role === 'SUPERADMIN'
                ? User::whereIn('role', ['MANAGER', 'OWNER'])->get(['id', 'full_name'])
                : User::where('company_id', $user->company_id)
                    ->whereIn('role', ['MANAGER', 'OWNER'])
                    ->get(['id', 'full_name']),
        ]);
    }

    public function invite(Request $request): RedirectResponse
    {
        Log::info('Menerima permintaan undangan:', $request->all());

        try {
            $request->validate([
                'email' => 'required|email|unique:users,personal_email',
                'role' => 'required|string',
                'department_id' => 'required|exists:departments,id',
                'direct_manager_id' => 'required|exists:users,id',
                'site_id' => 'required|exists:sites,id',
                'shift_id' => 'required|exists:shifts,id',
                'position' => 'required|string|max:255',
                'employment_type' => 'required|string',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_phone' => 'required|string|max:20',
            ]);
        } catch (ValidationException $e) {
            Log::warning('Validasi undangan gagal:', $e->errors());

            throw $e;
        }

        // RBAC check for Manager
        if (Auth::user()->role === 'MANAGER' && $request->department_id != Auth::user()->department_id) {
            Log::warning('Manager mencoba mengundang ke luar departemen:', [
                'user' => Auth::id(),
                'target_dept' => $request->department_id,
            ]);

            return back()->withErrors(['department_id' => 'Anda hanya dapat mengundang karyawan ke departemen Anda sendiri.']);
        }

        $invitation = UserInvitation::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => (string) Str::uuid(),
                'company_id' => Auth::user()->company_id,
                'department_id' => $request->department_id,
                'direct_manager_id' => $request->direct_manager_id,
                'site_id' => $request->site_id,
                'shift_id' => $request->shift_id,
                'role' => $request->role,
                'position' => $request->position,
                'employment_type' => $request->employment_type,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'expires_at' => now()->addDays(7),
                'invited_by' => Auth::id(),
                'status' => 'pending',
                'type' => 'registration',
            ]
        );

        Log::info('Undangan berhasil dibuat atau diperbarui:', ['id' => $invitation->id]);

        // Log Activity
        ActivityLog::create([
            'user_id' => Auth::id(),
            'company_id' => Auth::user()->company_id,
            'action' => 'CREATE',
            'entity' => 'UserInvitation',
            'entity_id' => $invitation->id,
            'description' => "Created invitation for {$request->email}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Undangan berhasil dibuat.');
    }

    public function generateFaceInvite(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // RBAC Check
        if (Auth::user()->role === 'MANAGER' && $user->department_id != Auth::user()->department_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $invitation = UserInvitation::updateOrCreate(
            ['email' => $user->personal_email],
            [
                'token' => (string) Str::uuid(),
                'company_id' => $user->company_id,
                'department_id' => $user->department_id,
                'site_id' => $user->site_id,
                'role' => $user->role,
                'position' => $user->position,
                'expires_at' => now()->addDays(7),
                'invited_by' => Auth::id(),
                'status' => 'pending',
                'type' => 'face_registration',
                'user_id' => $user->id,
            ]
        );

        ActivityLog::create([
            'user_id' => Auth::id(),
            'company_id' => Auth::user()->company_id,
            'action' => 'CREATE',
            'entity' => 'UserInvitation',
            'entity_id' => $invitation->id,
            'description' => "Generated Face Registration link for {$user->full_name}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Link registrasi wajah berhasil dibuat.',
            'link' => route('invitation.accept', $invitation->token),
        ]);
    }

    public function destroy(string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // RBAC check
        if (Auth::user()->role === 'MANAGER' && $user->department_id != Auth::user()->department_id) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        $user->delete();

        return back()->with('success', 'Karyawan berhasil dihapus.');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // RBAC check
        if (Auth::user()->role === 'MANAGER' && $user->department_id != Auth::user()->department_id) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        /** @var User $authUser */
        $authUser = Auth::user();

        // 1. Basic Validation Rules
        $rules = [
            'role' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'direct_manager_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'site_id' => 'required|exists:sites,id',
            'position' => 'required|string|max:255',
            'employment_type' => 'required|string',
            'status' => 'required',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
        ];

        // 2. Conditional Validation: 'full_name' is only required/updatable by Superadmin or Own Profile
        if ($authUser->role === 'SUPERADMIN' || $authUser->id === $user->id) {
            $rules['full_name'] = 'required|string|max:255';
        }

        $request->validate($rules);

        // 3. Prepare Data for Update (Restricted for Owner/Manager)
        $allowedFields = [
            'role', 'department_id', 'direct_manager_id',
            'shift_id', 'site_id', 'position', 'employment_type',
            'status', 'emergency_contact_name', 'emergency_contact_phone',
        ];

        // If Superadmin or Own Profile, allow full name update
        if ($authUser->role === 'SUPERADMIN' || $authUser->id === $user->id) {
            $allowedFields[] = 'full_name';
        }

        $data = $request->only($allowedFields);

        // Phone/Email Update Restriction: ONLY owner of account or SUPERADMIN can edit sensitive info.
        if ($authUser->id === $user->id || $authUser->role === 'SUPERADMIN') {
            if ($request->has('personal_phone')) {
                $data['personal_phone'] = $request->personal_phone;
            }
            if ($request->has('personal_email')) {
                $data['personal_email'] = $request->personal_email;
            }
        }

        if (isset($data['status'])) {
            $data['status'] = $data['status'] === 'active';
        }

        $user->update($data);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'company_id' => Auth::user()->company_id,
            'action' => 'UPDATE',
            'entity' => 'User',
            'entity_id' => $user->id,
            'description' => "Updated employee data: {$user->full_name}",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function forceReRegistration(string $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        // RBAC check
        if (Auth::user()->role === 'MANAGER' && $user->department_id != Auth::user()->department_id) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        if ($user->faceBiometric) {
            $user->faceBiometric->requires_re_registration = true;
            $user->faceBiometric->save();

            ActivityLog::create([
                'user_id' => Auth::id(),
                'company_id' => Auth::user()->company_id,
                'action' => 'UPDATE',
                'entity' => 'User',
                'entity_id' => $user->id,
                'description' => "Forced re-registration for {$user->full_name}",
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return back()->with('success', 'Status pendaftaran ulang wajah diaktifkan untuk karyawan ini.');
        }

        return back()->withErrors(['error' => 'Karyawan belum memiliki data biometrik wajah.']);
    }
}
