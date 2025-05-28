<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id('Admin_ID');
            $table->string('Nama_Lengkap');
            $table->string('Username')->unique();
            $table->string('Email')->unique();
            $table->string('Password');
            $table->string('Nomor_HP')->nullable();
            $table->text('Alamat')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('admins');
    }
}
