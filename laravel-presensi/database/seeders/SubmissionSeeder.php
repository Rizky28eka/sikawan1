<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\LeaveType;
use App\Models\Leave;
use App\Models\PermissionRequest;
use App\Models\OvertimeRequest;
use App\Models\CorrectionRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::where('company_code', 'BILCODE-ID')->first();
        $employees = User::where('company_id', $company->id)->where('role', 'EMPLOYEE')->get();

        if (!$company || $employees->isEmpty()) {
            $this->command->info('Company or Employees not found. Skipping submission seeding.');
            return;
        }

        // 1. Create Leave Types
        $leaveTypes = [
            ['name' => 'Cuti Tahunan', 'quota' => 12, 'description' => 'Jatah cuti tahunan reguler.'],
            ['name' => 'Cuti Sakit', 'quota' => 0, 'description' => 'Cuti dengan surat keterangan dokter.'],
            ['name' => 'Cuti Besar', 'quota' => 30, 'description' => 'Cuti khusus masa kerja 5 tahun.'],
            ['name' => 'Cuti Melahirkan', 'quota' => 90, 'description' => 'Cuti melahirkan bagi karyawan wanita.'],
        ];

        $createdLeaveTypes = [];
        foreach ($leaveTypes as $lt) {
            $createdLeaveTypes[] = LeaveType::updateOrCreate(
                ['name' => $lt['name'], 'company_id' => $company->id],
                ['default_quota' => $lt['quota'], 'description' => $lt['description']]
            );
        }

        $this->command->info('✅ Leave types created.');

        // 2. Seed Submissions for each employee
        foreach ($employees as $user) {
            // Randomly create 1-3 leave requests
            $leaveCount = rand(1, 3);
            for ($i = 0; $i < $leaveCount; $i++) {
                $type = collect($createdLeaveTypes)->random();
                $startDate = now()->addDays(rand(10, 60));
                $endDate = (clone $startDate)->addDays(rand(1, 3));

                Leave::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'leave_type_id' => $type->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'status' => collect(['pending', 'approved', 'rejected'])->random(),
                    'reason' => 'Keperluan keluarga / Liburan tahunan.',
                    'created_at' => now()->subDays(rand(1, 30)),
                ]);
            }

            // Randomly create 1-2 permission requests
            $permCount = rand(1, 2);
            for ($i = 0; $i < $permCount; $i++) {
                $startTime = now()->addDays(rand(1, 10))->setHour(rand(8, 10));
                $endTime = (clone $startTime)->setHour(rand(11, 16));

                PermissionRequest::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'type' => collect(['Sakit', 'Izin Menikah', 'Izin Kedukaan', 'Izin Pribadi'])->random(),
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => collect(['pending', 'approved', 'rejected'])->random(),
                    'notes' => 'Izin mendadak karena keperluan penting.',
                    'created_at' => now()->subDays(rand(1, 15)),
                ]);
            }

            // Randomly create 1 overtime request
            if (rand(0, 1)) {
                $startTime = now()->subDays(rand(1, 5))->setHour(18);
                $endTime = (clone $startTime)->setHour(21);

                OvertimeRequest::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'status' => collect(['pending', 'approved', 'rejected'])->random(),
                    'notes' => 'Menyelesaikan task urgent sebelum rilis.',
                    'created_at' => (clone $startTime)->subHours(8),
                ]);
            }

            // Randomly create 1 correction request
            if (rand(0, 1)) {
                CorrectionRequest::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'date' => now()->subDays(rand(1, 7))->format('Y-m-d'),
                    'check_in' => '08:05:00',
                    'check_out' => '17:10:00',
                    'status' => collect(['pending', 'approved', 'rejected'])->random(),
                    'notes' => 'Lupa melakukan clock-out karena gangguan internet.',
                    'created_at' => now()->subDays(rand(0, 3)),
                ]);
            }
        }

        $this->command->info('✅ Sample submissions (Leave, Permission, Overtime, Correction) seeded.');
    }
}
