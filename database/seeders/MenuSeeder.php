<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\Category;
use League\Csv\Reader;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('seeders/data/menus.csv'));
        $csv->setHeaderOffset(0);

        foreach($csv as $record) {
            $category = Category::firstOrCreate([ 'nama' => $record['kategori']]);

            Menu::create([
                'kategory_id' => $category->id,
                'nama_menu' => $record['nama'],
                'harga_menu' => $record['harga'],
            ]);
        }
    }
}
