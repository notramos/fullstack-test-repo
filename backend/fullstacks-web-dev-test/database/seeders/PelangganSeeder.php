<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as faker;
use Illuminate\Support\Facades\DB;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = faker::create();
        $genders = ['laki-laki', 'perempuan'];

        for ($i = 0; $i < 15; $i++) {
            DB::table('pelanggans')->insert([
                'nama' => $faker->name,
                'domisili' => $faker->city,
                'jenis_kelamin' => $genders[array_rand($genders)],
            ]);
        }
    }
}
