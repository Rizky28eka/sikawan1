<?php

namespace Database\Factories;

use App\Models\Shift;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shift>
 */
class ShiftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Regular Shift',
            'start_time' => '08:00',
            'end_time' => '17:00',
            'late_tolerance' => 15,
            'status' => true,
        ];
    }
}
