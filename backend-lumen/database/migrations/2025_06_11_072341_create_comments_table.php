<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->bigIncrements('Comments_ID');
            $table->unsignedBigInteger('Artikel_ID');
            $table->unsignedBigInteger('User_ID');
            $table->text('Comments');
            $table->timestamps();

            $table->foreign('Artikel_ID')->references('Artikel_ID')->on('artikel')->onDelete('cascade');
            $table->foreign('User_ID')->references('User_ID')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
