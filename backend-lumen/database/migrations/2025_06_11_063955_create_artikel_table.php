<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArtikelTable extends Migration
{
    public function up()
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->bigIncrements('Artikel_ID');
            $table->string('Judul');
            $table->string('Thumbnail')->nullable();
            $table->text('Artikel');
            $table->string('Kategori');
            $table->unsignedBigInteger('Likes')->default(0);
            $table->unsignedBigInteger('View')->default(0);
            $table->unsignedBigInteger('Admin_ID');
            $table->timestamps();

            $table->foreign('Admin_ID')->references('Admin_ID')->on('admins')->onDelete('cascade');
        });
        
        Schema::table('artikel', function (Blueprint $table) {
            $table->text('LikedUsers')->nullable()->after('Likes')->comment('JSON array of user IDs who liked the article');
        });
    }

    public function down()
    {
        Schema::dropIfExists('artikel');
    
        Schema::table('artikel', function (Blueprint $table) {
            $table->dropColumn('LikedUsers');
        });
    }
}
