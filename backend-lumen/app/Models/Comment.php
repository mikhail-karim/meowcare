<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';
    protected $primaryKey = 'Comments_ID';
    public $timestamps = true;

    protected $fillable = [
        'Artikel_ID',
        'User_ID',
        'Comments',
    ];

    // Relasi ke Artikel
    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'Artikel_ID', 'Artikel_ID');
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID', 'User_ID');
    }
}
