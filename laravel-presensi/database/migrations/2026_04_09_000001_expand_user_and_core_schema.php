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
        // 1. Create Divisions Table
        Schema::create('divisions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->uuid('department_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
        });

        // 2. Expand Users Table
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('division_id')->after('department_id')->nullable();
            $table->uuid('direct_manager_id')->after('division_id')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->timestamp('last_login')->nullable();

            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('set null');
            $table->foreign('direct_manager_id')->references('id')->on('users')->onDelete('set null');
        });

        // 3. Expand Shifts Table
        Schema::table('shifts', function (Blueprint $table) {
            $table->integer('grace_period_check_in')->default(0);
            $table->integer('grace_period_check_out')->default(0);
            $table->integer('minimum_work_hours')->default(8);
            $table->integer('maximum_work_hours')->default(12);
            $table->time('overtime_start_after')->nullable();
            $table->integer('break_time_duration')->default(60);
            $table->boolean('break_time_paid')->default(false);
            $table->boolean('flexible_hours')->default(false);
            $table->time('core_hours_start')->nullable();
            $table->time('core_hours_end')->nullable();
            $table->json('weekend_days')->nullable(); // JSON array: ["Saturday", "Sunday"]
            $table->uuid('public_holiday_calendar_id')->nullable();
            $table->string('shift_rotation_pattern')->nullable();
            $table->decimal('night_shift_allowance', 15, 2)->default(0);
            $table->boolean('multi_shift_allowed')->default(false);
            $table->integer('max_overtime_per_day')->default(4);
            $table->integer('max_overtime_per_month')->default(40);
            $table->json('late_penalty_rules')->nullable();
            $table->json('early_leave_penalty_rules')->nullable();
            $table->string('attendance_rounding_rule')->nullable(); // nearest 5/15/30 min
        });

        // 4. Expand Sites (Geofences) Table
        Schema::table('sites', function (Blueprint $table) {
            $table->string('shape_type')->default('circle')->after('radius'); // circle / polygon
            $table->json('polygon_coordinates')->nullable()->after('shape_type');
            $table->json('applicable_departments')->nullable();
            $table->json('applicable_shifts')->nullable();
            $table->boolean('strict_mode')->default(false);
        });

        // 5. Expand Activity Logs Table
        Schema::table('activity_log', function (Blueprint $table) {
            $table->uuid('target_user_id')->nullable()->after('user_id');
            $table->string('source')->default('mobile-app')->after('action'); // mobile-app / web-dashboard / api / system
            $table->string('result')->default('success')->after('source'); // success / failed / partial
            $table->string('session_id')->nullable();
            $table->json('request_payload')->nullable();
            $table->integer('response_code')->nullable();
            $table->text('error_message')->nullable();
            $table->text('error_stack_trace')->nullable();
            $table->json('changes_made')->nullable(); // before/after
            $table->integer('affected_records_count')->nullable();
            $table->text('admin_reason')->nullable();
            $table->uuid('approval_workflow_id')->nullable();
            $table->json('geolocation_at_action')->nullable();
            $table->string('api_endpoint')->nullable();
            $table->integer('processing_time_ms')->nullable();
            $table->float('anomaly_score')->nullable();
            $table->string('risk_level')->default('low'); // low / medium / high
            $table->boolean('fraud_detection_flag')->default(false);
            $table->string('compliance_tag')->nullable(); // GDPR / audit / security

            $table->foreign('target_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropForeign(['target_user_id']);
            $table->dropColumn([
                'target_user_id', 'source', 'result', 'session_id', 'request_payload',
                'response_code', 'error_message', 'error_stack_trace', 'changes_made',
                'affected_records_count', 'admin_reason', 'approval_workflow_id',
                'geolocation_at_action', 'api_endpoint', 'processing_time_ms',
                'anomaly_score', 'risk_level', 'fraud_detection_flag', 'compliance_tag',
            ]);
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn([
                'shape_type', 'polygon_coordinates', 'applicable_departments',
                'applicable_shifts', 'strict_mode',
            ]);
        });

        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn([
                'grace_period_check_in', 'grace_period_check_out', 'minimum_work_hours',
                'maximum_work_hours', 'overtime_start_after', 'break_time_duration',
                'break_time_paid', 'flexible_hours', 'core_hours_start', 'core_hours_end',
                'weekend_days', 'public_holiday_calendar_id', 'shift_rotation_pattern',
                'night_shift_allowance', 'multi_shift_allowed', 'max_overtime_per_day',
                'max_overtime_per_month', 'late_penalty_rules', 'early_leave_penalty_rules',
                'attendance_rounding_rule',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['division_id']);
            $table->dropForeign(['direct_manager_id']);
            $table->dropColumn([
                'division_id', 'direct_manager_id', 'emergency_contact_name',
                'emergency_contact_phone', 'last_login',
            ]);
        });

        Schema::dropIfExists('divisions');
    }
};
