<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

class AttendanceLocation extends Model
{
    use HasFactory, HasSpatial, HasUuids;

    protected $fillable = [
        'attendance_id',
        'latitude',
        'longitude',
        'accuracy',
        'altitude',
        'source',
        'status_geofence',
        'geofence_id',
        'distance_from_office',
        'address_captured',
        'speed',
        'bearing',
        'location_provider',
        'satellites_count',
        'location_age',
        'is_mock_location',
        'wifi_bssid_list',
        'cell_tower_info',
    ];

    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
        'location' => Point::class,
        'accuracy' => 'float',
        'altitude' => 'float',
        'distance_from_office' => 'float',
        'speed' => 'float',
        'bearing' => 'float',
        'is_mock_location' => 'boolean',
        'wifi_bssid_list' => 'json',
        'cell_tower_info' => 'json',
    ];

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }
}
