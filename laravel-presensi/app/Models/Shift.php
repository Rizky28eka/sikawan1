<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'name',
        'start_time',
        'end_time',
        'late_tolerance',
        'is_night_shift',
        'status',
        'company_id',
        'site_id',
        'grace_period_check_in',
        'grace_period_check_out',
        'minimum_work_hours',
        'maximum_work_hours',
        'overtime_start_after',
        'break_time_duration',
        'break_time_paid',
        'flexible_hours',
        'core_hours_start',
        'core_hours_end',
        'weekend_days',
        'public_holiday_calendar_id',
        'shift_rotation_pattern',
        'night_shift_allowance',
        'multi_shift_allowed',
        'max_overtime_per_day',
        'max_overtime_per_month',
        'late_penalty_rules',
        'early_leave_penalty_rules',
        'attendance_rounding_rule',
        'deleted_at',
    ];

    protected $casts = [
        'late_tolerance' => 'integer',
        'is_night_shift' => 'boolean',
        'status' => 'boolean',
        'break_time_paid' => 'boolean',
        'flexible_hours' => 'boolean',
        'multi_shift_allowed' => 'boolean',
        'weekend_days' => 'json',
        'late_penalty_rules' => 'json',
        'early_leave_penalty_rules' => 'json',
        'night_shift_allowance' => 'decimal:2',
        'deleted_at' => 'datetime',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'shift_id');
    }
}
