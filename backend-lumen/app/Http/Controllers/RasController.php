<?php

namespace App\Http\Controllers;

use App\Models\Ras;
use Illuminate\Http\Request;

class RasController extends Controller
{
    public function index()
    {
        return response()->json(Ras::all());
    }

    public function show($id)
    {
        $ras = Ras::find($id);
        if (!$ras) {
            return response()->json(['message' => 'Ras tidak ditemukan'], 404);
        }
        return response()->json($ras);
    }

    public function store(Request $request)
    {
        $ras = Ras::create($request->only(['Nama', 'Asal', 'Ciri_Khas']));
        return response()->json($ras, 201);
    }

    public function update(Request $request, $id)
    {
        $ras = Ras::find($id);
        if (!$ras) {
            return response()->json(['message' => 'Ras tidak ditemukan'], 404);
        }

        $ras->update($request->only(['Nama', 'Asal', 'Ciri_Khas']));
        return response()->json($ras);
    }

    public function destroy($id)
    {
        $ras = Ras::find($id);
        if (!$ras) {
            return response()->json(['message' => 'Ras tidak ditemukan'], 404);
        }

        $ras->delete();
        return response()->json(['message' => 'Ras berhasil dihapus']);
    }
}
