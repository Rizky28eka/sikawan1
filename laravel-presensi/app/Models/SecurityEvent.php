<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecurityEvent extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'event_type',
        'user_id',
        'ip_address',
        'device_id',
        'severity',
        'details',
        'detected_at',
        'resolved_at',
        'resolved_by',
        'automated_response',
    ];

    protected $casts = [
        'details' => 'json',
        'detected_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
