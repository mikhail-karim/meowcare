<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class UserController extends Controller
{
    public function getAll()
    {
        return response()->json(User::all());
    }

    public function getById($id)
    {
        $user = User::find($id);
        return $user ? response()->json($user) : response()->json(['message' => 'User not found'], 404);
    }

    public function getByRole($role)
    {
        return response()->json(User::where('Role', $role)->get());
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Nama_Lengkap' => 'required|string|max:255',
            'Username' => 'required|string|unique:users',
            'Email' => 'required|email|unique:users',
            'Password' => 'required|string|min:6',
            'Foto_Profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['Password'] = Hash::make($data['Password']);
        $data['Role'] = 'Adopter';

        // Set default foto profil
        $data['Foto_Profil'] = "images/profile/default.jpg";

        // Jika ada file foto yang diupload
        if ($request->hasFile('Foto_Profil')) {
            $file = $request->file('Foto_Profil');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'profile';
            
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto_Profil'] = "images/{$folder}/{$filename}";
        }

        $user = User::create($data);
        $customClaims = ['role' => 'user'];
        $token = JWTAuth::fromUser($user, $customClaims);

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('Email', 'Password');
        $email = $credentials['Email'];

        if ($email === 'admin@admin.com') {
            // Login sebagai admin
            $token = auth('admin')->attempt([
                'Email' => $email,
                'password' => $credentials['Password']
            ]);

            if (!$token) {
                return response()->json(['message' => 'Invalid admin credentials'], 401);
            }

            $admin = auth('admin')->user();
            $token = JWTAuth::fromUser($admin, ['role' => 'admin']);

            return response()->json(['token' => $token, 'admin' => $admin]);
        } else {
            // Login sebagai user biasa
            $token = auth('user')->attempt([
                'Email' => $email,
                'password' => $credentials['Password']
            ]);

            if (!$token) {
                return response()->json(['message' => 'Invalid user credentials'], 401);
            }

            $user = auth('user')->user();
            $token = JWTAuth::fromUser($user, ['role' => 'user']);

            return response()->json(['token' => $token, 'user' => $user]);
        }
    }
    
    public function uploadProfilePhoto(Request $request)
    {
        // Validasi file dengan nama field 'photo' (pastikan sesuai nama input di frontend)
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:10048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');

            // Buat nama file unik
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Set folder tujuan
            $folder = 'profile';

            // Set path base folder public/images/profile
            $path = app()->basePath('public/images/' . $folder);

            // Cek dan buat folder jika belum ada
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Pindahkan file ke lokasi tujuan
            $file->move($path, $filename);

            // Return response sukses
            return response()->json([
                'message' => 'Foto berhasil diupload',
                'file_path' => 'images/' . $folder . '/' . $filename,
            ]);
        }

        return response()->json(['message' => 'File foto tidak ditemukan'], 400);
    }
    
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Logout successful']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to logout, token invalid or expired'], 401);
        }
    }

    public function edit(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $data = $request->only([
            'Nama_Lengkap',
            'Username',
            'Email',
            'Nomor_HP',
            'Alamat',
            'Password',
            'Foto_Profil' // tambahkan di sini agar bisa diterima sebagai string juga
        ]);

        // Jika Password ingin diubah
        if (!empty($data['Password'])) {
            $data['Password'] = Hash::make($data['Password']);
        } else {
            unset($data['Password']); // jangan update jika kosong
        }

        // Tangani jika Foto_Profil dikirim dalam bentuk file (opsional jika masih digunakan di tempat lain)
        if ($request->hasFile('Foto_Profil')) {
            $file = $request->file('Foto_Profil');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = app()->basePath('public/images/profile');

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto_Profil'] = 'images/profile/' . $filename;
        }

        // Jika Foto_Profil dikirim sebagai string (bukan file)
        if ($request->filled('Foto_Profil') && is_string($request->Foto_Profil)) {
            $data['Foto_Profil'] = $request->Foto_Profil;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user
        ]);
    }


public function changeRole(Request $request)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
    } catch (\Exception $e) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    if (!$user) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    // Jika sudah Owner, tidak lakukan apa-apa tapi tetap sukses
    if ($user->Role === 'Owner') {
        return response()->json(['message' => 'User already has Owner role. No changes made.', 'user' => $user], 200);
    }

    $user->Role = 'Owner';
    $user->save();

    return response()->json(['message' => 'Role updated to Owner.', 'user' => $user]);
}

    
    public function delete(Request $request)
    {
        $user = auth('user')->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function forgetPassword(Request $request)
    {
        // Validasi email dan password baru
        $validator = Validator::make($request->all(), [
            'Email' => 'required|email|exists:users,Email',
            'New_Password' => 'required|string|min:6|confirmed',
        ]);

        // Cari user berdasarkan email
        $user = User::where('Email', $request->Email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update password baru (hash dulu)
        $user->Password = Hash::make($request->New_Password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}