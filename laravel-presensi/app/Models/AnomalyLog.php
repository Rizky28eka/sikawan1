<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnomalyLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'attendance_id',
        'anomaly_type',
        'severity',
        'confidence_score',
        'detected_at',
        'investigation_status',
        'assigned_to',
        'resolution_notes',
        'automated_action',
    ];

    protected $casts = [
        'detected_at' => 'datetime',
        'confidence_score' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
