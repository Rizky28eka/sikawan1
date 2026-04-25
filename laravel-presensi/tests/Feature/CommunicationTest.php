<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_communication_page_is_accessible_by_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/communication');

        $response->assertStatus(200);
    }

    public function test_owner_can_create_announcement(): void
    {
        $company = Company::factory()->create();
        $owner = User::factory()->create([
            'role' => 'OWNER',
            'company_id' => $company->id,
        ]);

        $response = $this
            ->actingAs($owner)
            ->post('/communication/announcements', [
                'title' => 'Test Announcement',
                'content' => 'Test Content',
                'type' => 'COMPANY',
                'target_type' => 'ALL',
                'is_published' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('announcements', [
            'title' => 'Test Announcement',
            'company_id' => $company->id,
        ]);
    }

    public function test_employee_cannot_create_announcement(): void
    {
        $user = User::factory()->create(['role' => 'EMPLOYEE']);

        $response = $this
            ->actingAs($user)
            ->post('/communication/announcements', [
                'title' => 'Hack Attempt',
                'content' => 'Should fail',
                'type' => 'COMPANY',
                'target_type' => 'ALL',
                'is_published' => true,
            ]);

        // Based on controller, it doesn't have a middleware check inside the method,
        // but typically routes are protected. Let's check routes/web.php
        $response->assertStatus(403);
    }
}
