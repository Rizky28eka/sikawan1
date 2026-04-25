<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        $tab = $request->input('tab', 'departments');

        if (! in_array($role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
            abort(403);
        }

        $data = [];
        $managers = [];

        if ($tab === 'departments') {
            $query = Department::with('manager')
                ->withCount('users')
                ->where('company_id', $user->company_id);

            if ($role === 'MANAGER') {
                $query->where('id', $user->department_id);
            }

            if ($request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }

            $data = $query->paginate(15)->withQueryString();

            // Managers for department dropdown
            $managersQuery = User::where('role', 'MANAGER');
            if ($role !== 'SUPERADMIN') {
                $managersQuery->where('company_id', $user->company_id);
            }
            $managers = $managersQuery->get(['id', 'full_name']);

        } elseif ($tab === 'locations') {
            $query = Site::withCount('users');

            if ($role !== 'SUPERADMIN') {
                $query->where('company_id', $user->company_id);
            }

            if ($role === 'MANAGER') {
                $siteIds = User::where('department_id', $user->department_id)
                    ->whereNotNull('site_id')
                    ->pluck('site_id')
                    ->unique();
                $query->whereIn('id', $siteIds);
            }

            if ($request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }

            $data = $query->paginate(15)->withQueryString();
        }

        return Inertia::render('Organization/Index', [
            'data' => $data,
            'tab' => $tab,
            'filters' => $request->only(['search', 'tab']),
            'managers' => $managers,
            'role' => $role,
        ]);
    }

    // Department CRUD
    public function storeDepartment(Request $request)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|uuid|exists:users,id',
        ]);

        Department::create([
            'name' => $request->name,
            'description' => $request->description,
            'manager_id' => $request->manager_id,
            'company_id' => $user->company_id,
        ]);

        return back()->with('success', 'Departemen berhasil dibuat.');
    }

    public function updateDepartment(Request $request, $id)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $department = Department::where('id', $id)->where('company_id', $user->company_id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|uuid|exists:users,id',
        ]);

        $department->update($request->only(['name', 'description', 'manager_id']));

        return back()->with('success', 'Departemen berhasil diperbarui.');
    }

    public function destroyDepartment($id)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }
        Department::where('id', $id)->where('company_id', $user->company_id)->firstOrFail()->delete();

        return back()->with('success', 'Departemen berhasil dihapus.');
    }

    // Site CRUD
    public function storeSite(Request $request)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric|min:10',
            'status' => 'required|boolean',
        ]);

        Site::create(array_merge($request->only(['name', 'address', 'latitude', 'longitude', 'radius', 'status']), [
            'company_id' => $user->company_id,
        ]));

        return back()->with('success', 'Lokasi kerja berhasil ditambahkan.');
    }

    public function updateSite(Request $request, $id)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }

        $site = Site::where('id', $id)->where('company_id', $user->company_id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric|min:10',
            'status' => 'required|boolean',
        ]);

        $site->update($request->only(['name', 'address', 'latitude', 'longitude', 'radius', 'status']));

        return back()->with('success', 'Lokasi kerja berhasil diperbarui.');
    }

    public function destroySite($id)
    {
        $user = Auth::user();
        if (! in_array($user->role, ['OWNER', 'SUPERADMIN'])) {
            abort(403);
        }
        Site::where('id', $id)->where('company_id', $user->company_id)->firstOrFail()->delete();

        return back()->with('success', 'Lokasi kerja berhasil dihapus.');
    }

    public function getMembers(Request $request, $type, $id)
    {
        $user = Auth::user();
        $members = [];

        if ($type === 'department') {
            $department = Department::where('id', $id)->firstOrFail();

            if ($user->role !== 'SUPERADMIN') {
                if ($user->company_id !== $department->company_id) {
                    abort(403);
                }
                if ($user->role === 'MANAGER' && $user->department_id !== $department->id) {
                    abort(403);
                }
            }

            $members = User::where('department_id', $department->id)
                ->get(['id', 'full_name', 'employee_id', 'position', 'role', 'status']);
        } else {
            $site = Site::where('id', $id)->firstOrFail();

            if ($user->role !== 'SUPERADMIN' && $user->company_id !== $site->company_id) {
                abort(403);
            }

            $query = User::where('site_id', $site->id);
            if ($user->role === 'MANAGER') {
                $query->where('department_id', $user->department_id);
            }
            $members = $query->get(['id', 'full_name', 'employee_id', 'position', 'department_id', 'status']);
        }

        return response()->json($members);
    }
}
