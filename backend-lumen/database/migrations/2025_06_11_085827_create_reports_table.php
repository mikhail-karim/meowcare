<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportsTable extends Migration
{
    public function up()
    {
        Schema::create('report', function (Blueprint $table) {
            $table->bigIncrements('Report_ID');
            $table->unsignedBigInteger('User_ID');
            $table->text('Deskripsi');
            $table->string('Foto')->nullable();
            $table->boolean('Rescued')->default(false);
            $table->timestamps();

            $table->foreign('User_ID')->references('User_ID')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('report');
    }
}
