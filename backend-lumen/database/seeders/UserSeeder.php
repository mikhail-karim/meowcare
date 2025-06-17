<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'Nama_Lengkap' => 'Regular User',
                'Foto_Profil' => 'images/profile/default.jpg',
                'Username' => 'user',
                'Email' => 'user@user.com',
                'Password' => Hash::make('user123'),
                'Nomor_HP' => null,
                'Alamat' => null,
                'Role' => 'Adopter',
            ],
        ]);
    }
}
