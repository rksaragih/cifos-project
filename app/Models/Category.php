<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    
    protected $table = 'categories';
    protected $fillable = [
        'nama', 
    ];

    public function menus()
    {
        return $this->hasMany(Menu::class, 'kategori_id');
    } 
}
