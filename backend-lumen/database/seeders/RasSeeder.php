<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RasSeeder extends Seeder
{
    public function run()
    {
        $rasList = [
            ['Nama' => 'Persian', 'Asal' => 'Iran', 'Ciri_Khas' => 'Bulu panjang, wajah datar'],
            ['Nama' => 'Maine Coon', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Ukuran besar, bulu lebat'],
            ['Nama' => 'Siamese', 'Asal' => 'Thailand', 'Ciri_Khas' => 'Tubuh ramping, mata biru'],
            ['Nama' => 'Bengal', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Corak mirip macan tutul'],
            ['Nama' => 'Sphynx', 'Asal' => 'Kanada', 'Ciri_Khas' => 'Tidak berbulu, kulit keriput'],
            ['Nama' => 'British Shorthair', 'Asal' => 'Inggris', 'Ciri_Khas' => 'Tubuh kekar, bulu pendek'],
            ['Nama' => 'Ragdoll', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Bersifat jinak, bulu lebat'],
            ['Nama' => 'Abyssinian', 'Asal' => 'Ethiopia', 'Ciri_Khas' => 'Bulu pendek, aktif'],
            ['Nama' => 'Scottish Fold', 'Asal' => 'Skotlandia', 'Ciri_Khas' => 'Telinga terlipat'],
            ['Nama' => 'Russian Blue', 'Asal' => 'Rusia', 'Ciri_Khas' => 'Bulu abu-abu kebiruan'],
            ['Nama' => 'Birman', 'Asal' => 'Myanmar', 'Ciri_Khas' => 'Kaki putih, mata biru'],
            ['Nama' => 'Oriental Shorthair', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Beragam warna, kuping besar'],
            ['Nama' => 'Savannah', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Mirip kucing liar Afrika'],
            ['Nama' => 'Norwegian Forest Cat', 'Asal' => 'Norwegia', 'Ciri_Khas' => 'Bulu tahan cuaca dingin'],
            ['Nama' => 'Turkish Van', 'Asal' => 'Turki', 'Ciri_Khas' => 'Suka air, pola warna unik'],
            ['Nama' => 'Balinese', 'Asal' => 'Amerika Serikat', 'Ciri_Khas' => 'Seperti Siamese tapi berbulu panjang'],
        ];

        foreach ($rasList as $ras) {
            $exists = DB::table('ras')->where('Nama', $ras['Nama'])->exists();

            if (!$exists) {
                DB::table('ras')->insert($ras);
            }
        }
    }
}
