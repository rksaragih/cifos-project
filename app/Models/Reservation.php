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
        'payment_id',
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

    public function reservationMenus()
    {
        return $this->hasMany(ReservationMenu::class, 'kode_reservasi', 'kode_reservasi');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}