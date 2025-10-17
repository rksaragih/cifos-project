<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;
    
    protected $table = 'articles';
    protected $fillable = [
        'judul', 
        'isi', 
        'foto',
        'author_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
