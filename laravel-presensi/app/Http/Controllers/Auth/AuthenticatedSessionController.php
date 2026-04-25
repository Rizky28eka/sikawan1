<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Traits\Loggable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    use Loggable;

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirect based on user role
        $user = Auth::user();

        $roleDashboardMap = [
            'SUPERADMIN' => 'superadmin.dashboard',
            'OWNER' => 'owner.dashboard',
            'MANAGER' => 'manager.dashboard',
            'EMPLOYEE' => 'employee.dashboard',
        ];

        $routeName = $roleDashboardMap[$user->role] ?? 'dashboard';

        $this->logActivity('LOGIN', 'User logged in to the system', 'Auth', (string) $user->id);

        return redirect()->intended(route($routeName))->with('success', 'Berhasil masuk! Selamat datang kembali.');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        $this->logActivity('LOGOUT', 'User logged out from the system', 'Auth');

        return redirect('/')->with('success', 'Anda telah berhasil keluar dari sistem.');
    }
}
