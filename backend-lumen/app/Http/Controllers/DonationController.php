<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class DonationController extends Controller
{
    public function index()
    {
        // Return all donations with user data eager loaded
        $donations = Donation::with('user')->get();
        return response()->json($donations);
    }

    public function show($id)
    {
        $donation = Donation::with('user')->find($id);
        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }
        return response()->json($donation);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'Nominal' => 'required|numeric|min:1',
            'Catatan' => 'nullable|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        $donation = Donation::create([
            'Nominal' => $request->input('Nominal'),
            'Catatan' => $request->input('Catatan'),
            'User_ID' => $user->User_ID,
        ]);

        return response()->json($donation, 201);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'Nominal' => 'required|numeric|min:1',
            'Catatan' => 'nullable|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();
        $donation = Donation::find($id);

        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        // Check if current user is owner of the donation
        if ($donation->User_ID != $user->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $donation->update([
            'Nominal' => $request->input('Nominal'),
            'Catatan' => $request->input('Catatan'),
        ]);

        return response()->json($donation);
    }

    public function destroy($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $donation = Donation::find($id);

        if (!$donation) {
            return response()->json(['message' => 'Donation not found'], 404);
        }

        if ($donation->User_ID != $user->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $donation->delete();
        return response()->json(['message' => 'Donation deleted']);
    }
}
