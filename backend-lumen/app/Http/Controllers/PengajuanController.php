<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class PengajuanController extends Controller
{
    public function index()
    {
        return Pengajuan::with(['user', 'pet'])->get();
    }

    public function show($id)
    {
        $pengajuan = Pengajuan::with(['user', 'pet'])->find($id);

        if (!$pengajuan) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        return $pengajuan;
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'Alasan' => 'required|string',
            'Pet_ID' => 'required|exists:pets,Pet_ID',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        // Cek apakah hewan sudah diadopsi
        $pet = \App\Models\Pet::find($request->input('Pet_ID'));
        if ($pet->Adopted) {
            return response()->json(['message' => 'Hewan ini sudah diadopsi.'], 409);
        }

        // Cek apakah user sudah pernah mengajukan adopsi untuk hewan ini
        $existing = Pengajuan::where('User_ID', $user->User_ID)
                                        ->where('Pet_ID', $request->input('Pet_ID'))
                                        ->first();

        if ($existing) {
            return response()->json(['message' => 'Anda sudah mengajukan adopsi untuk hewan ini.'], 409);
        }

        // Buat pengajuan baru
        $pengajuan = Pengajuan::create([
            'Alasan' => $request->input('Alasan'),
            'Approved' => false,
            'User_ID' => $user->User_ID,
            'Pet_ID' => $request->input('Pet_ID'),
        ]);

        return response()->json($pengajuan, 201);
    }

    public function update(Request $request, $id)
    {
        $pengajuan = Pengajuan::find($id);

        if (!$pengajuan) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        $pengajuan->update($request->only(['Alasan', 'Approved', 'User_ID', 'Pet_ID']));

        return response()->json($pengajuan);
    }

    public function destroy($id)
    {
        $pengajuan = Pengajuan::find($id);

        if (!$pengajuan) {
            return response()->json(['message' => 'Pengajuan not found'], 404);
        }

        $pengajuan->delete();

        return response()->json(['message' => 'Pengajuan deleted']);
    }
}
