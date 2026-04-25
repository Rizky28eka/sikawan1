<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'company_code' => strtoupper(fake()->unique()->lexify('??????')),
            'company_email' => fake()->unique()->companyEmail(),
            'company_phone' => fake()->unique()->phoneNumber(),
            'company_address' => fake()->address(),
            'status' => true,
        ];
    }
}
