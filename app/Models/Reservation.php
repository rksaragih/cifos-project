<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';
    protected $primaryKey = 'kode_reservasi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_reservasi',
        'nama_pelanggan',
        'nomor_wa',
        'tanggal',
        'jam',
        'kategori_jumlah',
        'jumlah_orang',
        'catatan',
        'total_dp',
        'status_dp',
        'status_reservasi',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'total_dp' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reservation) {
            if(empty($reservation->kode_reservasi)) {
                $today = now()->format('Ymd');
                
                $lastReservation = self::whereDate('created_at', now()->toDateString())
                    ->orderBy('created_at', 'desc')
                    ->first();

                $lastNumber = 0;
                if ($lastReservation && preg_match('/RSV-\d{8}-(\d+)/', $lastReservation->kode_reservasi, $matches)) {
                    $lastNumber = (int) $matches[1];
                }

                $newNumber = $lastNumber + 1;
                $reservation->kode_reservasi = 'RSV-' . $today . '-' . $newNumber;
            }
        });
    }

    /**
     * Relationship: Reservation has many menus
     */
    public function reservationMenus()
    {
        return $this->hasMany(ReservationMenu::class, 'kode_reservasi', 'kode_reservasi');
    }

    /**
     * Get formatted tanggal (Indonesia format)
     */
    public function getFormattedTanggalAttribute()
    {
        return $this->tanggal->format('d F Y');
    }

    /**
     * Get total menu price
     */
    public function getTotalMenuPriceAttribute()
    {
        return $this->reservationMenus->sum('subtotal');
    }

    /**
     * Scope: Filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status_reservasi', $status);
    }

    /**
     * Scope: Filter by DP status
     */
    public function scopeByDpStatus($query, $status)
    {
        return $query->where('status_dp', $status);
    }

    /**
     * Scope: Filter by date range
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
    }

    /**
     * Scope: Today's reservations
     */
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', now()->toDateString());
    }

    /**
     * Scope: This month's reservations
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('tanggal', now()->month)
                     ->whereYear('tanggal', now()->year);
    }
}