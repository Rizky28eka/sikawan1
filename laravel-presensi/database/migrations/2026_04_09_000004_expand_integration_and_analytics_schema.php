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
        // 1. Create Payroll Records Table
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('total_working_days')->default(0);
            $table->integer('total_present_days')->default(0);
            $table->integer('total_absent_days')->default(0);
            $table->integer('total_late_count')->default(0);
            $table->float('total_overtime_hours')->default(0);
            $table->float('total_work_hours')->default(0);
            $table->decimal('deduction_amount', 15, 2)->default(0);
            $table->decimal('bonus_amount', 15, 2)->default(0);
            $table->string('status')->default('draft'); // draft / processed / paid
            $table->timestamp('exported_at')->nullable();
            $table->uuid('exported_by')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('exported_by')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Create Report History Table
        Schema::create('report_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type'); // daily / weekly / monthly / custom
            $table->uuid('generated_by');
            $table->timestamp('generated_at')->nullable();
            $table->date('period_start');
            $table->date('period_end');
            $table->json('filters')->nullable();
            $table->json('department_ids')->nullable();
            $table->json('user_ids')->nullable();
            $table->json('metrics')->nullable();
            $table->string('file_format')->default('PDF'); // PDF / Excel / CSV
            $table->string('file_url')->nullable();
            $table->string('status')->default('generating'); // generating / completed / failed
            $table->timestamps();

            $table->foreign('generated_by')->references('id')->on('users')->onDelete('cascade');
        });

        // 3. Create Security Events Table
        Schema::create('security_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('event_type'); // failed-login / brute-force / unauthorized-access / data-breach-attempt
            $table->uuid('user_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->uuid('device_id')->nullable();
            $table->string('severity')->default('info'); // info / warning / critical
            $table->json('details')->nullable();
            $table->timestamp('detected_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->uuid('resolved_by')->nullable();
            $table->string('automated_response')->nullable(); // account-lock / ip-block / alert
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('resolved_by')->references('id')->on('users')->onDelete('set null');
        });

        // 4. Create ML Model Metrics Table
        Schema::create('ml_model_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('model_type'); // face-recognition / liveness / anomaly-detection / location-prediction
            $table->string('model_version');
            $table->float('accuracy')->default(0);
            $table->float('precision')->default(0);
            $table->float('recall')->default(0);
            $table->float('f1_score')->default(0);
            $table->float('false_positive_rate')->default(0);
            $table->float('false_negative_rate')->default(0);
            $table->timestamp('last_trained_at')->nullable();
            $table->integer('training_dataset_size')->default(0);
            $table->integer('inference_time_avg_ms')->default(0);
            $table->timestamp('deployed_at')->nullable();
            $table->json('monitoring_metrics')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ml_model_metrics');
        Schema::dropIfExists('security_events');
        Schema::dropIfExists('report_history');
        Schema::dropIfExists('payroll_records');
    }
};
