<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penyakit extends Model
{
    protected $table = 'penyakit';
    protected $primaryKey = 'Penyakit_ID';
    protected $fillable = [
        'Nama', 
        'Gejala', 
        'Penyebab', 
        'Obat'
    ];
}
