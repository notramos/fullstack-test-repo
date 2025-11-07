<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\Barang;
use App\Models\Item_Penjualan;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PenjualanController extends Controller
{
    public function index(Request $request)
    {
        try {
            $per_pages = $request->query('per_pages', 5);
            $data = Penjualan::with(['pelanggan', 'items.barang'])->paginate($per_pages);

            return response()->json([
                'status' => 'success',
                'data' => $data->items(),
                'pagination' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total(),
                    'last_page' => $data->lastPage(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch penjualan data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $subtotal = 0;

            $validatedData = $request->validate([
                'pelanggan_id' => 'required|exists:pelanggans,id',
                'items' => 'required|array|min:1',
                'items.*.barang_id' => 'required|exists:barangs,id',
                'items.*.qty' => 'required|integer|min:1',
            ]);

            // Validate each item and calculate subtotal
            foreach ($validatedData['items'] as $item) {
                $barang = Barang::find($item['barang_id']);

                if (!$barang) {
                    DB::rollback();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Barang with ID ' . $item['barang_id'] . ' not found',
                    ], 404);
                }

                $subtotal += $barang->harga * $item['qty'];
            }

            $penjualan = Penjualan::create([
                'pelanggan_id' => $validatedData['pelanggan_id'],
                'subtotal' => $subtotal,
            ]);

            foreach ($validatedData['items'] as $item) {
                Item_Penjualan::create([
                    'penjualan_id' => $penjualan->id,
                    'barang_id' => $item['barang_id'],
                    'qty' => $item['qty'],
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $penjualan->load(['pelanggan', 'items.barang']),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $penjualan = Penjualan::with(['pelanggan', 'items.barang'])->find($id);

            if (!$penjualan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Penjualan not found',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $penjualan,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $penjualan = Penjualan::with('pelanggan', 'items.barang')->find($id);
            $subtotal = 0;

            if (!$penjualan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Penjualan not found',
                ], 404);
            }

            $validated = $request->validate([
                'pelanggan_id' => 'required|exists:pelanggans,id',
                'items' => 'required|array|min:1',
                'items.*.barang_id' => 'required|exists:barangs,id',
                'items.*.qty' => 'required|integer|min:1',
            ]);

            // Validate each item and calculate subtotal
            foreach ($validated['items'] as $item) {
                $barang = Barang::find($item['barang_id']);

                if (!$barang) {
                    DB::rollback();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Barang with ID ' . $item['barang_id'] . ' not found',
                    ], 404);
                }

                $subtotal += $barang->harga * $item['qty'];
            }

            $penjualan->update([
                'pelanggan_id' => $validated['pelanggan_id'],
                'subtotal' => $subtotal,
            ]);


            Item_Penjualan::where('penjualan_id', $penjualan->id)->delete();


            foreach ($validated['items'] as $item) {
                Item_Penjualan::create([
                    'penjualan_id' => $penjualan->id,
                    'barang_id' => $item['barang_id'],
                    'qty' => $item['qty'],
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $penjualan->load(['pelanggan', 'items.barang']),
                'message' => 'Penjualan updated successfully',
            ], 200);
        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $penjualan = Penjualan::find($id);

            if (!$penjualan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Penjualan not found',
                ], 404);
            }

            // Delete related items first
            Item_Penjualan::where('penjualan_id', $penjualan->id)->delete();

            // Then delete the penjualan
            $penjualan->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Penjualan deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete penjualan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
