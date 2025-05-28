<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('User_ID');
            $table->string('Nama_Lengkap');
            $table->string('Foto_Profil');
            $table->string('Username')->unique();
            $table->string('Email')->unique();
            $table->string('Password');
            $table->string('Nomor_HP')->nullable();
            $table->text('Alamat')->nullable();
            $table->enum('Role', ['Adopter', 'Owner']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}
