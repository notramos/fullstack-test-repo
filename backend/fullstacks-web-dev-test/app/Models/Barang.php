<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $guarded = ['id'];

    public function itemPenjualans()
    {
        return $this->hasMany(Item_Penjualan::class);
    }
}
