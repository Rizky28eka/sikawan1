<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enable PostGIS extension only for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        }

        Schema::table('sites', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->geometry('location', 'point')->nullable();
                $table->geometry('boundary', 'polygon')->nullable();
                $table->index('location', 'sites_location_spatial_index', 'gist');
            } else {
                // Fallback for other drivers (like sqlite in tests)
                $table->text('location')->nullable();
                $table->text('boundary')->nullable();
            }
        });

        Schema::table('attendance_locations', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->geometry('location', 'point')->nullable();
                $table->index('location', 'attendance_locations_location_spatial_index', 'gist');
            } else {
                $table->text('location')->nullable();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            // Migrate existing data for sites
            DB::statement('UPDATE sites SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326) WHERE latitude IS NOT NULL AND longitude IS NOT NULL');

            // Migrate existing data for attendance_locations
            DB::statement('UPDATE attendance_locations SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326) WHERE latitude IS NOT NULL AND longitude IS NOT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendance_locations', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->dropIndex('attendance_locations_location_spatial_index');
            }
            $table->dropColumn('location');
        });

        Schema::table('sites', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->dropIndex('sites_location_spatial_index');
            }
            $table->dropColumn(['location', 'boundary']);
        });
    }
};
