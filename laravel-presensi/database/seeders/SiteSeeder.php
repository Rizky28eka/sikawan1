<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Site;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $company = Company::where('company_code', 'BILCODE-ID')->first();

        if (! $company) {
            echo "⚠️ Company BILCODE-ID not found. Run DatabaseSeeder first.\n";

            return;
        }

        Site::updateOrCreate(
            ['company_id' => $company->id, 'name' => 'WFH (Work From Home)'],
            [
                'address' => 'Remote / Anywhere',
                'latitude' => -6.2088, // Jakarta Pusat as center
                'longitude' => 106.8456,
                'radius' => 0, // Radius 0 for WFH is fine since logic skips it
                'status' => true,
                'is_wfh' => true,
            ]
        );

        echo "✅ Site: WFH (Work From Home) seeded for {$company->company_name}.\n";
    }
}
