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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('ordering_counter')->nullable()->after('active');
            $table->foreign('ordering_counter')->references('id')->on('tokens');
            $table->boolean('enable_ordering')->default(0)->after('ordering_counter');
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
