<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    /**
     * Handle single file upload for menu images.
     */
    public function menuFoto(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        $path = $request->file('file')->store('menus', 'public');

        return response()->json([
            'url' => asset('storage/'.$path)
        ]);
    }

        /**
     * Handle single file upload for article images.
     */
    public function artikelFoto(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096'
        ]);

        $path = $request->file('file')->store('articles', 'public');

        return response()->json([
            'url' => asset('storage/'.$path)
        ]);
    }

        /**
     * Handle contact form submission and send email to admin.
     */
    public function sendEmail(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'topic' => 'required|string|in:inquiry,reservation,feedback,complaint',
            'name' => 'required|string|max:50',
            'email' => 'required|email|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        // Map topic ke label Indonesia
        $topicLabels = [
            'inquiry' => 'Pertanyaan Umum',
            'feedback' => 'Masukan',
            'complaint' => 'Komplain'
        ];

        try {
            // Email admin (ganti dengan email admin yang sebenarnya)
            $adminEmail = env('ADMIN_EMAIL', 'rafiisaragih@apps.ipb.ac.id');

            // Kirim email
            Mail::send('feedback', [
                'nama' => $validated['name'],
                'email' => $validated['email'],
                'topik' => $topicLabels[$validated['topic']],
                'pesan' => $validated['description'] ?? 'Tidak ada deskripsi tambahan.',
                'tanggal' => now()->format('d F Y H:i'),
            ], function ($message) use ($validated, $topicLabels, $adminEmail) {
                $message->to($adminEmail)
                        ->subject('Pesan Kontak Baru: ' . $topicLabels[$validated['topic']])
                        ->replyTo($validated['email'], $validated['name']);
            });

            // Log untuk tracking
            Log::info('Contact form received', [
                'nama' => $validated['name'],
                'email' => $validated['email'],
                'topik' => $validated['topic'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pesan Anda telah terkirim. Terima kasih!'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to send contact email: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim pesan. Silakan coba lagi.'
            ], 500);
        }
    }

}
