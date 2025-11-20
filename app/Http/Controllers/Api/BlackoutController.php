<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservationBlackout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BlackoutController extends Controller
{
    /**
     * Get all blackout dates
     * GET /api/blackout-dates
     */
    public function index()
    {
        $blackoutDates = ReservationBlackout::orderBy('tanggal', 'asc')->get();
        
        // Return as array of date strings
        $dates = $blackoutDates->pluck('tanggal')->toArray();
        
        return response()->json([
            'status' => 'success',
            'data' => $dates
        ]);
    }

    /**
     * Save/Update blackout dates
     * POST /api/blackout-dates
     * 
     * Expects: { "dates": ["2025-01-20", "2025-01-25", ...] }
     */
    public function store(Request $request)
    {
        $request->validate([
            'dates' => 'required|array',
            'dates.*' => 'date_format:Y-m-d',
        ]);

        try {
            // Use DB::transaction to manage commit/rollback automatically.
            // Use delete() instead of truncate() because TRUNCATE can cause implicit commits
            // which break transaction semantics on some DB drivers.
            DB::transaction(function () use ($request) {
                // Remove existing blackout dates in a transactional-safe way
                ReservationBlackout::query()->delete();

                // Prepare and insert new blackout dates
                $datesToInsert = [];
                foreach ($request->dates as $date) {
                    $datesToInsert[] = [
                        'tanggal' => $date,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($datesToInsert)) {
                    ReservationBlackout::insert($datesToInsert);
                }
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Blackout dates berhasil disimpan',
                'data' => $request->dates
            ]);

        } catch (\Exception $e) {
            Log::error('Save blackout dates error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan blackout dates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add single blackout date
     * POST /api/blackout-dates/add
     */
    public function addDate(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date_format:Y-m-d',
        ]);

        try {
            // Check if already exists
            $exists = ReservationBlackout::where('tanggal', $request->tanggal)->first();
            
            if ($exists) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tanggal sudah ada dalam blackout list'
                ], 422);
            }

            $blackout = ReservationBlackout::create([
                'tanggal' => $request->tanggal
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Tanggal berhasil ditambahkan ke blackout',
                'data' => $blackout
            ]);

        } catch (\Exception $e) {
            Log::error('Add blackout date error: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan blackout date'
            ], 500);
        }
    }

    /**
     * Remove single blackout date
     * DELETE /api/blackout-dates/{date}
     */
    public function removeDate($date)
    {
        try {
            $blackout = ReservationBlackout::where('tanggal', $date)->first();
            
            if (!$blackout) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tanggal tidak ditemukan'
                ], 404);
            }

            $blackout->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Tanggal berhasil dihapus dari blackout'
            ]);

        } catch (\Exception $e) {
            Log::error('Remove blackout date error: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus blackout date'
            ], 500);
        }
    }

    /**
     * Check if a date is blackout
     * GET /api/blackout-dates/check/{date}
     */
    public function checkDate($date)
    {
        $isBlackout = ReservationBlackout::where('tanggal', $date)->exists();
        
        return response()->json([
            'status' => 'success',
            'date' => $date,
            'is_blackout' => $isBlackout
        ]);
    }

    /**
     * Clear all blackout dates
     * DELETE /api/blackout-dates
     */
    public function clearAll()
    {
        try {
            ReservationBlackout::truncate();

            return response()->json([
                'status' => 'success',
                'message' => 'Semua blackout dates berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            Log::error('Clear blackout dates error: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus blackout dates'
            ], 500);
        }
    }
}