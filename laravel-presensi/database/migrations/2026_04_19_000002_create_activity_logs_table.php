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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->uuid('target_user_id')->nullable();
            $table->uuid('company_id')->nullable();

            $table->string('action');
            $table->string('source')->nullable();
            $table->string('result')->nullable();

            $table->string('entity')->nullable();
            $table->uuid('entity_id')->nullable();

            $table->json('details')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('session_id')->nullable();

            $table->json('request_payload')->nullable();
            $table->integer('response_code')->nullable();
            $table->text('error_message')->nullable();
            $table->text('error_stack_trace')->nullable();

            $table->json('changes_made')->nullable();
            $table->integer('affected_records_count')->nullable();

            $table->text('admin_reason')->nullable();
            $table->uuid('approval_workflow_id')->nullable();
            $table->json('geolocation_at_action')->nullable();

            $table->string('api_endpoint')->nullable();
            $table->integer('processing_time_ms')->nullable();

            $table->float('anomaly_score')->nullable();
            $table->string('risk_level')->nullable();
            $table->boolean('fraud_detection_flag')->nullable();
            $table->string('compliance_tag')->nullable();

            $table->text('description');

            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('user_id');
            $table->index('company_id');
            $table->index('action');
            $table->index('entity');
            $table->index('entity_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
