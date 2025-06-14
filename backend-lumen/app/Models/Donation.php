<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $table = 'donation';
    protected $primaryKey = 'Donation_ID';
    public $timestamps = true;

    protected $fillable = [
        'Nominal',
        'Catatan',
        'User_ID'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'User_ID');
    }
}
