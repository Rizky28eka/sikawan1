<?php

namespace Database\Factories;

use App\Models\Leave;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Leave>
 */
class LeaveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'start_date' => fake()->dateTime(),
            'end_date' => fake()->dateTime(),
            'reason' => fake()->sentence(),
            'status' => 'pending',
            'required_approver_role' => 'MANAGER',
        ];
    }
}
