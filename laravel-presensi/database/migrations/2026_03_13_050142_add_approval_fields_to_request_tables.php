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
        $tables = ['overtime_requests', 'permission_requests', 'correction_requests'];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->text('approver_notes')->nullable();
                $table->uuid('approved_by')->nullable();
                $table->dateTime('approved_at')->nullable();

                $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['overtime_requests', 'permission_requests', 'correction_requests'];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropForeign($tableName.'_approved_by_foreign');
                $table->dropColumn(['approver_notes', 'approved_by', 'approved_at']);
            });
        }
    }
};
