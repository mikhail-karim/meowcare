<?php

namespace App\Http\Controllers;

use App\Models\RiwayatPenyakit;
use App\Models\Pet;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class RiwayatPenyakitController extends Controller
{
    public function __construct()
    {
        // Apply jwt.auth middleware to all except index & show if needed
        $this->middleware('jwt.auth');
        // The routes themselves will have role middleware applied too
    }

    // Helper to check ownership or admin access to pet
    private function checkAccessToPet($pet_id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $pet = Pet::find($pet_id);
        if (!$pet) {
            return [null, response()->json(['message' => 'Pet not found'], 404)];
        }

        // Check if logged in user is the owner (User_ID) or admin (Admin_ID) of the pet
        $hasAccess = false;
        if ($pet->User_ID && $pet->User_ID == $user->User_ID) {
            $hasAccess = true;
        } elseif ($pet->Admin_ID && $pet->Admin_ID == $user->User_ID) {
            // Assumes Admins also have User_ID; adjust if different
            $hasAccess = true;
        }

        if (!$hasAccess) {
            return [null, response()->json(['message' => 'Unauthorized: not owner of pet'], 403)];
        }
        return [$pet, null];
    }

    public function index()
    {
        // Return all riwayat penyakit with relations (could be paginated)
        return RiwayatPenyakit::with(['penyakit', 'pet'])->get();
    }

    public function show($id)
    {
        $record = RiwayatPenyakit::with(['penyakit', 'pet'])->find($id);
        if (!$record) {
            return response()->json(['message' => 'RiwayatPenyakit not found'], 404);
        }
        return $record;
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'Penyakit_ID' => 'required|exists:penyakit,Penyakit_ID',
            'Pet_ID'      => 'required|exists:pets,Pet_ID',
            'Status'      => 'required|in:sehat,diobati,sakit',
        ]);

        [$pet, $errorResponse] = $this->checkAccessToPet($request->input('Pet_ID'));
        if ($errorResponse) {
            return $errorResponse;
        }

        $riwayat = RiwayatPenyakit::create([
            'Penyakit_ID' => $request->input('Penyakit_ID'),
            'Pet_ID'      => $request->input('Pet_ID'),
            'Status'      => $request->input('Status'),
        ]);

        return response()->json($riwayat->load('penyakit', 'pet'), 201);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'Status' => 'required|in:sehat,diobati,sakit',
        ]);

        $riwayat = RiwayatPenyakit::find($id);
        if (!$riwayat) {
            return response()->json(['message' => 'RiwayatPenyakit not found'], 404);
        }

        [$pet, $errorResponse] = $this->checkAccessToPet($riwayat->Pet_ID);
        if ($errorResponse) {
            return $errorResponse;
        }

        $riwayat->Status = $request->input('Status');
        $riwayat->save();

        return response()->json($riwayat->load('penyakit', 'pet'));
    }

    public function destroy($id)
    {
        $riwayat = RiwayatPenyakit::find($id);
        if (!$riwayat) {
            return response()->json(['message' => 'RiwayatPenyakit not found'], 404);
        }

        [$pet, $errorResponse] = $this->checkAccessToPet($riwayat->Pet_ID);
        if ($errorResponse) {
            return $errorResponse;
        }

        $riwayat->delete();
        return response()->json(['message' => 'RiwayatPenyakit deleted']);
    }

    public function getByPetId($pet_id)
    {
        [$pet, $errorResponse] = $this->checkAccessToPet($pet_id);
        if ($errorResponse) {
            return $errorResponse;
        }

        $riwayats = RiwayatPenyakit::with('penyakit')->where('Pet_ID', $pet_id)->get();

        return $riwayats;
    }
}