<?php

use App\Http\Controllers\PelangganController;
use App\Http\Controllers\BarangController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenjualanController;

// test route
Route::get('/test', function () {
    return response()->json(['message' => 'API bekerja dengan baik'], 200);
});

// pelanggan routes
Route::get("/pelanggan", [PelangganController::class, 'index']);
Route::post("/pelanggan", [PelangganController::class, 'store']);
Route::get("/pelanggan/{id}", [PelangganController::class, 'show']);
Route::put("/pelanggan/{id}", [PelangganController::class, 'update']);
Route::delete("/pelanggan/{id}", [PelangganController::class, 'destroy']);

// barang routes 
Route::get("/barang", [BarangController::class, 'index']);
Route::post("/barang", [BarangController::class, 'store']);
Route::get("/barang/{id}", [BarangController::class, 'show']);
Route::put("/barang/{id}", [BarangController::class, 'update']);
Route::delete("/barang/{id}", [BarangController::class, 'destroy']);

// penjualan routes
Route::get("/penjualan", [PenjualanController::class, 'index']);
Route::post("/penjualan", [PenjualanController::class, 'store']);
Route::get("/penjualan/{id}", [PenjualanController::class, 'show']);
Route::put("/penjualan/{id}", [PenjualanController::class, 'update']);
Route::delete("/penjualan/{id}", [PenjualanController::class, 'destroy']);
