<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

class Site extends Model
{
    use HasFactory, HasSpatial, HasUuids;

    protected $fillable = [
        'id',
        'name',
        'address',
        'latitude',
        'longitude',
        'radius',
        'status',
        'is_wfh',
        'company_id',
        'shape_type',
        'polygon_coordinates',
        'applicable_departments',
        'applicable_shifts',
        'strict_mode',
        'deleted_at',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'location' => Point::class,
        'boundary' => Polygon::class,
        'radius' => 'float',
        'status' => 'boolean',
        'is_wfh' => 'boolean',
        'strict_mode' => 'boolean',
        'polygon_coordinates' => 'json',
        'applicable_departments' => 'json',
        'applicable_shifts' => 'json',
        'deleted_at' => 'datetime',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'site_id');
    }
}
