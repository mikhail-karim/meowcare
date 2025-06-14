<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDonationTable extends Migration
{
    public function up()
    {
        Schema::create('donation', function (Blueprint $table) {
            $table->increments('Donation_ID');
            $table->decimal('Nominal', 12, 2);
            $table->text('Catatan')->nullable();
            $table->unsignedBigInteger('User_ID');
            $table->timestamps();

            $table->foreign('User_ID')->references('User_ID')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('donation');
    }
}
