<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationMenu;
use App\Models\Menu;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    protected $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    // ==================== CUSTOMER ENDPOINTS (PUBLIC) ====================

    /**
     * Process reservation
     * POST /api/reservations/process
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'nomor_wa' => 'required|string|max:20',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam' => 'required|date_format:H:i',
            'kategori_jumlah' => 'required|in:<10,>10',
            'jumlah_orang' => 'required|integer|min:1',
            'catatan' => 'nullable|string',
            'menus' => 'array',
            'menus.*.menu_id' => 'required|exists:menus,id',
            'menus.*.jumlah' => 'required|integer|min:1',
        ]);

        // Validasi: jika >10, harus ada menu
        if ($validated['kategori_jumlah'] === '>10' && empty($validated['menus'])) {
            return response()->json([
                'message' => 'Untuk reservasi lebih dari 10 orang, wajib memilih menu.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Create Reservation
            $reservation = Reservation::create([
                'nama_pelanggan' => $validated['nama_pelanggan'],
                'nomor_wa' => $validated['nomor_wa'],
                'tanggal' => $validated['tanggal'],
                'jam' => $validated['jam'],
                'kategori_jumlah' => $validated['kategori_jumlah'],
                'jumlah_orang' => $validated['jumlah_orang'],
                'catatan' => $validated['catatan'] ?? null,
                'total_dp' => 50000,
                'status_dp' => 'pending',
                'status_reservasi' => 'pending',
            ]);

            // Create Reservation Menus (if any)
            if (!empty($validated['menus'])) {
                foreach ($validated['menus'] as $menuItem) {
                    $menu = Menu::find($menuItem['menu_id']);
                    $subtotal = $menu->harga_menu * $menuItem['jumlah'];

                    ReservationMenu::create([
                        'kode_reservasi' => $reservation->kode_reservasi,
                        'menu_id' => $menuItem['menu_id'],
                        'jumlah' => $menuItem['jumlah'],
                        'subtotal' => $subtotal,
                    ]);
                }
            }

            // Load menus relation for message generation
            $reservation->load('reservationMenus.menu');

            // Generate WhatsApp messages
            $customerMessage = $this->generateCustomerMessage($reservation);
            $adminMessage = $this->generateAdminNotification($reservation);

            // Send notification to Admin
            try {
                $adminPhone = config('whatsapp.admin_phone');
                $this->whatsappService->sendMessage($adminPhone, $adminMessage);

                // Send confirmation to Customer
                try {
                    $this->whatsappService->sendMessage($reservation->nomor_wa, $customerMessage);
                    Log::info('Customer confirmation sent', ['kode' => $reservation->kode_reservasi]);
                } catch (\Exception $e) {
                    Log::error('Failed to send customer confirmation', [
                        'kode' => $reservation->kode_reservasi,
                        'error' => $e->getMessage(),
                    ]);
                }

                Log::info('Admin notification sent', ['kode' => $reservation->kode_reservasi]);
            } catch (\Exception $e) {
                // Log error but don't fail the reservation
                Log::error('Failed to send admin notification', [
                    'kode' => $reservation->kode_reservasi,
                    'error' => $e->getMessage(),
                ]);
            }

            // Generate WhatsApp URL for customer to chat with admin
            $waUrl = $this->generateWhatsAppUrl($adminPhone, $customerMessage);

            DB::commit();

            return response()->json([
                'message' => 'Reservasi berhasil dibuat',
                'data' => [
                    'kode_reservasi' => $reservation->kode_reservasi,
                    'whatsapp_url' => $waUrl,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Reservation process error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses reservasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reservation success details
     * GET /api/reservations/success/{kode_reservasi}
     */
    public function success($kode_reservasi)
    {
        $reservation = Reservation::with(['reservationMenus.menu'])
            ->where('kode_reservasi', $kode_reservasi)
            ->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Data reservasi berhasil diambil',
            'data' => $reservation,
        ]);
    }

    /**
     * Cancel reservation (Customer)
     * POST /api/reservations/{kode_reservasi}/cancel
     */
    public function cancel($kode_reservasi)
    {
        $reservation = Reservation::where('kode_reservasi', $kode_reservasi)->first();
        
        if (!$reservation) {
            return response()->json(['message' => 'Reservasi tidak ditemukan'], 404);
        }
        
        // Check if can cancel (not today or past)
        $reservationDate = \Carbon\Carbon::parse($reservation->tanggal);
        if ($reservationDate->isToday() || $reservationDate->isPast()) {
            return response()->json([
                'message' => 'Tidak dapat membatalkan reservasi di hari yang sama atau tanggal yang sudah lewat'
            ], 422);
        }
        
        // Update reservation status
        $reservation->update([
            'status_reservasi' => 'cancelled',
            'status_dp' => 'cancelled',
        ]);
        
        return response()->json([
            'message' => 'Reservasi berhasil dibatalkan. Silakan hubungi admin via WhatsApp untuk refund DP.'
        ]);
    }

    /**
     * Generate WhatsApp message for customer
     */
    private function generateCustomerMessage($reservation)
    {
        $message = "🍽️ *KONFIRMASI RESERVASI*\n\n";
        $message .= "Halo *{$reservation->nama_pelanggan}*,\n\n";
        $message .= "Terima kasih telah melakukan reservasi di *Ciawi Food Station*!\n\n";
        $message .= "📋 *Detail Reservasi*\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "Kode: *{$reservation->kode_reservasi}*\n";
        $message .= "Tanggal: " . \Carbon\Carbon::parse($reservation->tanggal)->format('d F Y') . "\n";
        $message .= "Jam: {$reservation->jam}\n";
        $message .= "Jumlah Orang: {$reservation->jumlah_orang} orang\n";
        
        if ($reservation->catatan) {
            $message .= "Catatan: {$reservation->catatan}\n";
        }
        
        // Add menu if any
        if ($reservation->reservationMenus && $reservation->reservationMenus->count() > 0) {
            $message .= "\n🍴 *Menu yang Dipesan:*\n";
            foreach ($reservation->reservationMenus as $item) {
                $message .= "• {$item->menu->nama_menu} x{$item->jumlah}\n";
            }
        }
        
        $message .= "\n💰 *DP Reservasi: Rp 50.000*\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n\n";
        $message .= "📌 *Langkah Selanjutnya:*\n";
        $message .= "1. Konfirmasi reservasi Anda\n";
        $message .= "2. Lakukan pembayaran DP\n";
        $message .= "3. Kirim bukti transfer ke nomor ini\n\n";
        $message .= "📍 *Info Transfer:*\n";
        $message .= "BCA: 1234567890\n";
        $message .= "a/n Ciawi Food Station\n\n";
        $message .= "Terima kasih! 🙏";
        
        return $message;
    }

    /**
     * Generate admin notification message
     */
    private function generateAdminNotification($reservation)
    {
        $message = "🔔 *RESERVASI BARU!*\n\n";
        $message .= "📋 *Detail Reservasi*\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "Kode: *{$reservation->kode_reservasi}*\n";
        $message .= "Nama: {$reservation->nama_pelanggan}\n";
        $message .= "No. WA: {$reservation->nomor_wa}\n";
        $message .= "Tanggal: " . \Carbon\Carbon::parse($reservation->tanggal)->format('d F Y') . "\n";
        $message .= "Jam: {$reservation->jam}\n";
        $message .= "Jumlah Orang: {$reservation->jumlah_orang} orang\n";
        
        if ($reservation->catatan) {
            $message .= "Catatan: {$reservation->catatan}\n";
        }
        
        // Add menu if any
        if ($reservation->reservationMenus && $reservation->reservationMenus->count() > 0) {
            $message .= "\n🍴 *Menu:*\n";
            $totalMenu = 0;
            foreach ($reservation->reservationMenus as $item) {
                $message .= "• {$item->menu->nama_menu} x{$item->jumlah} = Rp " . number_format($item->subtotal, 0, ',', '.') . "\n";
                $totalMenu += $item->subtotal;
            }
            $message .= "\nTotal Menu: Rp " . number_format($totalMenu, 0, ',', '.') . "\n";
        }
        
        $message .= "\n💰 DP: Rp 50.000\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n\n";
        $message .= "⚠️ Segera konfirmasi reservasi ini!";
        
        return $message;
    }

    /**
     * Generate WhatsApp URL
     */
    private function generateWhatsAppUrl($phoneNumber, $message)
    {
        // Clean phone number
        $phone = preg_replace('/[^0-9]/', '', $phoneNumber);
        
        // Add country code if not exists
        if (substr($phone, 0, 2) !== '62') {
            if (substr($phone, 0, 1) === '0') {
                $phone = '62' . substr($phone, 1);
            } else {
                $phone = '62' . $phone;
            }
        }
        
        // Encode message
        $encodedMessage = urlencode($message);
        
        // Return WhatsApp URL
        return "https://wa.me/{$phone}?text={$encodedMessage}";
    }

    // ==================== ADMIN ENDPOINTS (PROTECTED) ====================

    /**
     * Get all reservations (Admin)
     * GET /api/admin/reservations
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['reservationMenus.menu']);

        // Filter by status
        if ($request->has('status_reservasi')) {
            $query->where('status_reservasi', $request->status_reservasi);
        }

        // Filter by status DP
        if ($request->has('status_dp')) {
            $query->where('status_dp', $request->status_dp);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        // Search by name or reservation code
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kode_reservasi', 'like', "%{$search}%")
                  ->orWhere('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('nomor_wa', 'like', "%{$search}%");
            });
        }

        $reservations = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($reservations);
    }

    /**
     * Get single reservation detail (Admin)
     * GET /api/admin/reservations/{kode_reservasi}
     */
    public function show($kode_reservasi)
    {
        $reservation = Reservation::with(['reservationMenus.menu.category'])
            ->where('kode_reservasi', $kode_reservasi)
            ->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'message' => 'Data reservasi berhasil diambil',
            'data' => $reservation,
        ]);
    }

    /**
     * Update reservation (Admin)
     * PUT /api/admin/reservations/{kode_reservasi}
     */
    public function update(Request $request, $kode_reservasi)
    {
        $reservation = Reservation::where('kode_reservasi', $kode_reservasi)->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        // Validasi dengan rules yang lebih spesifik
        $validated = $request->validate([
            'nama_pelanggan' => 'sometimes|nullable|string|max:255', 
            'nomor_wa' => 'sometimes|nullable|string|max:20',        
            'tanggal' => 'sometimes|nullable|date',
            'jam' => 'sometimes|nullable|date_format:H:i',
            'jumlah_orang' => 'sometimes|nullable|integer|min:1',
            'status_reservasi' => 'sometimes|nullable|in:pending,confirmed,completed,cancelled',
            'status_dp' => 'sometimes|nullable|in:pending,paid,failed', 
            'catatan' => 'nullable|string',
        ]);

        // Update hanya field yang ada dalam request
        if (isset($validated['nama_pelanggan'])) {
            $reservation->nama_pelanggan = $validated['nama_pelanggan'];
        }
        if (isset($validated['nomor_wa'])) {
            $reservation->nomor_wa = $validated['nomor_wa'];
        }
        if (isset($validated['tanggal'])) {
            $reservation->tanggal = $validated['tanggal'];
        }
        if (isset($validated['jam'])) {
            $reservation->jam = $validated['jam'];
        }
        if (isset($validated['jumlah_orang'])) {
            $reservation->jumlah_orang = $validated['jumlah_orang'];
        }
        if (isset($validated['status_reservasi'])) {
            $reservation->status_reservasi = $validated['status_reservasi'];
        }
        if (isset($validated['status_dp'])) {
            $reservation->status_dp = $validated['status_dp'];
        }
        if (array_key_exists('catatan', $validated)) {
            $reservation->catatan = $validated['catatan'];
        }

        if($request->jumlah_orang > 10) {
            $reservation->kategori_jumlah = '>10';    
        } else {
            $reservation->kategori_jumlah = '<10';
        }

        $reservation->save();

        return response()->json([
            'message' => 'Reservasi berhasil diupdate',
            'data' => $reservation->fresh(['reservationMenus.menu']),
        ]);
    }

        /**
     * Update reservation menus (Admin)
     * PUT /api/admin/reservations/{kode_reservasi}/menus
     */
    public function updateMenus(Request $request, $kode_reservasi)
    {
        $reservation = Reservation::where('kode_reservasi', $kode_reservasi)->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'menus' => 'nullable|array',
            'menus.*.menu_id' => 'required|exists:menus,id',
            'menus.*.jumlah' => 'required|integer|min:1',
        ]);

        // Validasi: jika >10, harus ada minimal 1 menu
        if ($reservation->kategori_jumlah === '>10' && empty($validated['menus'])) {
            return response()->json([
                'message' => 'Untuk kategori >10 orang, wajib ada minimal 1 menu',
                'errors' => [
                    'menus' => ['Minimal harus ada 1 menu untuk kategori >10 orang']
                ]
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Delete existing menus
            ReservationMenu::where('kode_reservasi', $kode_reservasi)->delete();

            // Create new menus (if any)
            if (!empty($validated['menus'])) {
                foreach ($validated['menus'] as $menuItem) {
                    $menu = Menu::find($menuItem['menu_id']);
                    $subtotal = $menu->harga_menu * $menuItem['jumlah'];

                    ReservationMenu::create([
                        'kode_reservasi' => $kode_reservasi,
                        'menu_id' => $menuItem['menu_id'],
                        'jumlah' => $menuItem['jumlah'],
                        'subtotal' => $subtotal,
                    ]);
                }
            }

            DB::commit();

            // Load fresh data
            $reservation->load('reservationMenus.menu');

            return response()->json([
                'message' => 'Menu reservasi berhasil diupdate',
                'data' => $reservation,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update menus error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal mengupdate menu',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete reservation (Admin)
     * DELETE /api/admin/reservations/{kode_reservasi}
     */
    public function destroy($kode_reservasi)
    {
        $reservation = Reservation::where('kode_reservasi', $kode_reservasi)->first();

        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        }

        // Check if can be deleted (only pending/cancelled)
        if (!in_array($reservation->status_reservasi, ['pending', 'cancelled'])) {
            return response()->json([
                'message' => 'Hanya reservasi dengan status pending atau cancelled yang dapat dihapus',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Delete related records
            ReservationMenu::where('kode_reservasi', $kode_reservasi)->delete();
            $reservation->delete();

            DB::commit();

            return response()->json([
                'message' => 'Reservasi berhasil dihapus',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Delete reservation error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal menghapus reservasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get reservation statistics (Admin)
     * GET /api/admin/reservations/statistics
     */
    public function statistics()
    {
        $today = now()->toDateString();
        $thisMonth = now()->format('Y-m');

        $stats = [
            'total' => Reservation::count(),
            'today' => Reservation::whereDate('tanggal', $today)->count(),
            'this_month' => Reservation::where('tanggal', 'like', "{$thisMonth}%")->count(),
            'confirmed' => Reservation::where('status_reservasi', 'confirmed')->count(),
            'pending' => Reservation::where('status_reservasi', 'pending')->count(),
            'completed' => Reservation::where('status_reservasi', 'completed')->count(),
            'cancelled' => Reservation::where('status_reservasi', 'cancelled')->count(),
            'total_dp_paid' => Reservation::where('status_dp', 'paid')->sum('total_dp'),
            'total_dp_pending' => Reservation::where('status_dp', 'pending')->sum('total_dp'),
        ];

        return response()->json($stats);
    }

        /**
     * Export reservations to CSV (Admin)
     * GET /api/admin/reservations/export
     */
    public function export(Request $request)
    {
        $query = Reservation::with(['reservationMenus.menu']);

        // Apply same filters as index
        if ($request->has('status_reservasi')) {
            $query->where('status_reservasi', $request->status_reservasi);
        }

        if ($request->has('status_dp')) {
            $query->where('status_dp', $request->status_dp);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kode_reservasi', 'like', "%{$search}%")
                  ->orWhere('nama_pelanggan', 'like', "%{$search}%")
                  ->orWhere('nomor_wa', 'like', "%{$search}%");
            });
        }

        $reservations = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'reservasi_cifos_' . date('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function() use ($reservations) {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Header
            fputcsv($file, [
                'Kode Reservasi',
                'Nama Pelanggan',
                'No. WhatsApp',
                'Tanggal',
                'Jam',
                'Kategori',
                'Jumlah Orang',
                'Menu',
                'Total Menu',
                'DP',
                'Status DP',
                'Status Reservasi',
                'Catatan',
                'Tanggal Booking'
            ]);

            // Data
            foreach ($reservations as $reservation) {
                // Calculate total menu
                $totalMenu = 0;
                $menuList = [];
                
                if ($reservation->reservationMenus && $reservation->reservationMenus->count() > 0) {
                    foreach ($reservation->reservationMenus as $item) {
                        $menuList[] = $item->menu->nama_menu . ' x' . $item->jumlah;
                        $totalMenu += $item->subtotal;
                    }
                }

                fputcsv($file, [
                    $reservation->kode_reservasi,
                    $reservation->nama_pelanggan,
                    $reservation->nomor_wa,
                    \Carbon\Carbon::parse($reservation->tanggal)->format('d/m/Y'),
                    $reservation->jam,
                    $reservation->kategori_jumlah,
                    $reservation->jumlah_orang,
                    implode(', ', $menuList),
                    $totalMenu > 0 ? 'Rp ' . number_format($totalMenu, 0, ',', '.') : '-',
                    'Rp ' . number_format($reservation->total_dp, 0, ',', '.'),
                    ucfirst($reservation->status_dp),
                    ucfirst($reservation->status_reservasi),
                    $reservation->catatan ?? '-',
                    \Carbon\Carbon::parse($reservation->created_at)->format('d/m/Y H:i')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}