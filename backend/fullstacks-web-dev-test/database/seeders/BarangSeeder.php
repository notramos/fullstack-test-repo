<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as faker;
use Illuminate\Support\Facades\DB;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = faker::create();
        $categories = ['Elektronik', 'Makanan', 'Pakaian', 'Alat Tulis'];

        for ($i = 0; $i < 15; $i++) {
            DB::table('barangs')->insert([
                'nama_barang' => $faker->word,
                'kategori' => $categories[array_rand($categories)],
                'harga' => $faker->numberBetween(10000, 100000),
            ]);
        }
    }
}
