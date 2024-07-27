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
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('order_id');
            $table->unsignedBigInteger('employee_id')->index();
            $table->foreign('employee_id')->references('id')->on('users');
            $table->string('shop_id');
            $table->foreign('shop_id')->references('shop_id')->on('users');
            $table->double('total', 15, 3);
            $table->unsignedInteger('token_number');
            // $table->foreign('token_number')->references('count')->on('tokens');
            $table->string('comments', 255)->nullable();
            $table->enum('status', ['B', 'I', 'C', 'CO'])->default('B');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
