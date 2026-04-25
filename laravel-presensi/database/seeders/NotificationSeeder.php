<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users to give notifications to
        $users = User::whereNotNull('company_id')->take(10)->get();

        if ($users->isEmpty()) {
            $this->command->info('No users with company_id found. Skipping notification seeding.');

            return;
        }

        foreach ($users as $user) {
            // Seed 3-7 notifications for each user
            $count = rand(3, 7);
            for ($i = 0; $i < $count; $i++) {
                $type = collect(['ATTENDANCE', 'SYSTEM', 'ALERT'])->random();

                $title = '';
                $message = '';

                if ($type === 'ATTENDANCE') {
                    $clockType = collect(['Clock-In', 'Clock-Out'])->random();
                    $title = "Presensi $clockType Berhasil";
                    $message = "Anda telah berhasil melakukan $clockType pada pukul ".now()->subHours(rand(1, 48))->format('H:i').'.';
                } elseif ($type === 'SYSTEM') {
                    $title = 'Update Sistem';
                    $message = 'Sistem Sikawan telah diperbarui ke versi 1.1.0 dengan fitur stabilitas kamera.';
                } else {
                    $title = 'Pengingat Penting';
                    $message = 'Pastikan Anda menggunakan seragam lengkap hari ini.';
                }

                Notification::create([
                    'id' => (string) Str::uuid(),
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'title' => $title,
                    'message' => $message,
                    'type' => $type,
                    'read_at' => rand(0, 1) ? now()->subMinutes(rand(10, 500)) : null,
                    'created_at' => now()->subDays(rand(0, 5))->subHours(rand(0, 23)),
                ]);
            }
        }
    }
}
