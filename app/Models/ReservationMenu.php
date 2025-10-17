<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReservationMenu extends Model
{
    use HasFactory;

    protected $table = 'reservation_menus';
    protected $fillable = [
        'kode_reservasi', 
        'menu_id', 
        'jumlah',
        'subtotal',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'kode_reservasi', 'kode_reservasi');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }
}
