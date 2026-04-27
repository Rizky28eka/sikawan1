<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceNetwork extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'attendance_id',
        'ip_address',
        'ip_address_public',
        'network_type',
        'vpn_detected',
        'proxy_detected',
        'wifi_ssid',
        'wifi_bssid',
        'signal_strength',
        'cellular_carrier',
        'cellular_network_type',
        'connection_speed_mbps',
        'latency_ms',
        'tor_detected',
        'datacenter_ip',
        'ip_reputation_score',
        'ip_country',
        'ip_city',
        'ip_geolocation',
        'suspicious_network',
        'isp',
    ];

    protected $casts = [
        'vpn_detected' => 'boolean',
        'proxy_detected' => 'boolean',
        'tor_detected' => 'boolean',
        'datacenter_ip' => 'boolean',
        'suspicious_network' => 'boolean',
        'ip_reputation_score' => 'float',
        'ip_geolocation' => 'json',
        'connection_speed_mbps' => 'float',
    ];

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }
}
