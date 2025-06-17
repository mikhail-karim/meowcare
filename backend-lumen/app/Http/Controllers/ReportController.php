<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;

class ReportController extends Controller
{

    // Menampilkan list report yang Rescued = false dan User_ID sesuai dengan user yang login
    public function index()
    {
        $userId = Auth::user()->User_ID;
        $reports = Report::where('User_ID', $userId)->where('Rescued', false)->get();

        return response()->json($reports, 200);
    }

    public function allreport()
    {
        $reports = Report::with('user')->get();

        return response()->json([
            'success' => true,
            'message' => 'List semua laporan',
            'data' => $reports
        ], 200);
    }

    // Menampilkan detail report
    public function show($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }
        return response()->json($report, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Deskripsi' => 'required|string',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Rescued' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'reports';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto'] = "images/{$folder}/{$filename}";
        } else {
            $data['Foto'] = "images/reports/default.png"; // set default photo path
        }

        $data['User_ID'] = Auth::user()->User_ID;
        $data['Rescued'] = $data['Rescued'] ?? false;

        $report = Report::create($data);

        return response()->json($report, 201);
    }

    public function update(Request $request, $id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        // Pastikan hanya user pemilik yang bisa update
        if ($report->User_ID !== Auth::user()->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'Deskripsi' => 'sometimes|required|string',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'Rescued' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $folder = 'reports';
            $path = app()->basePath('public/images/' . $folder);

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $file->move($path, $filename);
            $data['Foto'] = "images/{$folder}/{$filename}";
        }

        $report->update($data);

        return response()->json($report, 200);
    }


    public function updateRescuedStatus($reportId)
    {
        // Ambil admin dari payload JWT
        $payload = JWTAuth::parseToken()->getPayload();
        $admin_id = $payload->get('sub');
        $admin = \App\Models\Admin::find($admin_id);

        if (!$admin) {
            return response()->json(['message' => 'Admin tidak ditemukan'], 404);
        }

        $report = Report::find($reportId);
        if (!$report) {
            return response()->json(['message' => 'Report tidak ditemukan'], 404);
        }

        $report->Rescued = true;
        $report->save();

        return response()->json(['message' => 'Status Rescued diperbarui menjadi true', 'report' => $report], 200);
    }

    // Delete laporan
    public function destroy($id)
    {
        $report = Report::find($id);
        if (!$report) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        // Pastikan hanya user pemilik yang bisa hapus
        if ($report->User_ID !== Auth::user()->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report->delete();

        return response()->json(['message' => 'Report deleted'], 200);
    }

    // Mendapatkan laporan yang sudah direscue (Rescued = true)
    public function getRescued()
    {
        $reports = Report::where('Rescued', true)->get();
        return response()->json($reports, 200);
    }

    // Mendapatkan laporan yang belum direscue (Rescued = false)
    public function getNotRescued()
    {
        $reports = Report::where('Rescued', false)->get();
        return response()->json($reports, 200);
    }
}
