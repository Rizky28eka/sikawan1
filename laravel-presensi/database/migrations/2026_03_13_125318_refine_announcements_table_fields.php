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
        Schema::table('announcements', function (Blueprint $table) {
            $table->uuid('department_id')->nullable()->after('company_id');
            $table->renameColumn('publish_date', 'published_at');
            // Using target_id for TEAM and USER as per previous implementation for flexibility,
            // but ensuring the requested columns are present.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('department_id');
            $table->renameColumn('published_at', 'publish_date');
        });
    }
};
