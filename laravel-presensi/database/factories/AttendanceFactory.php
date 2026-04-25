<?php

namespace Database\Factories;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'timestamp' => now(),
            'type' => 'CLOCK_IN',
            'status' => 'PRESENT',
            'is_late' => false,
            'confidence' => 0.95,
        ];
    }
}
