<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WarnaSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['Nama' => 'Hitam', 'Kode_Warna' => '#000000'],
            ['Nama' => 'Putih', 'Kode_Warna' => '#FFFFFF'],
            ['Nama' => 'Abu-abu', 'Kode_Warna' => '#808080'],
            ['Nama' => 'Oranye', 'Kode_Warna' => '#FFA500'],
            ['Nama' => 'Cokelat', 'Kode_Warna' => '#8B4513'],
            ['Nama' => 'Krem', 'Kode_Warna' => '#FFFDD0'],
            ['Nama' => 'Tabby', 'Kode_Warna' => null],
            ['Nama' => 'Tortoiseshell', 'Kode_Warna' => null],
            ['Nama' => 'Calico', 'Kode_Warna' => null],
            ['Nama' => 'Biru Abu-abu', 'Kode_Warna' => '#A2B6C0'],
            ['Nama' => 'Merah Bata', 'Kode_Warna' => '#B22222'],
            ['Nama' => 'Perak', 'Kode_Warna' => '#C0C0C0'],
            ['Nama' => 'Emas', 'Kode_Warna' => '#FFD700'],
        ];

        foreach ($data as $item) {
            DB::table('warna')->updateOrInsert(
                ['Nama' => $item['Nama']],
                $item
            );
        }
    }
}
