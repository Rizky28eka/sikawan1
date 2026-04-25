<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'user_id', 'ip_address', 'user_agent', 'payload', 'last_activity', 'created_at', 'updated_at',
    ];

    protected $casts = [
        'last_activity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
