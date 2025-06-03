<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $table = 'pets';
    protected $primaryKey = 'Pet_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nama', 
        'Foto', 
        'Umur', 
        'Jenis_Kelamin', 
        'Adopted', 
        'Divaksin', 
        'Sterilisasi', 
        'Ras_ID', 
        'Warna_ID', 
        'User_ID', 
    ];

    public function ras()
    {
        return $this->belongsTo(Ras::class, 'Ras_ID');
    }

    public function warna()
    {
        return $this->belongsTo(Warna::class, 'Warna_ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID');
    }
}
