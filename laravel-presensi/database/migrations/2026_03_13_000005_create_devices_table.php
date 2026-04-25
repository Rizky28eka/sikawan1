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
        Schema::create('devices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('type')->default('OTHER');
            $table->string('ip_address')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('last_active')->nullable();
            $table->json('metadata')->nullable();
            $table->uuid('company_id');
            $table->uuid('site_id')->nullable();
            $table->timestamps();

            $table->unique(['name', 'company_id']);
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('site_id')->references('id')->on('sites')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
