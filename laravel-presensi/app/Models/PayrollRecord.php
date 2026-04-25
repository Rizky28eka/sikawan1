<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollRecord extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'period_start',
        'period_end',
        'total_working_days',
        'total_present_days',
        'total_absent_days',
        'total_late_count',
        'total_overtime_hours',
        'total_work_hours',
        'deduction_amount',
        'bonus_amount',
        'status',
        'exported_at',
        'exported_by',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'exported_at' => 'datetime',
        'total_overtime_hours' => 'float',
        'total_work_hours' => 'float',
        'deduction_amount' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exportedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'exported_by');
    }
}
