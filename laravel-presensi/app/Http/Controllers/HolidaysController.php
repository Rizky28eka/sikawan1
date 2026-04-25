<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use App\Traits\Loggable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HolidaysController extends Controller
{
    use Loggable;

    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;

        $query = Holiday::query();

        if ($role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }

        // RBAC: Manager is read-only, Owner has full CRUD.
        // Logic for querying is same for both roles as they see company-wide holidays.

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->year && $request->year !== 'all') {
            $query->whereYear('date', $request->year);
        }

        $holidays = $query->orderBy('date', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Holidays/Index', [
            'holidays' => $holidays,
            'filters' => $request->only(['search', 'type', 'year']),
            'role' => $role,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'OWNER' && $user->role !== 'SUPERADMIN') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:NATIONAL,COMPANY',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $holiday = Holiday::create([
            ...$validated,
            'company_id' => $user->role === 'SUPERADMIN' ? null : $user->company_id,
        ]);

        $this->logActivity('CREATE', "Created a new holiday: {$holiday->name}", 'Holiday', $holiday->id);

        return back()->with('success', 'Hari libur berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'OWNER' && $user->role !== 'SUPERADMIN') {
            abort(403);
        }

        $query = Holiday::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $holiday = $query->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:NATIONAL,COMPANY',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        $holiday->update($validated);

        $this->logActivity('UPDATE', "Updated holiday: {$holiday->name}", 'Holiday', $holiday->id);

        return back()->with('success', 'Hari libur berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role !== 'OWNER' && $user->role !== 'SUPERADMIN') {
            abort(403);
        }

        $query = Holiday::where('id', $id);
        if ($user->role !== 'SUPERADMIN') {
            $query->where('company_id', $user->company_id);
        }
        $holiday = $query->firstOrFail();
        $name = $holiday->name;
        $holiday->delete();

        $this->logActivity('DELETE', "Deleted holiday: {$name}", 'Holiday', $id);

        return back()->with('success', 'Hari libur berhasil dihapus.');
    }
}
