<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class PetController extends Controller
{
    public function index(Request $request)
    {
        $query = Pet::with(['ras', 'warna', 'user']);

        if ($request->has('search')) {
            $query->where('Nama', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $pet = Pet::with(['ras', 'warna', 'user'])->find($id);
        return $pet ? response()->json($pet) : response()->json(['message' => 'Pet not found'], 404);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Nama' => 'required|string',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Umur' => 'required|integer',
            'Jenis_Kelamin' => 'required|in:Laki-Laki,Perempuan',
            'Ras_ID' => 'required|exists:ras,Ras_ID',
            'Warna_ID' => 'required|exists:warna,Warna_ID',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Upload Foto
        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'pets';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['Foto'] = "images/{$folder}/{$filename}";
        } else {
            $data['Foto'] = "images/pets/default.png";
        }

        $data['User_ID'] = Auth::user()->User_ID;
        $data['Admin_ID'] = null;

        $pet = Pet::create($data);

        return response()->json($pet, 201);
    }

    public function storeAsAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Nama' => 'required|string',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Umur' => 'required|integer',
            'Jenis_Kelamin' => 'required|in:Laki-Laki,Perempuan',
            'Ras_ID' => 'required|exists:ras,Ras_ID',
            'Warna_ID' => 'required|exists:warna,Warna_ID',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Upload Foto
        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'pets';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['Foto'] = "images/{$folder}/{$filename}";
        } else {
            $data['Foto'] = "images/pets/default.png";
        }

        $payload = JWTAuth::parseToken()->getPayload();
        $data['Admin_ID'] = $payload->get('sub'); // biasanya ID ada di sub
        $data['User_ID'] = null;

        $pet = Pet::create($data);

        return response()->json($pet, 201);
    }

    public function update(Request $request, $id)
    {
        $pet = Pet::find($id);
        if (!$pet) return response()->json(['message' => 'Pet not found'], 404);

        $user = Auth::user();

        // Validasi kepemilikan (User atau Admin)
        $isOwner = ($pet->User_ID && $pet->User_ID == $user->User_ID) || 
                   ($pet->Admin_ID && $pet->Admin_ID == $user->Admin_ID);

        if (!$isOwner) return response()->json(['message' => 'Unauthorized'], 403);

        $validator = Validator::make($request->all(), [
            'Nama' => 'sometimes|string',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Umur' => 'sometimes|integer',
            'Jenis_Kelamin' => 'sometimes|in:Laki-Laki,Perempuan',
            'Ras_ID' => 'sometimes|exists:ras,Ras_ID',
            'Warna_ID' => 'sometimes|exists:warna,Warna_ID',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'pets';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['Foto'] = "images/{$folder}/{$filename}";
        }

        $pet->update($data);

        return response()->json($pet);
    }

    public function updateStatus(Request $request, $field, $id)
    {
        $validFields = ['Adopted', 'Divaksin', 'Sterilisasi'];

        if (!in_array($field, $validFields)) {
            return response()->json(['message' => 'Invalid status field'], 400);
        }

        $pet = Pet::find($id);
        if (!$pet) return response()->json(['message' => 'Pet not found'], 404);

        $user = Auth::user();
        $isOwner = ($pet->User_ID && $pet->User_ID == $user->User_ID) || 
                   ($pet->Admin_ID && $pet->Admin_ID == $user->Admin_ID);

        if (!$isOwner) return response()->json(['message' => 'Unauthorized'], 403);

        if ($pet->$field === true) {
            return response()->json(['message' => "$field already set to true"], 200);
        }

        $pet->$field = true;
        $pet->save();

        return response()->json(['message' => "$field updated to true successfully", 'pet' => $pet]);
    }

    public function destroy($id)
    {
        $pet = Pet::find($id);
        if (!$pet) return response()->json(['message' => 'Pet not found'], 404);

        $user = Auth::user();
        $isOwner = ($pet->User_ID && $pet->User_ID == $user->User_ID) || 
                   ($pet->Admin_ID && $pet->Admin_ID == $user->Admin_ID);

        if (!$isOwner) return response()->json(['message' => 'Unauthorized'], 403);

        $pet->delete();
        return response()->json(['message' => 'Pet deleted successfully']);
    }
}
