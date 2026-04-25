<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Attendance extends Model
{
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'id',
        'user_id',
        'company_id',
        'site_id',
        'shift_id',
        'timestamp',
        'timestamp_device',
        'type',
        'status',
        'is_late',
        'confidence',
        'latitude',
        'longitude',
        'device_id',
        'notes',
        'work_schedule_id',
        'office_location_id',
        'actual_duration',
        'overtime_duration',
        'late_duration',
        'early_leave_duration',
        'is_manual_entry',
        'manual_entry_reason',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'attendance_category',
        'work_mode',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'timestamp_device' => 'datetime',
        'approved_at' => 'datetime',
        'status' => 'string',
        'is_late' => 'boolean',
        'is_manual_entry' => 'boolean',
        'confidence' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'status', 'type', 'is_late', 'confidence', 'latitude', 'longitude', 'site_id', 'shift_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    protected $appends = ['site_name', 'time'];

    public function getSiteNameAttribute()
    {
        return $this->site ? $this->site->name : null;
    }

    public function getTimeAttribute()
    {
        return $this->timestamp ? $this->timestamp->format('H:i') : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function location(): HasOne
    {
        return $this->hasOne(AttendanceLocation::class);
    }

    public function biometric(): HasOne
    {
        return $this->hasOne(AttendanceBiometric::class);
    }

    public function network(): HasOne
    {
        return $this->hasOne(AttendanceNetwork::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function anomalyLogs(): HasMany
    {
        return $this->hasMany(AnomalyLog::class);
    }
}
