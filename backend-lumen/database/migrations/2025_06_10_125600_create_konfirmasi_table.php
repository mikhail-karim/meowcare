<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKonfirmasiTable extends Migration
{
    public function up()
    {
        Schema::create('konfirmasis', function (Blueprint $table) {
            $table->id('Konfirmasi_ID');
            $table->unsignedBigInteger('Admin_ID');
            $table->unsignedBigInteger('Pengajuan_ID');
            $table->timestamps();

            $table->foreign('Admin_ID')->references('Admin_ID')->on('admins')->onDelete('cascade');
            $table->foreign('Pengajuan_ID')->references('Pengajuan_ID')->on('pengajuans')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('konfirmasis');
    }
}
