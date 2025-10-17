<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menus';
    protected $fillable = [
        'kategori_id', 
        'nama_menu', 
        'harga_menu',
        'foto_menu',
        'tersedia',
    ];

    protected $casts = [
        'tersedia' => 'boolean',
        'harga_menu' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'kategori_id');
    }

    public function reservationMenus()
    {
        return $this->hasMany(ReservationMenu::class, 'menu_id');
    } 
}
