<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Makanan',
            'Nasi Goreng',
            'Dimsum',
            'Roti Bakar',
            'Jajanan',
            'Coffee',
            'Non Coffee',
            'Tea',
            'Ice Cream',
            'Soda',
            'Speciality',
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['nama' => $category]);
        }
    }
}
