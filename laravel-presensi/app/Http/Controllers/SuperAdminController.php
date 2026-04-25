<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Device;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminController extends Controller
{
    /**
     * Display the consolidated global management dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('SuperAdmin/Index', [
            'companies' => Company::with(['users', 'sites'])->withCount(['users', 'sites as site_count'])->get(),
            'users' => [
                'data' => User::with(['company'])->orderBy('created_at', 'desc')->take(10)->get(), // Showing top 10 as it's a dashboard view
            ],
            'devices' => Device::orderBy('last_active', 'desc')->take(10)->get(),
        ]);
    }
}
