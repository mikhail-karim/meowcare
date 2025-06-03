<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarnaTable extends Migration
{
    public function up()
    {
        Schema::create('warna', function (Blueprint $table) {
            $table->id('Warna_ID');
            $table->string('Nama');
            $table->string('Kode_Warna')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('warna');
    }
}
