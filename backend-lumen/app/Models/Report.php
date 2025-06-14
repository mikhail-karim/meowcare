<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'report';
    protected $primaryKey = 'Report_ID';
    public $timestamps = true;

    protected $fillable = [
        'User_ID',
        'Deskripsi',
        'Foto',
        'Rescued'
    ];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID', 'User_ID');
    }
}
