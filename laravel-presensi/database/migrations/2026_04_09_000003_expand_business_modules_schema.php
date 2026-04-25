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
        // 1. Expand Notifications Table
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('priority')->default('medium')->after('message'); // low / medium / high / critical
            $table->string('delivery_channel')->default('in-app')->after('priority'); // push / email / sms / in-app
            $table->string('delivery_status')->default('sent')->after('delivery_channel'); // sent / delivered / read / failed
            $table->timestamp('sent_at')->nullable()->after('delivery_status');
            $table->boolean('action_required')->default(false)->after('read_at');
            $table->string('action_url')->nullable()->after('action_required');
            $table->timestamp('expiry_date')->nullable()->after('action_url');
            $table->string('related_entity_type')->nullable()->after('expiry_date');
            $table->uuid('related_entity_id')->nullable()->after('related_entity_type');
        });

        // 2. Expand Leaves Table
        Schema::table('leaves', function (Blueprint $table) {
            $table->float('total_days')->default(1)->after('end_date');
            $table->timestamp('requested_at')->nullable()->after('status');
            $table->text('rejection_reason')->nullable()->after('approved_at');
            $table->string('supporting_document_url')->nullable();
            $table->boolean('is_half_day')->default(false);
            $table->string('emergency_contact_during_leave')->nullable();
        });

        // 3. Expand Overtime Requests Table
        Schema::table('overtime_requests', function (Blueprint $table) {
            $table->uuid('attendance_id')->nullable()->after('company_id');
            $table->date('overtime_date')->nullable()->after('attendance_id');
            $table->float('total_hours')->default(0)->after('end_time');
            $table->string('overtime_type')->default('regular')->after('total_hours'); // regular / weekend / holiday
            $table->text('reason')->nullable()->after('overtime_type');
            $table->string('compensation_type')->default('paid')->after('approved_at'); // paid / time-off
            $table->float('rate_multiplier')->default(1.5)->after('compensation_type');

            $table->foreign('attendance_id')->references('id')->on('attendances')->onDelete('set null');
        });

        // 4. Create Approval Workflows Table
        Schema::create('approval_workflows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entity_type'); // attendance / leave / overtime / manual-entry
            $table->uuid('entity_id');
            $table->uuid('requester_id');
            $table->uuid('current_approver_id')->nullable();
            $table->string('workflow_stage')->default('L1'); // L1 / L2 / L3 / HR / final
            $table->string('status')->default('pending'); // pending / approved / rejected / escalated
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->json('approval_chain')->nullable(); // JSON array of stages
            $table->json('escalation_rules')->nullable();
            $table->timestamp('sla_deadline')->nullable();
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->foreign('requester_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('current_approver_id')->references('id')->on('users')->onDelete('set null');
        });

        // 5. Create Anomaly Logs Table
        Schema::create('anomaly_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('attendance_id')->nullable();
            $table->string('anomaly_type'); // suspicious-location / impossible-travel / unusual-pattern / biometric-mismatch / device-change
            $table->string('severity')->default('low'); // low / medium / high / critical
            $table->float('confidence_score')->default(0);
            $table->timestamp('detected_at')->nullable();
            $table->string('investigation_status')->default('new'); // new / investigating / resolved / false-positive
            $table->uuid('assigned_to')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->string('automated_action')->nullable(); // block / flag / notify
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('attendance_id')->references('id')->on('attendances')->onDelete('set null');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anomaly_logs');
        Schema::dropIfExists('approval_workflows');

        Schema::table('overtime_requests', function (Blueprint $table) {
            $table->dropForeign(['attendance_id']);
            $table->dropColumn([
                'attendance_id', 'overtime_date', 'total_hours', 'overtime_type',
                'reason', 'compensation_type', 'rate_multiplier',
            ]);
        });

        Schema::table('leaves', function (Blueprint $table) {
            $table->dropColumn([
                'total_days', 'requested_at', 'rejection_reason',
                'supporting_document_url', 'is_half_day', 'emergency_contact_during_leave',
            ]);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn([
                'priority', 'delivery_channel', 'delivery_status', 'sent_at',
                'action_required', 'action_url', 'expiry_date',
                'related_entity_type', 'related_entity_id',
            ]);
        });
    }
};
