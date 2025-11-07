<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Pelanggan;
use App\Models\Barang;
use App\Models\Penjualan;
use App\Models\Item_Penjualan;

class PenjualanSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $pelanggans = Pelanggan::all();
        $barangs = Barang::all();

        if ($pelanggans->isEmpty() || $barangs->isEmpty()) {
            $this->command->warn('⚠️ Harap isi tabel pelanggans dan barangs terlebih dahulu sebelum menjalankan PenjualanSeeder.');
            return;
        }

        // Buat 10 penjualan
        for ($i = 0; $i < 10; $i++) {
            $pelanggan = $pelanggans->random();
            $subtotal = 0;

            // Buat data penjualan
            $penjualan = Penjualan::create([
                'pelanggan_id' => $pelanggan->id,
                'subtotal' => 0, // sementara 0, akan dihitung setelah item ditambahkan
            ]);

            // Tambahkan 1-3 item
            $jumlahItem = rand(1, 3);
            for ($j = 0; $j < $jumlahItem; $j++) {
                $barang = $barangs->random();
                $qty = rand(1, 5);
                $subtotal += $barang->harga * $qty;

                Item_Penjualan::create([
                    'penjualan_id' => $penjualan->id,
                    'barang_id' => $barang->id,
                    'qty' => $qty,
                ]);
            }

            // Update subtotal setelah semua item dimasukkan
            $penjualan->update(['subtotal' => $subtotal]);
        }

        $this->command->info('✅ Seeder penjualans dan item_penjualans berhasil dibuat.');
    }
}
