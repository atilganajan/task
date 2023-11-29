<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Category;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
         \App\Models\User::factory()->create([
             'name' => 'Super Admin',
             'email' => 'admin@example.com',
             'role'=>'admin'
         ]);

        Category::factory(6)->create();
    }
}
