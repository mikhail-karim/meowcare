<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warna extends Model
{
    protected $table = 'warna';
    protected $primaryKey = 'Warna_ID';
    protected $fillable = [
        'Nama', 
        'Kode_Warna'];
}
