<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenyakitTable extends Migration
{
    public function up()
    {
        Schema::create('Penyakit', function (Blueprint $table) {
            $table->id('Penyakit_ID');
            $table->string('Nama');
            $table->text('Gejala');
            $table->text('Penyebab');
            $table->text('Obat');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Penyakit');
    }
}
