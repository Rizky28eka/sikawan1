<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalWorkflow extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'entity_type',
        'entity_id',
        'requester_id',
        'current_approver_id',
        'workflow_stage',
        'status',
        'submitted_at',
        'processed_at',
        'approval_chain',
        'escalation_rules',
        'sla_deadline',
        'comments',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'processed_at' => 'datetime',
        'sla_deadline' => 'datetime',
        'approval_chain' => 'json',
        'escalation_rules' => 'json',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function currentApprover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_approver_id');
    }
}
