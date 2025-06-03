<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePetsTable extends Migration
{
    public function up()
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id('Pet_ID');
            $table->string('Nama');
            $table->string('Foto');
            $table->integer('Umur');
            $table->enum('Jenis_Kelamin', ['Laki-Laki', 'Perempuan']);
            $table->boolean('Adopted')->default(false);
            $table->boolean('Divaksin')->default(false);
            $table->boolean('Sterilisasi')->default(false);
            $table->unsignedBigInteger('Ras_ID');
            $table->unsignedBigInteger('Warna_ID');
            $table->unsignedBigInteger('User_ID');
            $table->timestamps();

            $table->foreign('Ras_ID')->references('Ras_ID')->on('ras')->onDelete('cascade');
            $table->foreign('Warna_ID')->references('Warna_ID')->on('warna')->onDelete('cascade');
            $table->foreign('User_ID')->references('User_ID')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pets');
    }
}
