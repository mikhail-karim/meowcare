<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatPenyakit extends Model
{
    protected $table = 'riwayat_penyakit';
    protected $primaryKey = 'RiwayatPenyakit_ID';
    public $timestamps = true;

    protected $fillable = [
        'Penyakit_ID',
        'Pet_ID',
        'Status',
    ];

    public function penyakit()
    {
        return $this->belongsTo(Penyakit::class, 'Penyakit_ID', 'Penyakit_ID');
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class, 'Pet_ID', 'Pet_ID');
    }
}
