<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRiwayatPenyakitTable extends Migration
{
    public function up()
    {
        Schema::create('riwayat_penyakit', function (Blueprint $table) {
            $table->bigIncrements('RiwayatPenyakit_ID');
            $table->unsignedBigInteger('Penyakit_ID');
            $table->unsignedBigInteger('Pet_ID');
            $table->enum('Status', ['sehat', 'diobati', 'sakit']);
            $table->timestamps();

            $table->foreign('Penyakit_ID')->references('Penyakit_ID')->on('penyakit')->onDelete('cascade');
            $table->foreign('Pet_ID')->references('Pet_ID')->on('pets')->onDelete('cascade');

            $table->unique(['Penyakit_ID', 'Pet_ID']); // Optional: prevent duplicate entries
        });
    }

    public function down()
    {
        Schema::dropIfExists('riwayat_penyakit');
    }
}
