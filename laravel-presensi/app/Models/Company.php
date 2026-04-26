<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Company extends Model
{
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'id',
        'company_name',
        'company_code',
        'company_email',
        'company_phone',
        'company_address',
        'company_logo',
        'status',
        'working_start',
        'working_end',
        'timezone',
        'late_tolerance',
        'auto_absent',
        'enable_face_recognition',
        'enable_geofencing',
        'password_policy',
        'session_timeout',
        'notify_leave_request',
        'notify_attendance_reminder',
        'notify_system_activity',
    ];

    protected $casts = [
        'status' => 'boolean',
        'late_tolerance' => 'integer',
        'auto_absent' => 'boolean',
        'enable_face_recognition' => 'boolean',
        'enable_geofencing' => 'boolean',
        'session_timeout' => 'integer',
        'notify_leave_request' => 'boolean',
        'notify_attendance_reminder' => 'boolean',
        'notify_system_activity' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['company_name', 'company_code', 'status', 'enable_face_recognition', 'enable_geofencing'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the users that belong to this company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'company_id');
    }

    /**
     * Get the sites that belong to this company.
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class, 'company_id');
    }

    /**
     * Get the departments that belong to this company.
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class, 'company_id');
    }

    /**
     * Get the shifts that belong to this company.
     */
    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class, 'company_id');
    }
}
