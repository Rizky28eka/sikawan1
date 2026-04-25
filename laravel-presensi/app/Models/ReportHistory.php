<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'report_history';

    protected $fillable = [
        'type',
        'generated_by',
        'generated_at',
        'period_start',
        'period_end',
        'filters',
        'department_ids',
        'user_ids',
        'metrics',
        'file_format',
        'file_url',
        'status',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'period_start' => 'date',
        'period_end' => 'date',
        'filters' => 'json',
        'department_ids' => 'json',
        'user_ids' => 'json',
        'metrics' => 'json',
    ];

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
