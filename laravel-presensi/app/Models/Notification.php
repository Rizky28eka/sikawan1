<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'company_id',
        'title',
        'message',
        'priority',
        'delivery_channel',
        'delivery_status',
        'sent_at',
        'type',
        'read_at',
        'action_required',
        'action_url',
        'expiry_date',
        'related_entity_type',
        'related_entity_id',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
        'expiry_date' => 'datetime',
        'action_required' => 'boolean',
    ];
}
