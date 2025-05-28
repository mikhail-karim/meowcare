<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    public function getAll()
    {
        return response()->json(Admin::all());
    }

    public function getById($id)
    {
        $admin = Admin::find($id);
        return $admin ? response()->json($admin) : response()->json(['message' => 'Admin not found'], 404);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Nama_Lengkap' => 'required|string|max:255',
            'Username' => 'required|string|unique:admins',
            'Email' => 'required|email|unique:admins',
            'Password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['Password'] = Hash::make($data['Password']);

        $admin = Admin::create($data);
        $token = JWTAuth::fromUser($admin, ['role' => 'admin']);

        return response()->json(['admin' => $admin, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('Email', 'Password');
        $token = auth('admin')->attempt([
            'Email' => $credentials['Email'],
            'password' => $credentials['Password']
        ]);

        if (!$token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $admin = auth('admin')->user();
        $token = JWTAuth::fromUser($admin, ['role' => 'admin']);

        return response()->json(['token' => $token, 'admin' => $admin]);
    }

    public function logout()
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
            $admin = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Admin not authenticated'], 401);
        }

        $data = $request->only([
            'Nama_Lengkap',
            'Username',
            'Email',
            'Nomor_HP',
            'Alamat',
            'Password'
        ]);

        if (isset($data['Password'])) {
            $data['Password'] = Hash::make($data['Password']);
        }

        $admin->update($data);

        return response()->json($admin);
    }

    public function delete()
    {
        $admin = auth('admin')->user();
        if (!$admin) {
            return response()->json(['message' => 'Admin not authenticated'], 401);
        }

        $admin->delete();
        return response()->json(['message' => 'Admin deleted']);
    }
}
