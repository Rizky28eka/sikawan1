<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Loggable
{
    public function logActivity(string $action, string $description, ?string $entity = null, ?string $entityId = null, ?string $details = null): ?ActivityLog
    {
        $user = Auth::user();
        if (! $user) {
            return null;
        }

        return ActivityLog::create([
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'action' => $action,
            'entity' => $entity,
            'entity_id' => $entityId,
            'description' => $description,
            'details' => $details,
            'ip_address' => Request::ip() ?? 'unknown',
            'user_agent' => Request::userAgent() ?? 'unknown',
        ]);
    }
}
