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
        Schema::create('tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('count')->default(0)->index();
            $table->unsignedInteger('issued_count')->default(0);
            $table->string('title', 50);
            $table->unsignedBigInteger('user_id');
            $table->boolean('kiosk_mode')->default(0);
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedInteger('max_count')->default(0);
            $table->dateTime('last_reset', precision: 0)->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
