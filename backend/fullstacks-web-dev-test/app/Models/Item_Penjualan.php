<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Penjualan;
use App\Models\Barang;

class Item_Penjualan extends Model
{
    protected $guarded = ['id'];

    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class);
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
