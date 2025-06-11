<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommentsController extends Controller
{
    public function index()
    {
        return Comment::with(['user', 'artikel'])->get();
    }

    public function show($id)
    {
        $comment = Comment::with(['user', 'artikel'])->find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
        return $comment;
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'Artikel_ID' => 'required|exists:artikel,Artikel_ID',
            'Comments'   => 'required|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        // Simpan comment baru
        $comment = Comment::create([
            'Artikel_ID' => $request->input('Artikel_ID'),
            'Comments'   => $request->input('Comments'),
            'User_ID'    => $user->User_ID,
        ]);

        // Reload comment dengan relasi user dan artikel untuk response
        $comment = Comment::with(['user', 'artikel'])->find($comment->Comments_ID);

        return response()->json($comment, 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $user = JWTAuth::parseToken()->authenticate();
        if ($comment->User_ID !== $user->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->validate($request, [
            'Comments' => 'required|string',
        ]);

        $comment->Comments = $request->input('Comments');
        $comment->save();

        // Reload dengan relasi
        $comment = Comment::with(['user', 'artikel'])->find($id);

        return response()->json($comment);
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $user = JWTAuth::parseToken()->authenticate();
        if ($comment->User_ID !== $user->User_ID) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }

    public function getByArtikelId($artikel_ID)
    {
        return Comment::with(['user', 'artikel'])
            ->where('Artikel_ID', $artikel_ID)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
