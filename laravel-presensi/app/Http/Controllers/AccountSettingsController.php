<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Site;
use App\Models\SystemSetting;
use App\Models\User;
use App\Traits\Loggable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AccountSettingsController extends Controller
{
    use Loggable;

    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $role = $user->role;
        $tab = $request->input('tab', 'profile');

        $data = [
            'role' => $role,
            'tab' => $tab,
            'user' => $user->only(['id', 'full_name', 'personal_email', 'personal_phone', 'profile_photo', 'position', 'department_id', 'role', 'site_id']),
        ];

        if (in_array($role, ['OWNER', 'MANAGER']) && $tab === 'profile') {
            $data['sites'] = Site::where('company_id', $user->company_id)
                ->where('status', true)
                ->get(['id', 'name', 'is_wfh']);
        }

        if ($role === 'SUPERADMIN' && $tab === 'system') {
            $data['system_settings'] = SystemSetting::all()->groupBy('group');
        }

        if ($role === 'OWNER' && $tab === 'system') {
            $data['company'] = Company::find($user->company_id);
        }

        return Inertia::render('AccountSettings/Index', $data);
    }

    public function updateProfile(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Email immutability: Re-verify it matches if sent, but don't allow changes.
        // The frontend will disable it, but backend must enforce it.
        if ($request->has('personal_email') && $request->personal_email !== $user->personal_email) {
            return back()->with('error', 'Alamat email tidak dapat diubah setelah akun dibuat.');
        }

        $rules = [
            'full_name' => 'required|string|max:255',
            'personal_phone' => 'nullable|string|max:20',
        ];

        // Allow Owners and Managers to change their own work location/site
        if (in_array($user->role, ['OWNER', 'MANAGER'])) {
            $rules['site_id'] = 'nullable|exists:sites,id';
        }

        $validated = $request->validate($rules);

        // Security: Phone number is safe here because Auth::user() context is inherently the owner.
        $user->update($validated);
        $this->logActivity('UPDATE', 'Updated account profile', 'User', $user->id);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        $this->logActivity('UPDATE', 'Changed account security password', 'User', Auth::id());

        return back()->with('success', 'Password berhasil diubah.');
    }

    public function updateCompany(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        if ($user->role !== 'OWNER' && $user->role !== 'SUPERADMIN') {
            abort(403);
        }

        $company = Company::findOrFail($user->company_id);
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_email' => 'required|email',
            'company_phone' => 'required|string',
            'company_address' => 'required|string',
            'working_start' => 'required',
            'working_end' => 'required',
            'timezone' => 'required',
            'late_tolerance' => 'required|integer',
            'auto_absent' => 'required|boolean',
            'enable_face_recognition' => 'required|boolean',
            'enable_geofencing' => 'required|boolean',
            'notify_leave_request' => 'required|boolean',
            'notify_attendance_reminder' => 'required|boolean',
            'notify_system_activity' => 'required|boolean',
        ]);

        $company->update($validated);
        $this->logActivity('UPDATE', 'Updated company system configuration', 'Company', $company->id);

        return back()->with('success', 'Pengaturan perusahaan berhasil diperbarui.');
    }

    public function updateSystem(Request $request)
    {
        if (Auth::user()->role !== 'SUPERADMIN') {
            abort(403);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:system_settings,id',
            'settings.*.value' => 'present',
        ]);

        foreach ($validated['settings'] as $settingData) {
            SystemSetting::where('id', $settingData['id'])->update(['value' => $settingData['value']]);
        }

        $this->logActivity('UPDATE', 'Updated global system settings', 'SystemSetting');

        return back()->with('success', 'Pengaturan platform berhasil diperbarui.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        /** @var User $user */
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/')->with('success', 'Akun Anda berhasil dihapus. Sampai jumpa kembali!');
    }
}
