<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaceSample extends Model
{
    protected $table = 'face_samples';

    protected $fillable = [
        'id',
        'user_id',
        'image_path',
        'x',
        'y',
        'width',
        'height',
        'confidence',
        'embedding',
        'source',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'embedding' => 'array',
        'confidence' => 'float',
        'x' => 'integer',
        'y' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
