<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $employeeCounter = 1;

        return [
            'full_name' => fake()->name(),
            'personal_email' => fake()->unique()->safeEmail(),
            'personal_phone' => fake()->unique()->phoneNumber(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'EMPLOYEE',
            'company_id' => null, // Usually set in seeder
            'employee_id' => 'EMP-'.str_pad($employeeCounter++, 4, '0', STR_PAD_LEFT),
            'department_id' => null,
            'site_id' => null,
            'shift_id' => null,
            'direct_manager_id' => null,
            'status' => true,
            'position' => fake()->jobTitle(),
            'employment_type' => fake()->randomElement(['Permanent', 'Contract', 'Internship', 'Probation']),
            'join_date' => fake()->date(),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
