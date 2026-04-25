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
        // 1. Remove division_id from user_invitations
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropColumn('division_id');
        });

        // 2. Remove division_id from users
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropColumn('division_id');
        });

        // 3. Drop divisions table
        Schema::dropIfExists('divisions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Recreate divisions table
        Schema::create('divisions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->uuid('department_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });

        // 2. Add division_id to users
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('division_id')->after('department_id')->nullable();
            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('set null');
        });

        // 3. Add division_id to user_invitations
        Schema::table('user_invitations', function (Blueprint $table) {
            $table->uuid('division_id')->nullable()->after('department_id');
            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('set null');
        });
    }
};
