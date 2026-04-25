<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'manage-users',
            'manage-companies',
            'manage-sites',
            'manage-shifts',
            'view-attendance',
            'clock-in-out',
            'approve-requests',
            'view-reports',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // Create Roles and Assign Permissions

        // Superadmin
        $role = Role::findOrCreate('superadmin', 'web');
        $role->givePermissionTo(Permission::all());

        // Owner (Company Admin)
        $role = Role::findOrCreate('owner', 'web');
        $role->givePermissionTo([
            'manage-users',
            'manage-sites',
            'manage-shifts',
            'view-attendance',
            'approve-requests',
            'view-reports',
        ]);

        // Manager
        $role = Role::findOrCreate('manager', 'web');
        $role->givePermissionTo([
            'view-attendance',
            'approve-requests',
            'view-reports',
        ]);

        // Employee
        $role = Role::findOrCreate('employee', 'web');
        $role->givePermissionTo([
            'clock-in-out',
            'view-attendance',
        ]);
    }
}
