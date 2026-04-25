<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Department;
use App\Models\Notification;
use App\Traits\Loggable;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommunicationController extends Controller
{
    use Loggable;

    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        $tab = $request->input('tab', 'announcements');

        $data = [];
        $departments = [];

        if ($tab === 'announcements') {
            $query = Announcement::with('creator');

            // RBAC Scoping
            if ($role === 'SUPERADMIN') {
            } elseif ($role === 'OWNER') {
                $query->where(function ($q) use ($user) {
                    $q->where('type', 'SYSTEM')
                        ->orWhere('company_id', $user->company_id);
                });
            } elseif ($role === 'MANAGER') {
                $query->where(function ($q) use ($user) {
                    $q->where('type', 'SYSTEM')
                        ->orWhere(function ($sq) use ($user) {
                            $sq->where('company_id', $user->company_id)
                                ->where(function ($tsq) use ($user) {
                                    $tsq->where('target_type', 'ALL')
                                        ->orWhere('target_type', 'COMPANY')
                                        ->orWhere(function ($dsq) use ($user) {
                                            $dsq->where('target_type', 'DEPARTMENT')
                                                ->where('department_id', $user->department_id);
                                        });
                                });
                        });
                });
            } elseif ($role === 'EMPLOYEE') {
                $query->where('is_published', true)
                    ->where('published_at', '<=', Carbon::now())
                    ->where(function ($q) use ($user) {
                        $q->where('type', 'SYSTEM')
                            ->orWhere(function ($sq) use ($user) {
                                $sq->where('company_id', $user->company_id)
                                    ->where(function ($tsq) use ($user) {
                                        $tsq->where('target_type', 'ALL')
                                            ->orWhere('target_type', 'COMPANY')
                                            ->orWhere(function ($dsq) use ($user) {
                                                $dsq->where('target_type', 'DEPARTMENT')
                                                    ->where('department_id', $user->department_id);
                                            })
                                            ->orWhere(function ($usq) use ($user) {
                                                $usq->where('target_type', 'USER')
                                                    ->where('target_id', $user->id);
                                            });
                                    });
                            });
                    });
            }

            if ($request->search) {
                $query->where('title', 'like', "%{$request->search}%");
            }

            $data = $query->latest('published_at')->paginate(10)->withQueryString();

            if (in_array($role, ['OWNER', 'MANAGER', 'SUPERADMIN'])) {
                $deptsQuery = Department::query();
                if ($role !== 'SUPERADMIN') {
                    $deptsQuery->where('company_id', $user->company_id);
                }
                $departments = $deptsQuery->get(['id', 'name']);
            }
        } elseif ($tab === 'notifications') {
            $query = Notification::where('user_id', $user->id);

            if ($request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', "%{$request->search}%")
                        ->orWhere('message', 'like', "%{$request->search}%");
                });
            }

            $data = $query->latest()->paginate(15)->withQueryString();
        }

        return Inertia::render('Communication/Index', [
            'data' => $data,
            'tab' => $tab,
            'filters' => $request->only(['search', 'tab']),
            'departments' => $departments,
            'role' => $role,
        ]);
    }

    public function storeAnnouncement(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'EMPLOYEE') {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:SYSTEM,COMPANY',
            'target_type' => 'required|string|in:ALL,COMPANY,DEPARTMENT,TEAM,USER',
            'target_id' => 'nullable|uuid',
            'department_id' => 'nullable|uuid',
            'published_at' => 'nullable|date',
            'is_published' => 'required|boolean',
        ]);

        if ($request->type === 'SYSTEM' && $user->role !== 'SUPERADMIN') {
            abort(403);
        }

        $announcement = Announcement::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'type' => $request->input('type'),
            'target_type' => $request->input('target_type'),
            'target_id' => $request->input('target_id'),
            'company_id' => $request->input('type') === 'SYSTEM' ? null : $user->company_id,
            'department_id' => $request->input('department_id'),
            'created_by' => $user->id,
            'published_at' => $request->input('published_at') ?? Carbon::now(),
            'is_published' => $request->is_published,
        ]);

        $this->logActivity('CREATE', "User created announcement: {$request->title}", 'Announcement', $announcement->id);

        return back()->with('success', 'Pengumuman berhasil dipublikasikan.');
    }

    public function updateAnnouncement(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role === 'EMPLOYEE') {
            abort(403);
        }
        $announcement = Announcement::findOrFail($id);

        if ($user->role !== 'SUPERADMIN' && $announcement->created_by !== $user->id) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_published' => 'required|boolean',
        ]);

        $announcement->update($request->only(['title', 'content', 'published_at', 'is_published']));

        $this->logActivity('UPDATE', "User updated announcement: {$announcement->title}", 'Announcement', $id);

        return back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroyAnnouncement($id)
    {
        $user = Auth::user();
        if ($user->role === 'EMPLOYEE') {
            abort(403);
        }
        $announcement = Announcement::findOrFail($id);

        if ($user->role !== 'SUPERADMIN' && $announcement->created_by !== $user->id) {
            abort(403);
        }

        $announcement->delete();

        $this->logActivity('DELETE', "User deleted announcement: {$announcement->title}", 'Announcement', $id);

        return back()->with('success', 'Pengumuman berhasil dihapus.');
    }

    public function markNotificationRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())->findOrFail($id);
        $notification->update(['read_at' => Carbon::now()]);

        return back();
    }

    public function markAllNotificationsRead()
    {
        Notification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);

        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    public function destroyNotification($id)
    {
        $notification = Notification::where('user_id', Auth::id())->findOrFail($id);
        $notification->delete();

        return back()->with('success', 'Notifikasi berhasil dihapus.');
    }
}
