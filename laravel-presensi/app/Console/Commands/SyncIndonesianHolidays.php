<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\Holiday;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use peace2643\IndonesianHolidays\IndonesianHolidays;

class SyncIndonesianHolidays extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'holiday:sync {year? : The year to sync holidays for (default is current year)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Indonesian national holidays from public API for all companies';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $year = $this->argument('year') ?? now()->year;
        $this->info("🔄 Menyinkronkan hari libur nasional Indonesia untuk tahun {$year}...");

        // Mencoba beberapa API publik sebagai fallback
        $apiUrls = [
            "https://api-harilibur.vercel.app/api?year={$year}",
            "https://dayoffapi.vercel.app/api/v1/holidays?year={$year}",
        ];

        $holidays = [];
        $success = false;

        foreach ($apiUrls as $url) {
            try {
                $response = Http::timeout(10)->get($url);
                if ($response->successful()) {
                    $data = $response->json();
                    if (! empty($data)) {
                        $holidays = $data;
                        $success = true;
                        break;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        // Fallback ke library peace2643/indonesian-holidays jika API gagal (khusus untuk 2025)
        if (! $success && $year == 2025 && class_exists('peace2643\IndonesianHolidays\IndonesianHolidays')) {
            $this->warn('⚠️ API sedang limit. Menggunakan library peace2643 untuk data 2025...');
            $lib = new IndonesianHolidays;
            foreach ($lib->getAllHolidays() as $date => $name) {
                $holidays[] = [
                    'holiday_date' => $date,
                    'holiday_name' => $name,
                    'is_national_holiday' => true,
                ];
            }
            $success = true;
        }

        // Fallback ke data kurasi manual untuk 2026
        if (! $success && $year == 2026) {
            $this->warn('⚠️ API sedang limit atau down. Menggunakan data kurasi internal untuk 2026...');
            $holidays = [
                ['holiday_date' => '2026-01-01', 'holiday_name' => 'Tahun Baru Masehi', 'is_national_holiday' => true],
                ['holiday_date' => '2026-01-29', 'holiday_name' => 'Tahun Baru Imlek', 'is_national_holiday' => true],
                ['holiday_date' => '2026-03-31', 'holiday_name' => 'Isra Mikraj', 'is_national_holiday' => true],
                ['holiday_date' => '2026-03-17', 'holiday_name' => 'Hari Suci Nyepi', 'is_national_holiday' => true],
                ['holiday_date' => '2026-03-20', 'holiday_name' => 'Hari Raya Idul Fitri', 'is_national_holiday' => true],
                ['holiday_date' => '2026-03-21', 'holiday_name' => 'Hari Raya Idul Fitri (Hari Kedua)', 'is_national_holiday' => true],
                ['holiday_date' => '2026-04-03', 'holiday_name' => 'Wafat Isa Al Masih', 'is_national_holiday' => true],
                ['holiday_date' => '2026-05-01', 'holiday_name' => 'Hari Buruh Internasional', 'is_national_holiday' => true],
                ['holiday_date' => '2026-05-14', 'holiday_name' => 'Kenaikan Isa Al Masih', 'is_national_holiday' => true],
                ['holiday_date' => '2026-05-22', 'holiday_name' => 'Hari Raya Waisak', 'is_national_holiday' => true],
                ['holiday_date' => '2026-06-01', 'holiday_name' => 'Hari Lahir Pancasila', 'is_national_holiday' => true],
                ['holiday_date' => '2026-06-27', 'holiday_name' => 'Hari Raya Idul Adha', 'is_national_holiday' => true],
                ['holiday_date' => '2026-07-17', 'holiday_name' => 'Tahun Baru Islam (1 Muharram)', 'is_national_holiday' => true],
                ['holiday_date' => '2026-08-17', 'holiday_name' => 'Hari Kemerdekaan Indonesia', 'is_national_holiday' => true],
                ['holiday_date' => '2026-09-25', 'holiday_name' => 'Maulid Nabi Muhammad SAW', 'is_national_holiday' => true],
                ['holiday_date' => '2026-12-25', 'holiday_name' => 'Hari Raya Natal', 'is_national_holiday' => true],
            ];
            $success = true;
        }

        if (! $success) {
            $this->error('❌ Gagal mendapatkan data hari libur dari semua sumber.');

            return 1;
        }

        $companies = Company::all();
        if ($companies->isEmpty()) {
            $this->warn('⚠️ Tidak ada perusahaan yang terdaftar. Data tidak bisa diimpor (karena company_id wajib).');

            return 0;
        }

        $count = 0;
        foreach ($companies as $company) {
            foreach ($holidays as $h) {
                // Mapping key API (terkadang berbeda antar API)
                $date = $h['holiday_date'] ?? $h['date'] ?? null;
                $name = $h['holiday_name'] ?? $h['name'] ?? 'Hari Libur';
                $isNational = $h['is_national_holiday'] ?? true;

                if ($date) {
                    Holiday::updateOrCreate(
                        [
                            'date' => $date,
                            'company_id' => $company->id,
                        ],
                        [
                            'name' => $name,
                            'type' => $isNational ? 'NATIONAL' : 'LEAVE_TOGETHER',
                            'description' => 'Sinkronisasi Otomatis',
                            'status' => true,
                        ]
                    );
                    $count++;
                }
            }
        }

        $this->info("✅ Berhasil menyinkronkan {$count} rekaman hari libur untuk ".$companies->count().' perusahaan.');

        return 0;
    }
}
