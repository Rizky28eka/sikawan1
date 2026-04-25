<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInvitation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'email',
        'token',
        'company_id',
        'department_id',
        'direct_manager_id',
        'site_id',
        'shift_id',
        'role',
        'position',
        'employment_type',
        'emergency_contact_name',
        'emergency_contact_phone',
        'expires_at',
        'used_at',
        'invited_by',
        'status',
        'type',
        'user_id',
    ];

    protected $appends = ['effective_status'];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    public function isUsed()
    {
        return ! is_null($this->used_at);
    }

    public function isValid()
    {
        return $this->status === 'pending' && ! $this->isExpired();
    }

    public function getEffectiveStatusAttribute()
    {
        if ($this->status === 'accepted' || $this->status === 'used') {
            return 'accepted';
        }

        if ($this->isExpired()) {
            return 'expired';
        }

        return 'pending';
    }
}
