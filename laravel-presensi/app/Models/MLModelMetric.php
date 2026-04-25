<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MLModelMetric extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'model_type',
        'model_version',
        'accuracy',
        'precision',
        'recall',
        'f1_score',
        'false_positive_rate',
        'false_negative_rate',
        'last_trained_at',
        'training_dataset_size',
        'inference_time_avg_ms',
        'deployed_at',
        'monitoring_metrics',
    ];

    protected $casts = [
        'accuracy' => 'float',
        'precision' => 'float',
        'recall' => 'float',
        'f1_score' => 'float',
        'false_positive_rate' => 'float',
        'false_negative_rate' => 'float',
        'last_trained_at' => 'datetime',
        'deployed_at' => 'datetime',
        'monitoring_metrics' => 'json',
    ];
}
