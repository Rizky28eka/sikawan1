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
            $table->string('type')->default('COMPANY')->after('content'); // SYSTEM, COMPANY
            $table->string('target_type')->default('ALL')->after('type'); // ALL, COMPANY, DEPARTMENT, TEAM, USER
            $table->uuid('target_id')->nullable()->after('target_type');
            $table->uuid('created_by')->after('target_id');
            $table->dateTime('publish_date')->nullable()->after('created_by');
            $table->boolean('is_published')->default(true)->after('publish_date');

            $table->uuid('company_id')->nullable()->change();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn(['type', 'target_type', 'target_id', 'created_by', 'publish_date', 'is_published']);
            $table->uuid('company_id')->change();
        });
    }
};
