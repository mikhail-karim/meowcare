<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePengajuanTable extends Migration
{
    public function up()
    {
        Schema::create('pengajuans', function (Blueprint $table) {
            $table->id('Pengajuan_ID');
            $table->text('Alasan');
            $table->boolean('Approved')->default(false);
            $table->unsignedBigInteger('User_ID');
            $table->unsignedBigInteger('Pet_ID');
            $table->timestamps();

            $table->foreign('User_ID')->references('User_ID')->on('users')->onDelete('cascade');
            $table->foreign('Pet_ID')->references('Pet_ID')->on('pets')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pengajuans');
    }
}
