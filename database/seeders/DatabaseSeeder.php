<?php

namespace Database\Seeders;

use App\Models\Admin;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'shop_name' => 'Rami',
        //     'shop_name_ar' => 'Rami',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt('12345678'),
        // ]);

        Admin::create([
            'name' => 'admin',
            'password' => bcrypt('C{U443g`5WPj'),
        ]);
    }
}
