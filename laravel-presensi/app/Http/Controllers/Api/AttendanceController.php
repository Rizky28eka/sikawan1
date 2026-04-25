<?php

namespace App\Http\Controllers\Api;

use App\Data\AttendanceData;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceBiometric;
use App\Models\AttendanceLocation;
use App\Models\AttendanceNetwork;
use App\Models\FaceBiometric;
use App\Models\Site;
use App\Models\User;
use Carbon\Carbon;
use Geocoder\Laravel\Facades\Geocoder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\Holidays\Holidays;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class AttendanceController extends Controller
{
    /**
     * Handle attendance Check-In or Check-Out from Flutter app.
     */
    public function store(AttendanceData $data)
    {
        return $this->processAttendance($data, 'Mobile App');
    }

    /**
     * Face Recognition Attendance - Clock In or Clock Out
     * Endpoint untuk Flutter app dengan face recognition + GPS validation
     */
    public function faceAttendance(AttendanceData $data)
    {
        return $this->processAttendance($data, 'Face Recognition');
    }

    /**
     * Unified logic for recording attendance (Aligned with Registration Flow)
     */
    private function processAttendance(AttendanceData $data, string $sourceLabel)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Sesi habis. Silakan login ulang.'], 401);
        }

        Log::info("=== ATTENDANCE REQUEST: {$sourceLabel} ===", [
            'user_id' => $user->id,
            'type' => $data->type,
        ]);

        // 1. Get User's Face Embedding
        $biometric = FaceBiometric::where('user_id', $user->id)->first();
        if (! $biometric) {
            return response()->json([
                'success' => false,
                'message' => 'Data biometrik tidak ditemukan. Silakan registrasi wajah di menu Profil.',
            ], 404);
        }

        // 2. Verify GPS against Site Geofence
        $site = Site::find($user->site_id);
        if (! $site) {
            return response()->json(['success' => false, 'message' => 'Site tidak ditemukan.'], 400);
        }

        $isInGeofence = false;
        $distance = 0;
        $userLocation = new Point($data->latitude, $data->longitude);

        if ($site->shape_type === 'polygon' && $site->boundary) {
            $isInGeofence = $site->boundary->contains($userLocation);
        } else {
            $distance = DB::selectOne('SELECT ST_Distance(ST_SetSRID(ST_Point(?, ?), 4326)::geography, location::geography) as distance FROM sites WHERE id = ?', [$data->longitude, $data->latitude, $site->id])->distance;
            $isInGeofence = $distance <= $site->radius;
        }

        if (! $site->is_wfh && ! $isInGeofence) {
            // ... (keep bearing calculation for detailed error)
            return response()->json([
                'success' => false,
                'message' => "Anda berada di luar area lokasi kerja ({$site->name}).",
                'distance' => round($distance, 2),
            ], 403);
        }

        // 3. Verify Face against AI Service (Snapshot Flow)
        $aiServiceUrl = config('services.ai.url', 'http://localhost:8088');
        try {
            $imageSnapshot = null;
            if ($data->images_base64 && is_array($data->images_base64)) {
                $imageSnapshot = $data->images_base64[0]; // Take first frame
            } else {
                $imageSnapshot = $data->image_base64;
            }

            if (! $imageSnapshot) {
                return response()->json(['success' => false, 'message' => 'Gambar wajah tidak ditemukan.'], 400);
            }

            $response = Http::timeout(20)->post("{$aiServiceUrl}/api/v1/faces/verify-inference", [
                'image_base64' => $imageSnapshot,
                'reference_embedding' => $biometric->face_embedding,
            ]);

            if ($response->failed()) {
                Log::error('AI Service Error during attendance', ['status' => $response->status(), 'error' => $response->body()]);

                return response()->json(['success' => false, 'message' => 'Gagal verifikasi wajah. Sistem sibuk.'], 502);
            }

            $aiResult = $response->json();
            if (! $aiResult['recognized']) {
                return response()->json([
                    'success' => false,
                    'message' => $aiResult['suggestion'] ?? $aiResult['quality_feedback'] ?? 'Wajah tidak dikenali.',
                    'confidence' => $this->sanitizeNumericalData($aiResult['confidence'] ?? 0),
                ], 422);
            }

            $confidence = $this->sanitizeNumericalData($aiResult['confidence'] ?? 0);

        } catch (\Exception $e) {
            Log::error('AI Communication failure in attendance', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'Terjadi gangguan sistem verifikasi.'], 500);
        }

        // 4. Record Attendance
        $status = 'PRESENT';
        $isLate = false;
        if ($data->type === 'CLOCK_IN' && ($shift = $user->shift)) {
            $workingStart = Carbon::parse($shift->start_time);
            if (now()->gt($workingStart->addMinutes($shift->late_tolerance))) {
                $isLate = true;
                $status = 'LATE';
            }
        }

        $isHoliday = Holidays::for('id')->isHoliday(now());
        $attendance = Attendance::create([
            'user_id' => $user->id,
            'company_id' => $user->company_id,
            'site_id' => $user->site_id,
            'timestamp' => now(),
            'type' => $data->type,
            'status' => $status,
            'is_late' => $isLate,
            'confidence' => $confidence,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'notes' => "Attendance via {$sourceLabel}",
            'attendance_category' => $isHoliday ? 'holiday' : 'regular',
        ]);

        // 5. Save Telemetry (with NaN Protection)
        $this->saveTelemetryData($attendance, $data, $aiResult);
        $this->saveEvidenceImage($data, $user);

        return response()->json([
            'success' => true,
            'message' => 'Presensi berhasil dicatat!',
            'data' => [
                'attendance_id' => $attendance->id,
                'type' => $attendance->type,
                'status' => $attendance->status,
                'time' => $attendance->timestamp->format('H:i'),
                'confidence' => round($confidence, 2),
            ],
        ]);
    }

    /**
     * Protection against NaN/Inf values for DB safety
     */
    private function sanitizeNumericalData($value)
    {
        if (! is_numeric($value) || is_nan($value) || is_infinite($value)) {
            return 0.0;
        }

        return (float) $value;
    }

    /**
     * Get attendance history for user
     */
    public function history(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 401);
        }

        $attendances = QueryBuilder::for(Attendance::class)
            ->where('user_id', $user->id)
            ->allowedFilters([
                AllowedFilter::exact('status'),
                AllowedFilter::exact('type'),
                AllowedFilter::callback('start_date', function ($query, $value) {
                    $query->whereDate('timestamp', '>=', $value);
                }),
                AllowedFilter::callback('end_date', function ($query, $value) {
                    $query->whereDate('timestamp', '<=', $value);
                }),
            ])
            ->defaultSort('-timestamp')
            ->paginate($request->get('limit', 30));

        return response()->json(['success' => true, 'data' => $attendances->items(), 'meta' => ['total' => $attendances->total()]]);
    }

    /**
     * Helper to save comprehensive telemetry data (Robust V4 Logic)
     */
    private function saveTelemetryData($attendance, AttendanceData $data, $aiResult)
    {
        try {
            $conf = $this->sanitizeNumericalData($aiResult['confidence'] ?? 0);
            $dist = $this->sanitizeNumericalData($aiResult['distance'] ?? 0);
            $lighting = $this->sanitizeNumericalData($aiResult['quality_metrics']['lighting'] ?? 0);

            AttendanceBiometric::create([
                'attendance_id' => $attendance->id,
                'similarity_score' => $conf,
                'distance_score' => $dist,
                'match_result' => ($aiResult['recognized'] ?? false) ? 'matched' : 'not_matched',
                'threshold_used' => $this->sanitizeNumericalData($aiResult['confidence_threshold'] ?? 0.8),
                'model_version' => 'V4-Snapshot-Alignment',
                'liveness_score' => $this->sanitizeNumericalData($aiResult['liveness_score'] ?? 1.0),
                'lighting_score' => $lighting,
                'spoof_flag' => $aiResult['spoof_flag'] ?? 'real',
                'detected_face_count' => $aiResult['face_count'] ?? 1,
            ]);

            // Location Telemetry
            $address = null;
            try {
                $geoResults = Geocoder::reverse($data->latitude, $data->longitude)->get();
                if ($geoResults->isNotEmpty()) {
                    $address = $geoResults->first()->getFormattedAddress();
                }
            } catch (\Exception $e) {
            }

            AttendanceLocation::create([
                'attendance_id' => $attendance->id,
                'latitude' => $data->latitude,
                'longitude' => $data->longitude,
                'location' => new Point($data->latitude, $data->longitude),
                'accuracy' => $this->sanitizeNumericalData($data->telemetry_location['accuracy'] ?? 0),
                'altitude' => $this->sanitizeNumericalData($data->telemetry_location['altitude'] ?? 0),
                'speed' => $this->sanitizeNumericalData($data->telemetry_location['speed'] ?? 0),
                'bearing' => $this->sanitizeNumericalData($data->telemetry_location['heading'] ?? 0),
                'source' => $data->telemetry_location['source'] ?? 'GPS',
                'is_mock_location' => (bool) ($data->telemetry_location['is_mock'] ?? false),
                'address_captured' => $address,
                'distance_from_office' => $this->sanitizeNumericalData(DB::selectOne('SELECT ST_Distance(ST_SetSRID(ST_Point(?, ?), 4326)::geography, location::geography) as distance FROM sites WHERE id = ?', [$data->longitude, $data->latitude, $attendance->site_id])->distance),
                'location_age' => now()->diffInSeconds(Carbon::parse($data->telemetry_location['timestamp_device'] ?? now())),
            ]);

            // Network Telemetry
            AttendanceNetwork::create([
                'attendance_id' => $attendance->id,
                'ip_address' => request()->ip(),
                'ip_address_public' => request()->ip(),
                'network_type' => $data->telemetry_network['type'] ?? 'UNKNOWN',
                'cellular_network_type' => $data->telemetry_network['effective_type'] ?? null,
                'connection_speed_mbps' => $this->sanitizeNumericalData($data->telemetry_network['downlink'] ?? 0),
                'latency_ms' => (int) ($data->telemetry_network['rtt'] ?? 0),
                'vpn_detected' => (bool) ($data->telemetry_network['vpn_detected'] ?? false),
                'isp' => geoip()->getLocation(request()->ip())->organization,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to save telemetry data: '.$e->getMessage());
        }
    }

    /**
     * Helper untuk menyimpan gambar sebagai arsip presensi
     */
    private function saveEvidenceImage(AttendanceData $data, $user)
    {
        try {
            $folderName = preg_replace('/[^\w\-]/', '', $user->employee_id).'_'.now()->format('Ymd');
            $subFolder = ($data->type === 'CLOCK_IN' ? 'check-in/' : 'checkout/').$folderName;

            $base64String = $data->image_base64 ?? ($data->images_base64[0] ?? null);
            if (! $base64String) {
                return;
            }

            $imageData = explode(',', $base64String);
            $base64 = count($imageData) > 1 ? $imageData[1] : $imageData[0];

            $fileName = 'evidence_'.time().'.jpg';
            Storage::disk('public')->put($subFolder.'/'.$fileName, base64_decode($base64));

        } catch (\Exception $e) {
            Log::error('Failed to save evidence image: '.$e->getMessage());
        }
    }
}
