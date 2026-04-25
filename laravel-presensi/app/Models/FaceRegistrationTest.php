<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaceRegistrationTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'testing_condition',
        'frames_collected',
        'frames_valid',
        'duration',
        'frame_quality',
        'face_detected',
        'recognition_result',
        'confidence_score',
        'embedding_stability',
        'pose_variation',
        'stop_reason',
        'final_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
