<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PenyakitSeeder extends Seeder
{
    public function run()
    {
        $penyakits = [
            [
                'Penyakit_ID' => 1,
                'Nama' => 'Feline Calicivirus',
                'Gejala' => 'Bersin, demam, luka di mulut',
                'Penyebab' => 'Infeksi virus calicivirus',
                'Obat' => 'Perawatan suportif, cairan, antibiotik sekunder',
            ],
            [
                'Penyakit_ID' => 2,
                'Nama' => 'Feline Herpesvirus',
                'Gejala' => 'Mata berair, bersin, lesu',
                'Penyebab' => 'Infeksi herpesvirus tipe-1',
                'Obat' => 'Antiviral, antibiotik sekunder',
            ],
            [
                'Penyakit_ID' => 3,
                'Nama' => 'Cacingan',
                'Gejala' => 'Diare, muntah, berat badan turun',
                'Penyebab' => 'Infeksi cacing gelang atau pita',
                'Obat' => 'Obat cacing seperti pyrantel atau praziquantel',
            ],
            [
                'Penyakit_ID' => 4,
                'Nama' => 'Scabies (Kudis)',
                'Gejala' => 'Gatal, kerontokan bulu, luka kulit',
                'Penyebab' => 'Tungau Sarcoptes scabiei',
                'Obat' => 'Obat kutu topikal/oral, mandi antiseptik',
            ],
            [
                'Penyakit_ID' => 5,
                'Nama' => 'Feline Panleukopenia',
                'Gejala' => 'Demam tinggi, muntah, diare berdarah',
                'Penyebab' => 'Infeksi parvovirus kucing',
                'Obat' => 'Perawatan cairan, antibiotik, isolasi',
            ],
            [
                'Penyakit_ID' => 6,
                'Nama' => 'Feline Leukemia Virus (FeLV)',
                'Gejala' => 'Penurunan berat badan, infeksi sekunder, lesu',
                'Penyebab' => 'Virus leukemia kucing',
                'Obat' => 'Tidak ada obat, hanya perawatan suportif',
            ],
            [
                'Penyakit_ID' => 7,
                'Nama' => 'Feline Infectious Peritonitis (FIP)',
                'Gejala' => 'Demam, cairan di perut, nafsu makan menurun',
                'Penyebab' => 'Mutasi coronavirus kucing',
                'Obat' => 'Obat antiviral eksperimental (GS-441524), suportif',
            ],
            [
                'Penyakit_ID' => 8,
                'Nama' => 'Otitis Eksterna',
                'Gejala' => 'Telinga bau, gatal, goresan di sekitar telinga',
                'Penyebab' => 'Infeksi bakteri, jamur, atau tungau telinga',
                'Obat' => 'Obat tetes telinga, pembersihan rutin',
            ],
            [
                'Penyakit_ID' => 9,
                'Nama' => 'Gingivitis',
                'Gejala' => 'Gusi merah, bau mulut, kesulitan makan',
                'Penyebab' => 'Plak dan bakteri',
                'Obat' => 'Pembersihan gigi, antibiotik, perawatan gusi',
            ],
            [
                'Penyakit_ID' => 10,
                'Nama' => 'Konjungtivitis',
                'Gejala' => 'Mata merah, bengkak, keluar lendir',
                'Penyebab' => 'Iritasi, virus, atau bakteri',
                'Obat' => 'Obat tetes mata antibiotik atau antiviral',
            ],
            [
                'Penyakit_ID' => 11,
                'Nama' => 'Infeksi Saluran Kemih (ISK)',
                'Gejala' => 'Sering pipis, darah di urin, nyeri saat buang air',
                'Penyebab' => 'Bakteri atau kristal urin',
                'Obat' => 'Antibiotik, diet khusus',
            ],
            [
                'Penyakit_ID' => 12,
                'Nama' => 'Toksoplasmosis',
                'Gejala' => 'Diare, demam, lesu',
                'Penyebab' => 'Parasit Toxoplasma gondii',
                'Obat' => 'Obat antiparasit seperti clindamycin',
            ],
        ];

        foreach ($penyakits as $penyakit) {
            $exists = DB::table('penyakit')->where('Penyakit_ID', $penyakit['Penyakit_ID'])->exists();

            if (!$exists) {
                DB::table('penyakit')->insert($penyakit);
            }
        }
    }
}
