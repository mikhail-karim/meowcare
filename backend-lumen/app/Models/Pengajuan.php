<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengajuan extends Model
{
    protected $table = 'pengajuans';
    protected $primaryKey = 'Pengajuan_ID';
    public $timestamps = true;

    // Status constants
    const STATUS_PENDING = 0;
    const STATUS_APPROVED = 1;
    const STATUS_REJECTED = 2;

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

    // Helper methods for status
    public function isPending()
    {
        return $this->Approved === self::STATUS_PENDING;
    }

    public function isApproved()
    {
        return $this->Approved === self::STATUS_APPROVED;
    }

    public function isRejected()
    {
        return $this->Approved === self::STATUS_REJECTED;
    }
}
