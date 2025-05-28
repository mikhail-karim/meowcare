<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'admins';
    protected $primaryKey = 'Admin_ID';
    public $timestamps = false;

    protected $fillable = [
        'Nama_Lengkap',
        'Username',
        'Email',
        'Password',
        'Nomor_HP',
        'Alamat',
    ];

    protected $hidden = [
        'Password',
    ];

    public function getJWTIdentifier()
    {
        return $this->Admin_ID;
    }

    public function getJWTCustomClaims()
    {
        return ['role' => 'admin'];
    }

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function getAuthIdentifierName()
    {
        return 'Admin_ID';
    }
}
