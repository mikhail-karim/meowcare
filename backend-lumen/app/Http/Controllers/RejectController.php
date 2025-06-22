<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class RejectController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'Pengajuan_ID' => 'required|exists:pengajuans,Pengajuan_ID',
        ]);

        // Ambil admin dari payload JWT
        $payload = JWTAuth::parseToken()->getPayload();
        $admin_id = $payload->get('sub');
        $admin = \App\Models\Admin::find($admin_id);

        if (!$admin) {
            return response()->json(['message' => 'Admin tidak ditemukan'], 404);
        }

        $pengajuan = \App\Models\Pengajuan::with('pet')->find($request->Pengajuan_ID);
        if (!$pengajuan) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        if ($pengajuan->Approved !== Pengajuan::STATUS_PENDING) {
            return response()->json(['message' => 'Pengajuan sudah diproses.'], 409);
        }

        // Tandai pengajuan sebagai ditolak (Approved = 2)
        $pengajuan->Approved = Pengajuan::STATUS_REJECTED;
        $pengajuan->save();

        return response()->json([
            'message' => 'Pengajuan berhasil ditolak',
            'pengajuan' => $pengajuan
        ], 200);
    }
} 