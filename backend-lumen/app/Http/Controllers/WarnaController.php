<?php

namespace App\Http\Controllers;

use App\Models\Warna;
use Illuminate\Http\Request;

class WarnaController extends Controller
{
    public function index()
    {
        return response()->json(Warna::all());
    }

    public function show($id)
    {
        $warna = Warna::find($id);
        if (!$warna) {
            return response()->json(['message' => 'Warna tidak ditemukan'], 404);
        }
        return response()->json($warna);
    }

    public function store(Request $request)
    {
        $warna = Warna::create($request->only(['Nama', 'Kode_Warna']));
        return response()->json($warna, 201);
    }

    public function update(Request $request, $id)
    {
        $warna = Warna::find($id);
        if (!$warna) {
            return response()->json(['message' => 'Warna tidak ditemukan'], 404);
        }

        $warna->update($request->only(['Nama', 'Kode_Warna']));
        return response()->json($warna);
    }

    public function destroy($id)
    {
        $warna = Warna::find($id);
        if (!$warna) {
            return response()->json(['message' => 'Warna tidak ditemukan'], 404);
        }

        $warna->delete();
        return response()->json(['message' => 'Warna berhasil dihapus']);
    }
}
