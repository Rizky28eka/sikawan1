<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\Shift;
use App\Models\User;
use App\Models\WorkSchedule;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BilcodeOrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds for Bilcode Digital Solutions.
     */
    public function run(): void
    {
        // 1. Ambil Perusahaan Bilcode
        $company = Company::where('company_code', 'BILCODE-ID')->first();

        if (! $company) {
            $this->command->error('Company BILCODE-ID not found. Please run DatabaseSeeder first.');

            return;
        }

        // 2. Ambil Owner untuk digunakan sebagai Manager default
        $owner = User::where('personal_email', 'bilcode@test.com')->first();

        // 3. Buat Master Shift untuk Bilcode
        $shifts = [
            [
                'name' => 'Regular Morning Shift',
                'start_time' => '08:00',
                'end_time' => '17:00',
                'late_tolerance' => 15,
                'is_night_shift' => false,
                'grace_period_check_in' => 10,
                'grace_period_check_out' => 5,
                'minimum_work_hours' => 8,
                'maximum_work_hours' => 10,
                'break_time_duration' => 60,
            ],
            [
                'name' => 'Middle Shift',
                'start_time' => '11:00',
                'end_time' => '20:00',
                'late_tolerance' => 15,
                'is_night_shift' => false,
                'grace_period_check_in' => 10,
                'grace_period_check_out' => 5,
                'minimum_work_hours' => 8,
                'maximum_work_hours' => 10,
                'break_time_duration' => 60,
            ],
            [
                'name' => 'Night Shift',
                'start_time' => '22:00',
                'end_time' => '06:00',
                'late_tolerance' => 15,
                'is_night_shift' => true,
                'grace_period_check_in' => 10,
                'grace_period_check_out' => 5,
                'minimum_work_hours' => 8,
                'maximum_work_hours' => 10,
                'break_time_duration' => 60,
            ],
        ];

        $createdShifts = [];
        foreach ($shifts as $s) {
            $createdShifts[] = Shift::updateOrCreate(
                ['name' => $s['name'], 'company_id' => $company->id],
                $s
            );
        }

        $this->command->info('✅ Bilcode Shifts created.');

        // 3. Buat Departemen untuk Bilcode
        $departments = [
            ['name' => 'Software Engineering', 'description' => 'Product development and core engineering team.'],
            ['name' => 'Product & Design', 'description' => 'User experience, product management, and interface design.'],
            ['name' => 'Human Capital', 'description' => 'Recruitment, culture, and employee relations.'],
            ['name' => 'Finance & Operations', 'description' => 'General affairs, finance, and day-to-day operations.'],
            ['name' => 'Sales & Marketing', 'description' => 'Growth, content creation, and client acquisition.'],
        ];

        $createdDepartments = [];
        foreach ($departments as $index => $d) {
            $createdDepartments[] = Department::updateOrCreate(
                ['name' => $d['name'], 'company_id' => $company->id],
                [
                    'description' => $d['description'],
                    'shift_id' => $createdShifts[0]->id, // Default to Regular Shift
                    'manager_id' => $owner ? $owner->id : null,
                ]
            );
        }

        $this->command->info('✅ Bilcode Departments created.');

        // 5. Ambil Sites untuk lokasi default
        $sites = $company->sites;
        $headOffice = $sites->where('is_wfh', false)->first();

        // 6. Buat Karyawan Sampel dari List Nama yang Diminta
        $password = Hash::make('password123');
        $today = now();
        $requestedNames = ['Abil', 'Eka', 'Badar', 'Ayip', 'Gilbram', 'Hasim', 'Naji', 'Iqbal', 'Dwicky', 'Fattah'];
        $employmentTypes = ['Permanent', 'Contract', 'Internship', 'Probation'];

        foreach ($requestedNames as $index => $name) {
            $dept = $createdDepartments[$index % count($createdDepartments)];
            $email = Str::slug($name).'@bilcode.com';

            $user = User::updateOrCreate(
                ['personal_email' => $email],
                [
                    'full_name' => $name,
                    'personal_phone' => '0822'.rand(10000000, 99999999),
                    'password' => $password,
                    'role' => 'EMPLOYEE',
                    'company_id' => $company->id,
                    'department_id' => $dept->id,
                    'site_id' => $headOffice ? $headOffice->id : null,
                    'shift_id' => $dept->shift_id,
                    'direct_manager_id' => $owner ? $owner->id : null,
                    'employee_id' => User::generateEmployeeId($company->id),
                    'join_date' => $today->copy()->subMonths(rand(1, 12)),
                    'status' => true,
                    'position' => ($index === 0) ? 'Senior Officer' : 'Staff',
                    'employment_type' => $employmentTypes[$index % count($employmentTypes)],
                    'emergency_contact_name' => 'Emergency Contact for '.$name,
                    'emergency_contact_phone' => '0899'.rand(10000000, 99999999),
                ]
            );

            // 5. Buat Jadwal Kerja (Work Schedule) untuk 7 hari ke depan
            for ($i = 0; $i < 7; $i++) {
                $date = now()->addDays($i);

                WorkSchedule::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'date' => $date->format('Y-m-d'),
                    ],
                    [
                        'shift_id' => $user->shift_id,
                        'company_id' => $company->id,
                        'start_time' => $dept->shift->start_time ?? '08:00',
                        'end_time' => $dept->shift->end_time ?? '17:00',
                        'status' => 'active',
                    ]
                );
            }
        }

        $this->command->info('✅ Bilcode Sample Employees and Schedules created.');
    }
}
