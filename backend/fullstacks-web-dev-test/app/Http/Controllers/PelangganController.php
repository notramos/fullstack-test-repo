<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        try {
            $per_pages = $request->query('per_pages', 5);
            $data = Pelanggan::paginate($per_pages);

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
                'message' => 'gagal fetch pelanggan data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validatedData = $request->validate([
                'nama' => 'required|string|max:255',
                'domisili' => 'required|string|max:255',
                'jenis_kelamin' => 'required|in:laki-laki,perempuan',
            ]);

            $pelanggan = Pelanggan::create($validatedData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $pelanggan,
            ], 201);
        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'gagal membuat pelanggan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $pelanggan = Pelanggan::find($id);

            if (!$pelanggan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggan not found',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $pelanggan,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'gagal fetch pelanggan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $pelanggan = Pelanggan::find($id);

            if (!$pelanggan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggan not found',
                ], 404);
            }

            $validatedData = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'domisili' => 'sometimes|required|string|max:255',
                'jenis_kelamin' => 'sometimes|required|in:laki-laki,perempuan',
            ]);

            $pelanggan_old = $pelanggan->replicate();
            $pelanggan->update($validatedData);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'data' => $pelanggan->fresh(), // Return fresh model
                'message' => 'Pelanggan updated successfully',
                'old_data' => $pelanggan_old,
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
                'message' => 'gagal update pelanggan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $pelanggan = Pelanggan::find($id);

            if (!$pelanggan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pelanggan tidak ditemukan',
                ], 404);
            }

            $pelanggan->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggan berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'gagal hapus pelanggan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
