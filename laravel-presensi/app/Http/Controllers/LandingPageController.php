<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LandingPageController extends Controller
{
    /**
     * Handle contact form submission
     */
    public function submitContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        try {
            // Log the contact submission (you can later add email notification)
            Log::info('New contact form submission', [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
            ]);

            // TODO: Send email notification to admin
            // Mail::to('admin@sikawanpresensi.com')->send(new ContactFormMail($validated));

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dikirim. Terima kasih!',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Contact form error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Handle newsletter subscription
     */
    public function subscribeNewsletter(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        try {
            // Check if email already exists (implement with your newsletter model)
            // $exists = Newsletter::where('email', $validated['email'])->exists();

            // if ($exists) {
            //     return response()->json([
            //         'success' => false,
            //         'message' => 'Email sudah terdaftar.',
            //     ], 400);
            // }

            // Save to database (create Newsletter model first)
            // Newsletter::create(['email' => $validated['email']]);

            // Log the subscription
            Log::info('New newsletter subscription', [
                'email' => $validated['email'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Berhasil berlangganan newsletter!',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan. Silakan coba lagi.',
            ], 500);
        }
    }
}
