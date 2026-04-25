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
        Schema::create('face_registration_tests', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('testing_condition')->nullable();
            $table->integer('frames_collected')->default(0);
            $table->integer('frames_valid')->default(0);
            $table->float('duration')->default(0);
            $table->string('frame_quality')->nullable();
            $table->string('face_detected')->nullable();
            $table->string('recognition_result')->nullable();
            $table->float('confidence_score')->default(0);
            $table->string('embedding_stability')->nullable();
            $table->string('pose_variation')->nullable();
            $table->string('stop_reason')->nullable();
            $table->string('final_status')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_registration_tests');
    }
};
