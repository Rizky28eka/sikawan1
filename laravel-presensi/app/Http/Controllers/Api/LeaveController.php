<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class LeaveController extends Controller
{
    /**
     * Get all leave types for the company.
     */
    public function getLeaveTypes()
    {
        $user = Auth::user();
        $types = LeaveType::where('company_id', $user->company_id)->get();

        return response()->json([
            'success' => true,
            'data' => $types,
        ]);
    }

    /**
     * Get user's current year leave balances.
     */
    public function getLeaveBalances()
    {
        $user = Auth::user();
        $balances = LeaveBalance::with('leaveType')
            ->where(['user_id' => $user->id])
            ->where(['year' => date('Y')])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $balances,
        ]);
    }

    /**
     * Submit a new leave request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string',
        ]);

        $user = Auth::user();

        $leave = DB::transaction(function () use ($request, $user) {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
            $totalDays = $request->input('total_days', $startDate->diffInDays($endDate) + 1);

            $leave = Leave::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'company_id' => $user->company_id,
                'leave_type_id' => $request->leave_type_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'total_days' => $totalDays,
                'reason' => $request->reason,
                'status' => 'pending',
                'requested_at' => now(),
                'is_half_day' => $request->input('is_half_day', false),
                'supporting_document_url' => $request->input('supporting_document_url'),
                'emergency_contact_during_leave' => $request->input('emergency_contact_during_leave'),
            ]);

            // Create Notification
            Notification::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'company_id' => $user->company_id,
                'title' => 'Pengajuan Cuti Terkirim',
                'message' => 'Pengajuan cuti anda dari '.$request->start_date.' sampai '.$request->end_date.' sedang menunggu persetujuan.',
                'type' => 'SYSTEM',
            ]);

            return $leave;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan cuti berhasil dikirim!',
            'data' => $leave,
        ]);
    }

    /**
     * Get user's leave history.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $leaves = QueryBuilder::for(Leave::class)
            ->where('user_id', $user->id)
            ->allowedFilters([
                AllowedFilter::exact('status'),
                AllowedFilter::exact('leave_type_id'),
                AllowedFilter::callback('start_date', function ($query, $value) {
                    $query->whereDate('start_date', '>=', $value);
                }),
                AllowedFilter::callback('end_date', function ($query, $value) {
                    $query->whereDate('end_date', '<=', $value);
                }),
            ])
            ->allowedSorts(['start_date', 'created_at', 'status'])
            ->allowedIncludes(['leaveType'])
            ->defaultSort('-created_at')
            ->paginate($request->get('limit', 10));

        return response()->json([
            'success' => true,
            'data' => $leaves->items(),
            'meta' => [
                'current_page' => $leaves->currentPage(),
                'last_page' => $leaves->lastPage(),
                'total' => $leaves->total(),
            ],
        ]);
    }
}
