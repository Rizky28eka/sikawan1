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
        Schema::table('face_biometrics', function (Blueprint $table) {
            $table->integer('embedding_version')->default(1)->after('face_embedding');
            $table->integer('total_samples')->default(30)->after('embedding_version');
            $table->boolean('requires_re_registration')->default(false)->after('total_samples');
            $table->decimal('average_confidence', 5, 2)->nullable()->after('requires_re_registration');
            $table->timestamp('last_trained_at')->nullable()->after('average_confidence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('face_biometrics', function (Blueprint $table) {
            //
        });
    }
};
