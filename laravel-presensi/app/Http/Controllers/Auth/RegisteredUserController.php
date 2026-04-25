<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Company details
            'company_name' => 'required|string|max:255',
            'company_code' => 'nullable|string|max:50',
            'company_email' => 'required|string|email|max:255|unique:companies,company_email',
            'company_phone' => 'required|string|max:50|unique:companies,company_phone',
            'company_address' => 'required|string|max:500',

            // User details
            'full_name' => 'required|string|max:255',
            'personal_email' => 'required|string|email|max:255|unique:users,personal_email',
            'personal_phone' => 'required|string|max:50|unique:users,personal_phone',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $companyCode = ! empty($validated['company_code'])
            ? $validated['company_code']
            : strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $validated['company_name']), 0, 6));

        try {
            DB::beginTransaction();

            // Create Company
            $company = Company::create([
                'company_name' => $validated['company_name'],
                'company_code' => $companyCode,
                'company_email' => $validated['company_email'],
                'company_phone' => $validated['company_phone'],
                'company_address' => $validated['company_address'],
            ]);

            // Create Owner/User
            $user = User::create([
                'full_name' => $validated['full_name'],
                'personal_email' => $validated['personal_email'],
                'personal_phone' => $validated['personal_phone'],
                'password' => Hash::make($validated['password']),
                'role' => 'OWNER',
                'company_id' => $company->id,
                'join_date' => now(),
                'email_verified_at' => now(), // Auto-verify OWNER on registration
                'employment_type' => 'FULL_TIME',
                'status' => true,
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            $routeName = $user->role === 'OWNER' ? 'owner.dashboard' : 'dashboard';

            return redirect()->intended(route($routeName))->with('success', 'Registrasi berhasil! Akun Anda telah aktif.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Pendaftaran gagal: '.$e->getMessage())
                ->withInput();
        }
    }
}
