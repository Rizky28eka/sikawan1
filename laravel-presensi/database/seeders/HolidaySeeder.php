<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Holiday;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        // 1. Jalankan sinkronisasi otomatis untuk hari libur nasional (2024 - 2026)
        $this->command->info('Syncing National Holidays for 2024-2026...');
        Artisan::call('holiday:sync', ['year' => 2024]);
        Artisan::call('holiday:sync', ['year' => 2025]);
        Artisan::call('holiday:sync', ['year' => 2026]);

        // 2. Tambahkan data hari libur internal (Contoh per perusahaan)
        $companies = Company::all();

        foreach ($companies as $company) {
            $this->command->info("Adding internal holidays for: {$company->company_name}");

            $internalHolidays = [
                [
                    'name' => 'Company Anniversary (HUT '.$company->company_name.')',
                    'date' => '2026-11-10',
                    'type' => 'COMPANY',
                    'description' => 'Hari ulang tahun perusahaan - Libur internal.',
                ],
                [
                    'name' => 'Family Gathering & Outing',
                    'date' => '2026-08-20',
                    'type' => 'COMPANY',
                    'description' => 'Acara tahunan keluarga besar perusahaan.',
                ],
                [
                    'name' => 'Year-End Review & Party',
                    'date' => '2026-12-30',
                    'type' => 'COMPANY',
                    'description' => 'Evaluasi akhir tahun dan perayaan internal.',
                ],
            ];

            foreach ($internalHolidays as $holiday) {
                Holiday::updateOrCreate(
                    [
                        'date' => $holiday['date'],
                        'company_id' => $company->id,
                    ],
                    [
                        'name' => $holiday['name'],
                        'type' => $holiday['type'],
                        'description' => $holiday['description'],
                        'status' => true,
                    ]
                );
            }
        }

        $this->command->info('✅ Holiday seeder completed!');
    }
}
