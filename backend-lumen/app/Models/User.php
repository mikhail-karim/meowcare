<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'users';
    protected $primaryKey = 'User_ID';
    public $timestamps = false;

    protected $fillable = [
        'Nama_Lengkap',
        'Foto_Profil',
        'Username',
        'Email',
        'Password',
        'Nomor_HP',
        'Alamat',
        'Role',
    ];

    protected $hidden = [
        'Password',
    ];

    public function getJWTIdentifier()
    {
        return $this->User_ID;
    }

    public function getJWTCustomClaims()
    {
        return ['role' => 'user'];
    }

    public function getAuthPassword()
    {
        return $this->Password;
    }

    public function getAuthIdentifierName()
    {
        return 'User_ID';
    }

}
