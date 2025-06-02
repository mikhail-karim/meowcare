<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ras extends Model
{
    protected $table = 'ras';
    protected $primaryKey = 'Ras_ID';
    protected $fillable = [
        'Nama', 
        'Asal', 
        'Ciri_Khas'
    ];
}
