<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaceBiometric extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id', 'user_id', 'face_embedding', 'model_version', 'confidence_threshold', 'x', 'y', 'width', 'height', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'face_embedding' => 'array',
        'confidence_threshold' => 'float',
        'x' => 'integer',
        'y' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}
