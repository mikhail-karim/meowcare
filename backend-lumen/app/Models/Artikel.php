<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artikel extends Model
{
    protected $table = 'artikel';
    protected $primaryKey = 'Artikel_ID';
    public $timestamps = true;

    protected $fillable = [
        'Judul',
        'Thumbnail',
        'Artikel',
        'Kategori',
        'Likes',
        'View',
        'Admin_ID',
        'LikedUsers',
    ];

    protected $casts = [
        'Likes' => 'integer',
        'View' => 'integer',
        'LikedUsers' => 'array',
    ];

    // Relasi ke Admin
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'Admin_ID', 'Admin_ID');
    }
}
