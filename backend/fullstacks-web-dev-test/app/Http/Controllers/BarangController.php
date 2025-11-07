<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $per_pages = $request->query('per_pages', 5);
            $data = Barang::paginate($per_pages);

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
                'message' => 'gagal fetch barang data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validatedData = $request->validate([
                'nama_barang' => 'required|string|max:255',
                'kategori' => 'required|string|max:255',
                'harga' => 'required|numeric|min:0',
            ]);

            $barang = Barang::create($validatedData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $barang,
            ], 201);
        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $barang = Barang::find($id);

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Barang not found',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $barang,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'gagal fetch barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $barang = Barang::find($id);

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Barang not found',
                ], 404);
            }

            $validatedData = $request->validate([
                'nama_barang' => 'sometimes|required|string|max:255',
                'kategori' => 'sometimes|required|string|max:255',
                'harga' => 'sometimes|required|numeric|min:0',
            ]);

            $barang->update($validatedData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $barang->fresh(), // Return fresh model
            ], 200);
        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $barang = Barang::find($id);

            if (!$barang) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Barang not found',
                ], 404);
            }

            $barang->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Barang deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
