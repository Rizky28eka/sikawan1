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
        Schema::create('companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company_name');
            $table->string('company_code')->unique();
            $table->string('company_email')->unique();
            $table->string('company_phone')->unique();
            $table->string('company_address');
            $table->string('company_logo')->nullable();
            $table->boolean('status')->default(true);
            $table->string('working_start')->default('08:00');
            $table->string('working_end')->default('17:00');
            $table->string('timezone')->default('Asia/Jakarta');
            $table->integer('late_tolerance')->default(0);
            $table->boolean('auto_absent')->default(false);
            $table->boolean('enable_face_recognition')->default(true);
            $table->boolean('enable_geofencing')->default(true);
            $table->string('password_policy')->nullable();
            $table->integer('session_timeout')->default(30);
            $table->boolean('notify_leave_request')->default(true);
            $table->boolean('notify_attendance_reminder')->default(true);
            $table->boolean('notify_system_activity')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
