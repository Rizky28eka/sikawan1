<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceBiometric extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'attendance_id',
        'face_embedding',
        'model_version',
        'similarity_score',
        'distance_score',
        'threshold_used',
        'match_result',
        'face_quality_score',
        'face_angle',
        'lighting_score',
        'face_bbox',
        'detected_face_count',
        'face_size',
        'eye_aspect_ratio',
        'mask_detected',
        'glasses_detected',
        'occlusion_score',
        'liveness_score',
        'blink_detection',
        'motion_score',
        'spoof_flag',
        'challenge_type',
        'challenge_response_time_ms',
        'depth_map_score',
        'frame_count_analyzed',
        'attack_type',
    ];

    protected $casts = [
        'face_embedding' => 'json',
        'similarity_score' => 'float',
        'distance_score' => 'float',
        'threshold_used' => 'float',
        'face_quality_score' => 'float',
        'lighting_score' => 'float',
        'face_bbox' => 'json',
        'eye_aspect_ratio' => 'float',
        'mask_detected' => 'boolean',
        'glasses_detected' => 'boolean',
        'occlusion_score' => 'float',
        'liveness_score' => 'float',
        'motion_score' => 'float',
        'depth_map_score' => 'float',
    ];

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }
}
