<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReservationBlackout extends Model
{
    use HasFactory;

    protected $table = 'reservation_blackouts';
    protected $fillable = [
        'tanggal', 
    ];
}
