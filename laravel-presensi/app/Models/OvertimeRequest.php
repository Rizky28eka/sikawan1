<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OvertimeRequest extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'user_id',
        'company_id',
        'attendance_id',
        'overtime_date',
        'start_time',
        'end_time',
        'total_hours',
        'overtime_type',
        'reason',
        'status',
        'notes',
        'approver_notes',
        'approved_by',
        'approved_at',
        'compensation_type',
        'rate_multiplier',
    ];

    protected $casts = [
        'overtime_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'total_hours' => 'float',
        'rate_multiplier' => 'float',
        'status' => 'string',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
