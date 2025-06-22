<?php

namespace App\Http\Controllers;

use App\Models\Konfirmasi;
use App\Models\Pengajuan;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class KonfirmasiController extends Controller
{
    public function index()
    {
        return Konfirmasi::with(['admin', 'pengajuan'])->get();
    }

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

        // Tandai pengajuan sebagai approved
        $pengajuan->Approved = Pengajuan::STATUS_APPROVED;
        $pengajuan->save();

        // Tandai hewan sebagai adopted
        if ($pengajuan->pet) {
            $pengajuan->pet->Adopted = true;
            $pengajuan->pet->save();
        }

        // Simpan data konfirmasi
        $konfirmasi = \App\Models\Konfirmasi::create([
            'Admin_ID' => $admin->Admin_ID,
            'Pengajuan_ID' => $pengajuan->Pengajuan_ID,
        ]);

        return response()->json($konfirmasi, 201);
    }


    public function destroy($id)
    {
        $konfirmasi = Konfirmasi::find($id);
        if (!$konfirmasi) {
            return response()->json(['message' => 'Konfirmasi tidak ditemukan.'], 404);
        }

        // Optional: Batalkan status approved jika dihapus
        $pengajuan = $konfirmasi->pengajuan;
        if ($pengajuan) {
            $pengajuan->Approved = Pengajuan::STATUS_PENDING;
            $pengajuan->save();
        }

        $konfirmasi->delete();

        return response()->json(['message' => 'Konfirmasi dihapus dan status pengajuan dibatalkan.']);
    }
}
