<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Penjualan;

class Pelanggan extends Model
{
    protected $guarded = ['id'];

    public function penjualans()
    {
        return $this->hasMany(Penjualan::class);
    }
}
