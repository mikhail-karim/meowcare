<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajuan extends Model
{
    protected $table = 'pengajuans';
    protected $primaryKey = 'Pengajuan_ID';
    public $timestamps = true;

    protected $fillable = [
        'Alasan',
        'Approved',
        'User_ID',
        'Pet_ID',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID');
    }

    public function pet()
    {
        return $this->belongsTo(Pet::class, 'Pet_ID');
    }
}
