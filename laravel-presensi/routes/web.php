<?php

use App\Http\Controllers\AccountSettingsController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\InvitationController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\HolidaysController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\WorkScheduleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Role-specific aliases that all point to the same controller
    Route::get('/superadmin/dashboard', [DashboardController::class, 'index'])->name('superadmin.dashboard');
    Route::get('/owner/dashboard', [DashboardController::class, 'index'])->name('owner.dashboard');
    Route::get('/manager/dashboard', [DashboardController::class, 'index'])->name('manager.dashboard');
    Route::get('/employee/dashboard', [DashboardController::class, 'index'])->name('employee.dashboard');

    Route::get('/superadmin/attendance', [AttendanceController::class, 'index'])->name('superadmin.attendance');
    Route::get('/superadmin/attendance/{id}', [AttendanceController::class, 'show'])->name('superadmin.attendance.show');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance');
    Route::get('/attendance/{id}', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::get('/owner/attendance', [AttendanceController::class, 'index'])->name('owner.attendance');
    Route::get('/owner/attendance/{id}', [AttendanceController::class, 'show'])->name('owner.attendance.show');
    Route::get('/manager/attendance', [AttendanceController::class, 'index'])->name('manager.attendance');
    Route::get('/manager/attendance/{id}', [AttendanceController::class, 'show'])->name('manager.attendance.show');
    Route::get('/employee/attendance', [AttendanceController::class, 'index'])->name('employee.attendance');
    Route::get('/employee/attendance/{id}', [AttendanceController::class, 'show'])->name('employee.attendance.show');

    Route::get('/checkincheckout', [AttendanceController::class, 'check'])->name('attendance.check');
    Route::get('/owner/checkincheckout', [AttendanceController::class, 'check'])->name('owner.attendance.check');
    Route::get('/manager/checkincheckout', [AttendanceController::class, 'check'])->name('manager.attendance.check');
    Route::get('/employee/checkincheckout', [AttendanceController::class, 'check'])->name('employee.attendance.check');
    Route::post('/checkincheckout', [AttendanceController::class, 'storeCheck'])->name('attendance.check.store');

    // Requests (Unified: Leaves, Overtime, Permission, Correction)
    Route::get('/requests', [RequestsController::class, 'index'])->name('requests');
    Route::get('/owner/requests', [RequestsController::class, 'index'])->name('owner.requests');
    Route::get('/manager/requests', [RequestsController::class, 'index'])->name('manager.requests');
    Route::get('/employee/requests', [RequestsController::class, 'index'])->name('employee.requests');

    Route::post('/requests', [RequestsController::class, 'store'])->name('requests.store');
    Route::post('/requests/{type}/{id}/status', [RequestsController::class, 'updateStatus'])->name('requests.update-status');
    Route::delete('/requests/{type}/{id}', [RequestsController::class, 'destroy'])->name('requests.destroy');

    // Communication Center (Unified: Announcements & Notifications)
    Route::get('/communication', [CommunicationController::class, 'index'])->name('communication');
    Route::get('/superadmin/communication', [CommunicationController::class, 'index'])->name('superadmin.communication');
    Route::get('/owner/communication', [CommunicationController::class, 'index'])->name('owner.communication');
    Route::get('/manager/communication', [CommunicationController::class, 'index'])->name('manager.communication');
    Route::get('/employee/communication', [CommunicationController::class, 'index'])->name('employee.communication');

    Route::post('/communication/announcements', [CommunicationController::class, 'storeAnnouncement'])->name('communication.announcements.store');
    Route::put('/communication/announcements/{id}', [CommunicationController::class, 'updateAnnouncement'])->name('communication.announcements.update');
    Route::delete('/communication/announcements/{id}', [CommunicationController::class, 'destroyAnnouncement'])->name('communication.announcements.destroy');

    Route::post('/communication/notifications/{id}/read', [CommunicationController::class, 'markNotificationRead'])->name('communication.notifications.read');
    Route::post('/communication/notifications/read-all', [CommunicationController::class, 'markAllNotificationsRead'])->name('communication.notifications.read-all');
    Route::delete('/communication/notifications/{id}', [CommunicationController::class, 'destroyNotification'])->name('communication.notifications.destroy');

    // Analytics & Insights (Unified: Reports & Activity Logs)
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/superadmin/analytics', [AnalyticsController::class, 'index'])->name('superadmin.analytics');
    Route::get('/owner/analytics', [AnalyticsController::class, 'index'])->name('owner.analytics');
    Route::get('/manager/analytics', [AnalyticsController::class, 'index'])->name('manager.analytics');
    Route::get('/employee/analytics', [AnalyticsController::class, 'index'])->name('employee.analytics');

    Route::get('/analytics/export/report', [AnalyticsController::class, 'exportReport'])->name('analytics.export.report');
    Route::get('/analytics/export/logs', [AnalyticsController::class, 'exportLogs'])->name('analytics.export.logs');
    Route::get('/analytics/export/research', [AnalyticsController::class, 'exportResearch'])->name('analytics.export.research');

    // Holidays
    Route::get('/owner/holidays', [HolidaysController::class, 'index'])->name('owner.holidays');
    Route::get('/manager/holidays', [HolidaysController::class, 'index'])->name('manager.holidays');
    Route::post('/holidays', [HolidaysController::class, 'store'])->name('holidays.store');
    Route::put('/holidays/{id}', [HolidaysController::class, 'update'])->name('holidays.update');
    Route::delete('/holidays/{id}', [HolidaysController::class, 'destroy'])->name('holidays.destroy');
 
    // Work Schedules (Unified: Shifts & Employee Schedules)
    Route::get('/work-schedule', [WorkScheduleController::class, 'index'])->name('work-schedule');
    Route::get('/owner/work-schedule', [WorkScheduleController::class, 'index'])->name('owner.work-schedule');
    Route::get('/manager/work-schedule', [WorkScheduleController::class, 'index'])->name('manager.work-schedule');
    Route::get('/employee/work-schedule', [WorkScheduleController::class, 'index'])->name('employee.work-schedule');

    Route::post('/work-schedule/shifts', [WorkScheduleController::class, 'storeShift'])->name('work-schedule.shifts.store');
    Route::put('/work-schedule/shifts/{id}', [WorkScheduleController::class, 'updateShift'])->name('work-schedule.shifts.update');
    Route::delete('/work-schedule/shifts/{id}', [WorkScheduleController::class, 'destroyShift'])->name('work-schedule.shifts.destroy');
    Route::get('/work-schedule/shifts/{id}/members', [WorkScheduleController::class, 'getShiftMembers'])->name('work-schedule.shifts.members');

    Route::post('/work-schedule/schedules', [WorkScheduleController::class, 'storeSchedule'])->name('work-schedule.schedules.store');
    Route::put('/work-schedule/schedules/{id}', [WorkScheduleController::class, 'updateSchedule'])->name('work-schedule.schedules.update');
    Route::delete('/work-schedule/schedules/{id}', [WorkScheduleController::class, 'destroySchedule'])->name('work-schedule.schedules.destroy');

    // Account & System Settings (Unified: Profile, Security, System Settings)
    Route::get('/account-settings', [AccountSettingsController::class, 'index'])->name('account-settings');
    Route::get('/superadmin/settings', [AccountSettingsController::class, 'index'])->name('superadmin.settings');
    Route::get('/owner/settings', [AccountSettingsController::class, 'index'])->name('owner.settings');
    Route::get('/manager/settings', [AccountSettingsController::class, 'index'])->name('manager.settings');
    Route::get('/employee/settings', [AccountSettingsController::class, 'index'])->name('employee.settings');

    Route::post('/account-settings/profile', [AccountSettingsController::class, 'updateProfile'])->name('account-settings.profile.update');
    Route::post('/account-settings/password', [AccountSettingsController::class, 'updatePassword'])->name('account-settings.password.update');
    Route::post('/account-settings/company', [AccountSettingsController::class, 'updateCompany'])->name('account-settings.company.update');
    Route::post('/account-settings/system', [AccountSettingsController::class, 'updateSystem'])->name('account-settings.system.update');
    Route::delete('/account-settings', [AccountSettingsController::class, 'destroy'])->name('account-settings.destroy');

    // Organization (Unified: Departments & Locations)
    Route::get('/organization', [OrganizationController::class, 'index'])->name('organization');
    Route::get('/owner/organization', [OrganizationController::class, 'index'])->name('owner.organization');
    Route::get('/manager/organization', [OrganizationController::class, 'index'])->name('manager.organization');

    Route::post('/organization/departments', [OrganizationController::class, 'storeDepartment'])->name('organization.departments.store');
    Route::put('/organization/departments/{id}', [OrganizationController::class, 'updateDepartment'])->name('organization.departments.update');
    Route::delete('/organization/departments/{id}', [OrganizationController::class, 'destroyDepartment'])->name('organization.departments.destroy');

    Route::post('/organization/sites', [OrganizationController::class, 'storeSite'])->name('organization.sites.store');
    Route::put('/organization/sites/{id}', [OrganizationController::class, 'updateSite'])->name('organization.sites.update');
    Route::delete('/organization/sites/{id}', [OrganizationController::class, 'destroySite'])->name('organization.sites.destroy');

    Route::get('/organization/members/{type}/{id}', [OrganizationController::class, 'getMembers'])->name('organization.members');

    // Employee Management (EMS)
    Route::get('/employees', [EmployeesController::class, 'index'])->name('employees');
    Route::get('/employees/{id}', [EmployeesController::class, 'show'])->name('employees.show');
    Route::get('/superadmin/employees', [EmployeesController::class, 'index'])->name('superadmin.employees');
    Route::get('/owner/employees', [EmployeesController::class, 'index'])->name('owner.employees');
    Route::get('/manager/employees', [EmployeesController::class, 'index'])->name('manager.employees');

    Route::post('/employees/invite', [EmployeesController::class, 'invite'])->name('employees.invite');
    Route::post('/employees/generate-face-invite', [EmployeesController::class, 'generateFaceInvite'])->name('employees.generate-face-invite');
    Route::post('/employees/{id}/force-reregistration', [EmployeesController::class, 'forceReRegistration'])->name('employees.force-reregistration');
    Route::put('/employees/{id}', [EmployeesController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{id}', [EmployeesController::class, 'destroy'])->name('employees.destroy');

    // SuperAdmin Global Management
    Route::get('/superadmin/management', [SuperAdminController::class, 'index'])->name('superadmin.management');

    // Redirects for old routes (handling legacy bookmarks or transition state)
    Route::get('/dashboard/companies', fn () => redirect()->route('superadmin.management'));
    Route::get('/dashboard/users', fn () => redirect()->route('superadmin.management'));
    Route::get('/superadmin/devices', fn () => redirect()->route('superadmin.management'));

});

Route::middleware('auth')->group(function () {
    // Legacy routes can be redirected or removed if not needed
});

require __DIR__.'/auth.php';

// Public Invitation Routes
Route::get('/invitation/accept/{token}', [InvitationController::class, 'accept'])->name('invitation.accept');
Route::post('/invitation/register', [InvitationController::class, 'register'])->name('invitation.register');
