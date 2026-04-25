<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'activity_logs';

    protected $fillable = [
        'id',
        'user_id',
        'target_user_id',
        'company_id',
        'action',
        'source',
        'result',
        'entity',
        'entity_id',
        'details',
        'ip_address',
        'user_agent',
        'session_id',
        'request_payload',
        'response_code',
        'error_message',
        'error_stack_trace',
        'changes_made',
        'affected_records_count',
        'admin_reason',
        'approval_workflow_id',
        'geolocation_at_action',
        'api_endpoint',
        'processing_time_ms',
        'anomaly_score',
        'risk_level',
        'fraud_detection_flag',
        'compliance_tag',
        'description',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'details' => 'json',
        'request_payload' => 'json',
        'changes_made' => 'json',
        'geolocation_at_action' => 'json',
        'anomaly_score' => 'float',
        'fraud_detection_flag' => 'boolean',
        'response_code' => 'integer',
        'affected_records_count' => 'integer',
        'processing_time_ms' => 'integer',
    ];

    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
