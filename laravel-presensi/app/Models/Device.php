<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id',
        'device_fingerprint',
        'name',
        'description',
        'type',
        'brand',
        'model',
        'os_version',
        'app_version',
        'screen_resolution',
        'battery_level',
        'storage_available',
        'ram_available',
        'is_rooted_jailbroken',
        'installer_package',
        'device_language',
        'timezone_device',
        'last_app_update',
        'sdk_version',
        'security_patch_level',
        'device_status',
        'multiple_account_flag',
        'ip_address',
        'status',
        'last_active',
        'metadata',
        'company_id',
        'site_id',
    ];

    protected $casts = [
        'is_rooted_jailbroken' => 'boolean',
        'multiple_account_flag' => 'boolean',
        'status' => 'boolean',
        'last_active' => 'datetime',
        'last_app_update' => 'datetime',
        'metadata' => 'array',
        'battery_level' => 'integer',
        'storage_available' => 'integer',
        'ram_available' => 'integer',
    ];
}
