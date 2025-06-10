<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Konfirmasi extends Model
{
    protected $table = 'konfirmasis';
    protected $primaryKey = 'Konfirmasi_ID';
    public $timestamps = true;

    protected $fillable = [
        'Admin_ID',
        'Pengajuan_ID',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'Admin_ID');
    }

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class, 'Pengajuan_ID');
    }
}
