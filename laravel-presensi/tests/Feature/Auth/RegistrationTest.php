<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'company_name' => 'Test Company',
            'company_email' => 'company@example.com',
            'company_phone' => '081234567890',
            'company_address' => 'Jl. Test No. 123',
            'full_name' => 'Test User',
            'personal_email' => 'test@example.com',
            'personal_phone' => '089876543210',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('owner.dashboard', absolute: false));
    }
}
