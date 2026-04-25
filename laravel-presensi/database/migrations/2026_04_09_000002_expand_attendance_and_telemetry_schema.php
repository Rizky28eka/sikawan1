<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Expand Attendances Table
        Schema::table('attendances', function (Blueprint $table) {
            $table->timestamp('timestamp_device')->nullable()->after('timestamp');
            $table->uuid('work_schedule_id')->nullable();
            $table->uuid('office_location_id')->nullable();
            $table->integer('actual_duration')->default(0); // in minutes
            $table->integer('overtime_duration')->default(0);
            $table->integer('late_duration')->default(0);
            $table->integer('early_leave_duration')->default(0);
            $table->boolean('is_manual_entry')->default(false);
            $table->text('manual_entry_reason')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('attendance_category')->default('regular'); // regular / overtime / weekend / holiday
            $table->string('work_mode')->default('onsite'); // onsite / remote / hybrid

            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Expand Devices Table
        Schema::table('devices', function (Blueprint $table) {
            $table->string('device_fingerprint')->nullable()->unique()->after('id');
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('os_version')->nullable();
            $table->string('app_version')->nullable();
            $table->string('screen_resolution')->nullable();
            $table->integer('battery_level')->nullable();
            $table->bigInteger('storage_available')->nullable();
            $table->bigInteger('ram_available')->nullable();
            $table->boolean('is_rooted_jailbroken')->default(false);
            $table->string('installer_package')->nullable();
            $table->string('device_language')->nullable();
            $table->string('timezone_device')->nullable();
            $table->timestamp('last_app_update')->nullable();
            $table->string('sdk_version')->nullable();
            $table->string('security_patch_level')->nullable();
            $table->string('device_status')->default('active'); // active / blocked / suspicious
            $table->boolean('multiple_account_flag')->default(false);
        });

        // 3. Create Attendance Locations Table
        Schema::create('attendance_locations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attendance_id');
            $table->double('latitude');
            $table->double('longitude');
            $table->float('accuracy')->nullable();
            $table->float('altitude')->nullable();
            $table->string('source')->nullable(); // GPS / Network / Fused
            $table->string('status_geofence')->nullable(); // inside / outside / boundary
            $table->uuid('geofence_id')->nullable();
            $table->float('distance_from_office')->nullable();
            $table->text('address_captured')->nullable();
            $table->float('speed')->nullable();
            $table->float('bearing')->nullable();
            $table->string('location_provider')->nullable();
            $table->integer('satellites_count')->nullable();
            $table->integer('location_age')->nullable();
            $table->boolean('is_mock_location')->default(false);
            $table->json('wifi_bssid_list')->nullable();
            $table->json('cell_tower_info')->nullable();
            $table->timestamps();

            $table->foreign('attendance_id')->references('id')->on('attendances')->onDelete('cascade');
        });

        // 4. Create Attendance Biometrics Table (Face & Liveness)
        Schema::create('attendance_biometrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attendance_id');
            $table->json('face_embedding')->nullable();
            $table->string('model_version')->nullable();
            $table->float('similarity_score')->nullable();
            $table->float('distance_score')->nullable();
            $table->float('threshold_used')->nullable();
            $table->string('match_result')->nullable(); // matched / not_matched / uncertain

            // Quality & Metadata
            $table->float('face_quality_score')->nullable();
            $table->string('face_angle')->nullable();
            $table->float('lighting_score')->nullable();
            $table->json('face_bbox')->nullable();
            $table->integer('detected_face_count')->default(1);
            $table->string('face_size')->nullable();
            $table->float('eye_aspect_ratio')->nullable();
            $table->boolean('mask_detected')->default(false);
            $table->boolean('glasses_detected')->default(false);
            $table->float('occlusion_score')->nullable();

            // Liveness Data
            $table->float('liveness_score')->nullable();
            $table->string('blink_detection')->nullable();
            $table->float('motion_score')->nullable();
            $table->string('spoof_flag')->nullable(); // real / spoof / uncertain
            $table->string('challenge_type')->nullable();
            $table->integer('challenge_response_time_ms')->nullable();
            $table->float('depth_map_score')->nullable();
            $table->integer('frame_count_analyzed')->nullable();
            $table->string('attack_type')->nullable(); // print / replay / mask / none

            $table->timestamps();

            $table->foreign('attendance_id')->references('id')->on('attendances')->onDelete('cascade');
        });

        // 5. Create Attendance Networks Table
        Schema::create('attendance_networks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attendance_id');
            $table->string('ip_address')->nullable();
            $table->string('ip_address_public')->nullable();
            $table->string('network_type')->nullable(); // WiFi / Cellular / Ethernet
            $table->boolean('vpn_detected')->default(false);
            $table->boolean('proxy_detected')->default(false);
            $table->string('wifi_ssid')->nullable();
            $table->string('wifi_bssid')->nullable();
            $table->integer('signal_strength')->nullable();
            $table->string('cellular_carrier')->nullable();
            $table->string('cellular_network_type')->nullable();
            $table->float('connection_speed_mbps')->nullable();
            $table->integer('latency_ms')->nullable();
            $table->boolean('tor_detected')->default(false);
            $table->boolean('datacenter_ip')->default(false);
            $table->float('ip_reputation_score')->nullable();
            $table->string('ip_country')->nullable();
            $table->string('ip_city')->nullable();
            $table->json('ip_geolocation')->nullable();
            $table->boolean('suspicious_network')->default(false);
            $table->timestamps();

            $table->foreign('attendance_id')->references('id')->on('attendances')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_networks');
        Schema::dropIfExists('attendance_biometrics');
        Schema::dropIfExists('attendance_locations');

        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn([
                'device_fingerprint', 'brand', 'model', 'os_version', 'app_version',
                'screen_resolution', 'battery_level', 'storage_available', 'ram_available',
                'is_rooted_jailbroken', 'installer_package', 'device_language',
                'timezone_device', 'last_app_update', 'sdk_version', 'security_patch_level',
                'device_status', 'multiple_account_flag',
            ]);
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'timestamp_device', 'work_schedule_id', 'office_location_id',
                'actual_duration', 'overtime_duration', 'late_duration',
                'early_leave_duration', 'is_manual_entry', 'manual_entry_reason',
                'approved_by', 'approved_at', 'rejection_reason',
                'attendance_category', 'work_mode',
            ]);
        });
    }
};
