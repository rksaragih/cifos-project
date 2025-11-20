<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $baseUrl;
    protected $session;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('whatsapp.base_url', 'http://localhost:3000');
        $this->session = config('whatsapp.session', 'default');
        $this->apiKey = config('whatsapp.api_key');
    }

    /**
     * Send WhatsApp text message
     * 
     * @param string $phone Phone number (e.g., 081234567890 or 6281234567890)
     * @param string $message Message content
     * @return bool
     */
    public function sendMessage($phone, $message)
    {
        try {
            $formattedPhone = $this->formatPhoneNumber($phone);
            
            $response = Http::timeout(10)
                ->withHeaders([
                    'X-Api-Key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/api/sendText", [
                    'session' => $this->session,
                    'chatId' => "{$formattedPhone}@c.us",
                    'text' => $message,
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp message sent successfully", [
                    'phone' => $formattedPhone,
                    'message_length' => strlen($message),
                ]);
                return true;
            } else {
                Log::error("Failed to send WhatsApp message", [
                    'phone' => $formattedPhone,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp service error", [
                'phone' => $phone,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return false;
        }
    }

    /**
     * Send WhatsApp image with caption
     * 
     * @param string $phone Phone number
     * @param string $imageUrl URL of the image
     * @param string $caption Caption text
     * @return bool
     */
    public function sendImage($phone, $imageUrl, $caption = '')
    {
        try {
            $formattedPhone = $this->formatPhoneNumber($phone);
            
            $response = Http::timeout(15)
                ->withHeaders([
                    'X-Api-Key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->baseUrl}/api/sendImage", [
                    'session' => $this->session,
                    'chatId' => "{$formattedPhone}@c.us",
                    'file' => [
                        'url' => $imageUrl,
                    ],
                    'caption' => $caption,
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp image sent successfully", ['phone' => $formattedPhone]);
                return true;
            }

            Log::error("Failed to send WhatsApp image", [
                'phone' => $formattedPhone,
                'response' => $response->body(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error("WhatsApp send image error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Format phone number to 628xxx format
     * 
     * @param string $phone
     * @return string
     */
    private function formatPhoneNumber($phone)
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Convert 08xxx to 628xxx
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }
        
        // Add 62 if doesn't start with 62
        if (substr($phone, 0, 2) !== '62') {
            $phone = '62' . $phone;
        }
        
        return $phone;
    }

    /**
     * Check if WhatsApp session is active
     * 
     * @return bool
     */
    public function isSessionActive()
    {
        try {
            $response = Http::timeout(5)
                ->withHeaders(['X-Api-Key' => $this->apiKey])
                ->get("{$this->baseUrl}/api/sessions/{$this->session}");
            
            if ($response->successful()) {
                $data = $response->json();
                return isset($data['status']) && $data['status'] === 'WORKING';
            }
            
            return false;
        } catch (\Exception $e) {
            Log::error("Failed to check WhatsApp session", [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Get session status and info
     * 
     * @return array|null
     */
    public function getSessionInfo()
    {
        try {
            $response = Http::timeout(5)
                ->withHeaders(['X-Api-Key' => $this->apiKey])
                ->get("{$this->baseUrl}/api/sessions/{$this->session}");
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error("Failed to get session info: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get QR code for session connection
     * 
     * @return string|null
     */
    public function getQRCode()
    {
        try {
            $sessionInfo = $this->getSessionInfo();
            return $sessionInfo['qr'] ?? null;
        } catch (\Exception $e) {
            Log::error("Failed to get QR code: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Start a new session
     * 
     * @return bool
     */
    public function startSession()
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders(['X-Api-Key' => $this->apiKey])
                ->post("{$this->baseUrl}/api/sessions", [
                    'name' => $this->session,
                ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Failed to start session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Stop session
     * 
     * @return bool
     */
    public function stopSession()
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders(['X-Api-Key' => $this->apiKey])
                ->delete("{$this->baseUrl}/api/sessions/{$this->session}");

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Failed to stop session: " . $e->getMessage());
            return false;
        }
    }
}