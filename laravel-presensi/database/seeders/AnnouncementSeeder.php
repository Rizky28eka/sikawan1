<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::where('company_code', 'BILCODE-ID')->first();
        $owner = User::where('role', 'OWNER')->where('company_id', $company->id)->first();

        if (!$company || !$owner) {
            $this->command->info('Company or Owner not found. Skipping announcement seeding.');
            return;
        }

        $announcements = [
            [
                'title' => 'Update Kebijakan WFH 2026',
                'content' => 'Sehubungan dengan evaluasi operasional, perusahaan menetapkan kebijakan WFH 2 hari dalam seminggu mulai Mei 2026.',
                'type' => 'COMPANY',
                'target_type' => 'ALL',
            ],
            [
                'title' => 'Maintenance Server Sistem Presensi',
                'content' => 'Sistem akan mengalami pemeliharaan rutin pada hari Sabtu ini pukul 23:00 WIB. Mohon maaf atas ketidaknyamanannya.',
                'type' => 'SYSTEM',
                'target_type' => 'ALL',
            ],
            [
                'title' => 'Selamat Bergabung Tim Baru',
                'content' => 'Mari kita sambut rekan-reken baru yang bergabung di departemen Software Engineering bulan ini.',
                'type' => 'COMPANY',
                'target_type' => 'DEPARTMENT',
                'target_id' => $company->departments()->first()?->id,
            ],
            [
                'title' => 'Pengingat Halal Bihalal',
                'content' => 'Jangan lupa hadir dalam acara Halal Bihalal yang akan diadakan di Head Office besok siang.',
                'type' => 'COMPANY',
                'target_type' => 'ALL',
            ],
        ];

        foreach ($announcements as $a) {
            Announcement::create(array_merge($a, [
                'id' => (string) Str::uuid(),
                'company_id' => $company->id,
                'created_by' => $owner->id,
                'published_at' => now(),
                'is_published' => true,
            ]));
        }

        $this->command->info('✅ Sample announcements for Bilcode seeded.');
    }
}
