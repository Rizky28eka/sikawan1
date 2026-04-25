<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, HasUuids, LogsActivity, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'personal_email',
        'personal_phone',
        'password',
        'role',
        'join_date',
        'employment_type',
        'company_id',
        'department_id',
        'site_id',
        'shift_id',
        'direct_manager_id',
        'status',
        'profile_photo',
        'employee_id',
        'position',
        'emergency_contact_name',
        'emergency_contact_phone',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'join_date' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
            'email_verified_at' => 'datetime',
            'last_login' => 'datetime',
            'status' => 'string',
            'password' => 'hashed',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['full_name', 'personal_email', 'role', 'status', 'employee_id', 'position', 'company_id', 'department_id', 'site_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the email address that should be used for password reset links.
     */
    public function getEmailForPasswordReset(): string
    {
        return $this->personal_email;
    }

    /**
     * Route notifications for the mail channel.
     */
    public function routeNotificationForMail($notification): string|array
    {
        return $this->personal_email;
    }

    public function getEmailForVerification(): string
    {
        return $this->personal_email;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function faceBiometric(): HasOne
    {
        return $this->hasOne(FaceBiometric::class, 'user_id');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }

    public function directManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'direct_manager_id');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(User::class, 'direct_manager_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'user_id');
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class, 'user_id');
    }

    public function overtimeRequests(): HasMany
    {
        return $this->hasMany(OvertimeRequest::class, 'user_id');
    }

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class, 'user_id');
    }

    public function appNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function workSchedules(): HasMany
    {
        return $this->hasMany(WorkSchedule::class, 'user_id');
    }

    public static function generateEmployeeId(?string $companyId = null): string
    {
        $prefix = 'SKW-'.date('Ymd').'-';
        $lastUser = self::where('employee_id', 'like', $prefix.'%')
            ->orderBy('employee_id', 'desc')
            ->first();

        if ($lastUser) {
            $lastId = $lastUser->employee_id;
            $sequence = (int) substr($lastId, (int) strrpos($lastId, '-') + 1);
            $newSequence = str_pad((string) ($sequence + 1), 4, '0', STR_PAD_LEFT);
        } else {
            $newSequence = '0001';
        }

        return $prefix.$newSequence;
    }
}
