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

        if ($request->hasFile('Foto_Profil')) {
            $file = $request->file('Foto_Profil');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'profile';
            $path = public_path("images/{$folder}");

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto_Profil'] = "images/{$folder}/{$filename}";
        } else {
            $data['Foto_Profil'] = "images/profile/default.jpg";
        }

        $user = User::create($data);
        $customClaims = ['role' => 'user'];
        $token = JWTAuth::fromUser($user, $customClaims);

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('Email', 'Password');
        $token = auth('user')->attempt([
            'Email' => $credentials['Email'],
            'password' => $credentials['Password']
        ]);

        if (!$token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth('user')->user();
        $customClaims = ['role' => 'user'];
        $token = JWTAuth::fromUser($user, $customClaims);

        return response()->json(['token' => $token, 'user' => $user]);
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
            'Password'
        ]);

        if (isset($data['Password'])) {
            $data['Password'] = Hash::make($data['Password']);
        }

        if ($request->hasFile('Foto_Profil')) {
            $file = $request->file('Foto_Profil');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = public_path('images/profile');

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto_Profil'] = 'images/profile/' . $filename;
        }

        $user->update($data);

        return response()->json($user);
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

        if ($user->Role === 'Owner') {
            return response()->json(['message' => 'Role already Owner, cannot be changed again'], 403);
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
}
