<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {

            $table->bigIncrements('item_id');
            $table->string('item_name', 255)->index();
            $table->string('category', 100)->index();
            $table->string('shop_id');
            $table->foreign('shop_id')->references('shop_id')->on('users');
            $table->double('unit_price', 15, 2)->nullable();
            $table->string('pic_filename', 255)->nullable();
            $table->string('bgColor', 8);
            $table->string('txtColor', 8);
            $table->json('tags')->nullable();
            $table->string('description', 1000)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
