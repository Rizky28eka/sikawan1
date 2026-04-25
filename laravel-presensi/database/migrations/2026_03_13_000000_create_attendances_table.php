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
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('company_id')->nullable();
            $table->uuid('site_id')->nullable();
            $table->uuid('shift_id')->nullable();
            $table->timestamp('timestamp')->nullable();
            $table->string('type')->default('CLOCK_IN'); // CLOCK_IN, CLOCK_OUT
            $table->string('status')->default('PRESENT'); // PRESENT, LATE, ABSENT
            $table->boolean('is_late')->default(false);
            $table->float('confidence')->default(0.0);
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->uuid('device_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
