<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class ArtikelController extends Controller
{
    // List semua artikel (bisa diakses publik)
    public function index()
    {
        $artikels = Artikel::all();
        return response()->json($artikels);
    }

    // Detail artikel berdasarkan ID (bisa diakses publik)
    public function show($id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }
        return response()->json($artikel);
    }

    public function getByKategori($kategori)
    {
        try {
            $artikels = Artikel::where('Kategori', $kategori)->get();

            if ($artikels->isEmpty()) {
                return response()->json(['message' => 'Tidak ada artikel ditemukan untuk kategori ini'], 404);
            }

            return response()->json($artikels, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan', 'error' => $e->getMessage()], 500);
        }
    }

    // Create artikel (hanya admin)
    public function storeAsAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Judul' => 'required|string',
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Artikel' => 'required|string',
            'Kategori' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Upload Thumbnail
        if ($request->hasFile('Thumbnail')) {
            $file = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'artikel';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['Thumbnail'] = "images/{$folder}/{$filename}";
        } else {
            $data['Thumbnail'] = "images/artikel/default.png";
        }

        $payload = JWTAuth::parseToken()->getPayload();
        $data['Admin_ID'] = $payload->get('sub');
        $data['Likes'] = 0;
        $data['View'] = 0;

        $artikel = Artikel::create($data);

        return response()->json($artikel, 201);
    }

    // Update artikel (hanya admin)
    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'Judul' => 'sometimes|required|string',
            'Thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Artikel' => 'sometimes|required|string',
            'Kategori' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Upload Thumbnail jika ada
        if ($request->hasFile('Thumbnail')) {
            $file = $request->file('Thumbnail');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'artikel';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['Thumbnail'] = "images/{$folder}/{$filename}";
        }

        $artikel->update($data);

        return response()->json($artikel);
    }

    // Delete artikel (hanya admin)
    public function destroy($id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        $artikel->delete();

        return response()->json(['message' => 'Artikel berhasil dihapus']);
    }

    // Tambah view +1 (bisa diakses publik)
    public function view($id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        $artikel->increment('View');

        return response()->json(['message' => 'View bertambah', 'View' => $artikel->View]);
    }

    // Tambah likes +1 (bisa diakses publik)
    public function likes($id)
    {
        $artikel = Artikel::find($id);
        if (!$artikel) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }
        
        // Ambil user ID dari token JWT
        $payload = JWTAuth::parseToken()->getPayload();
        $userId = $payload->get('sub');

        // Ambil list user yang sudah like, simpan sebagai array
        $likedUsers = json_decode($artikel->LikedUsers ?? '[]', true);

        if (in_array($userId, $likedUsers)) {
            // Jika user sudah like, hapus user dari list, likes berkurang 1
            $likedUsers = array_filter($likedUsers, function($uid) use ($userId) {
                return $uid != $userId;
            });
            $artikel->decrement('Likes');
            $message = 'Likes berkurang';
        } else {
            // Jika user belum like, tambahkan user ke list, likes bertambah 1
            $likedUsers[] = $userId;
            $artikel->increment('Likes');
            $message = 'Likes bertambah';
        }

        // Update kolom LikedUsers menjadi JSON baru
        $artikel->LikedUsers = json_encode(array_values($likedUsers));
        $artikel->save();

        return response()->json(['message' => $message, 'Likes' => $artikel->Likes]);
    }

}
