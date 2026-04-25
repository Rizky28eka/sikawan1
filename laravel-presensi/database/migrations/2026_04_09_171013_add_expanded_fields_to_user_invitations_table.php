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
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->uuid('division_id')->nullable()->after('department_id');
            $table->uuid('direct_manager_id')->nullable()->after('division_id');
            $table->uuid('shift_id')->nullable()->after('site_id');
            $table->string('employment_type')->nullable()->after('position');
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();

            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('set null');
            $table->foreign('direct_manager_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('shift_id')->references('id')->on('shifts')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropForeign(['direct_manager_id']);
            $table->dropForeign(['shift_id']);
            $table->dropColumn([
                'division_id', 'direct_manager_id', 'shift_id',
                'employment_type', 'emergency_contact_name', 'emergency_contact_phone',
            ]);
        });
    }
};
