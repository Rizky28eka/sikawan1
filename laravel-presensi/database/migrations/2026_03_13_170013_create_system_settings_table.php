<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->text('display_name');
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->string('type')->default('string'); // string, text, boolean, integer, json
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed some initial platform settings
        DB::table('system_settings')->insert([
            [
                'id' => Str::uuid(),
                'key' => 'app_name',
                'display_name' => 'Nama Aplikasi',
                'value' => 'Sikawan HR',
                'group' => 'general',
                'type' => 'string',
                'description' => 'Nama platform yang akan ditampilkan di seluruh sistem.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'maintenance_mode',
                'display_name' => 'Mode Perawatan',
                'value' => '0',
                'group' => 'general',
                'type' => 'boolean',
                'description' => 'Aktifkan untuk mengunci akses ke platform sementara waktu.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'allow_registration',
                'display_name' => 'Izinkan Registrasi Perusahaan',
                'value' => '1',
                'group' => 'security',
                'type' => 'boolean',
                'description' => 'Izinkan perusahaan baru untuk mendaftar secara mandiri.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'max_file_size',
                'display_name' => 'Ukuran Maksimal Upload (MB)',
                'value' => '10',
                'group' => 'general',
                'type' => 'integer',
                'description' => 'Batas ukuran file maksimal untuk upload dokumen.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'key' => 'security_log_retention',
                'display_name' => 'Retensi Log Keamanan (Hari)',
                'value' => '90',
                'group' => 'security',
                'type' => 'integer',
                'description' => 'Lama waktu penyimpanan log aktivitas keamanan sistem.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
