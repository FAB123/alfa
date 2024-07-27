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
        Schema::create('ordered_items', function (Blueprint $table) {
            $table->bigIncrements('track_id');
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('order_id')->on('orders');
            $table->unsignedBigInteger('item_id');
            $table->foreign('item_id')->references('item_id')->on('items');
            $table->json('tags')->nullable();
            $table->double('order_quantity', 15, 2);
            $table->double('item_unit_price', 15, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordered_items');
    }
};
