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
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'radius' => 0,
                'status' => true,
                'is_wfh' => true,
            ]
        );

        Site::updateOrCreate(
            ['company_id' => $company->id, 'name' => 'Bilcode Head Office'],
            [
                'address' => 'Sudirman Central Business District (SCBD), Jakarta',
                'latitude' => -6.2234,
                'longitude' => 106.8112,
                'radius' => 50,
                'status' => true,
                'is_wfh' => false,
            ]
        );

        echo "✅ Site: WFH (Work From Home) seeded for {$company->company_name}.\n";
    }
}
