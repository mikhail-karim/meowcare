<?php

namespace App\Http\Controllers;

use App\Models\Penyakit;
use Illuminate\Http\Request;

class PenyakitController extends Controller
{
    public function index()
    {
        return response()->json(Penyakit::all());
    }

    public function show($id)
    {
        $penyakit = Penyakit::find($id);
        if (!$penyakit) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        return response()->json($penyakit);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'Nama' => 'required',
            'Gejala' => 'required',
            'Penyebab' => 'required',
            'Obat' => 'required',
        ]);

        $penyakit = Penyakit::create($request->all());
        return response()->json($penyakit, 201);
    }

    public function update(Request $request, $id)
    {
        $penyakit = Penyakit::find($id);
        if (!$penyakit) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $penyakit->update($request->all());
        return response()->json($penyakit);
    }

    public function destroy($id)
    {
        $penyakit = Penyakit::find($id);
        if (!$penyakit) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $penyakit->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
