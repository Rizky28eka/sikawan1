<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Hanya membuat akun admin: Superadmin & Owner perusahaan Bilcode.
     */
    public function run(): void
    {
        $passwordHash = Hash::make('password123');

        // 1. Global Superadmin
        User::updateOrCreate(
            ['personal_email' => 'superadmin@test.com'],
            [
                'full_name' => 'Global Superadmin',
                'personal_phone' => '000000000000',
                'password' => $passwordHash,
                'role' => 'SUPERADMIN',
                'status' => true,
            ]
        );
        echo "✅ Global Superadmin seeded.\n";

        // 2. Company Bilcode
        $company = Company::updateOrCreate(
            ['company_code' => 'BILCODE-ID'],
            [
                'company_name' => 'Bilcode Digital Solutions',
                'company_email' => 'office@bilcode.com',
                'company_phone' => '+62-21-5550-9876',
                'company_address' => 'SCBD, Treasury Tower Lt. 18, Jakarta Selatan, 12190',
                'working_start' => '08:00',
                'working_end' => '17:00',
                'late_tolerance' => 15,
                'auto_absent' => true,
                'status' => true,
            ]
        );
        echo "✅ Company: {$company->company_name} seeded.\n";

        // 3. Owner Bilcode
        User::updateOrCreate(
            ['personal_email' => 'bilcode@test.com'],
            [
                'full_name' => 'Bilcode Primary Owner',
                'personal_phone' => '081111111111',
                'password' => $passwordHash,
                'role' => 'OWNER',
                'company_id' => $company->id,
                'status' => true,
            ]
        );
        echo "✅ Owner Bilcode seeded.\n";

        // 4. Organization Sites
        $this->call(SiteSeeder::class);

        // 5. Bilcode Organization Data (Departments, Shifts, Schedules)
        $this->call(BilcodeOrganizationSeeder::class);

        echo "\n🌟 SEEDING COMPLETED — Admin accounts ready:\n";
        echo "   superadmin@test.com  / password123  → SUPERADMIN\n";
        echo "   bilcode@test.com     / password123  → OWNER (Bilcode Digital Solutions)\n";
    }
}
