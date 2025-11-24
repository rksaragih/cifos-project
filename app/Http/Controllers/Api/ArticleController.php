<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller{
    
    public function index()
    {
        $articles = Article::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($articles);
    }

    public function show(Article $article)
    {
        return response()->json($article->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'foto' => 'nullable|string', // URL dari upload terpisah
        ]);

        $data = $request->all();
        $data['author_id'] = auth()->id();
        
        // Foto sudah berupa URL dari endpoint /api/uploads/artikel
        // Tidak perlu proses upload lagi di sini
        if (!isset($data['foto']) || empty($data['foto'])) {
            $data['foto'] = null;
        }

        $article = Article::create($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Article created successfully',
            'data' => $article->load('user')
        ], 201);
    }

    public function update(Request $request, Article $article)
    {
        // Check if the authenticated user is the author of the article
        if ($request->user()->id !== $article->author_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to update this article.'
            ], 403);
        }

        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'isi' => 'sometimes|required|string',
            'foto' => 'nullable|string', // URL string
        ]);

        $data = $request->only(['judul', 'isi']);

        // Handle foto update
        $newFoto = $request->input('foto');
        $oldFoto = $article->foto;

        // Cek apakah foto berubah (termasuk dari ada ke null, atau dari null ke ada, atau ganti URL)
        if ($newFoto !== $oldFoto) {
            // Hapus foto lama jika ada
            if ($oldFoto) {
                // Extract path from URL (supports full URL or /storage/...)
                $parsedPath = parse_url($oldFoto, PHP_URL_PATH);
                if ($parsedPath) {
                    // Remove leading /storage/ if present
                    $relative = preg_replace('#^/storage/#', '', $parsedPath);
                } else {
                    // Fallback: strip any leading /storage/ or /storage
                    $relative = preg_replace('#^/storage/?#', '', $oldFoto);
                }

                if ($relative && Storage::disk('public')->exists($relative)) {
                    Storage::disk('public')->delete($relative);
                }
            }
            // Set foto baru (bisa null atau URL baru)
            $data['foto'] = $newFoto;
        }

        $article->update($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Article updated successfully',
            'data' => $article->load('user')
        ]);
    }

    public function destroy(Article $article)
    {
        // Check if the authenticated user is the author of the article
        if (auth()->id() !== $article->author_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to delete this article.'
            ], 403);
        }

        // Delete the associated photo if it exists
        if ($article->foto) {
            $parsedPath = parse_url($article->foto, PHP_URL_PATH);
            if ($parsedPath) {
                $relative = preg_replace('#^/storage/#', '', $parsedPath);
            } else {
                $relative = preg_replace('#^/storage/?#', '', $article->foto);
            }

            if ($relative && Storage::disk('public')->exists($relative)) {
                Storage::disk('public')->delete($relative);
            }
        }

        $article->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Article deleted successfully'
        ], 200);
    }

    public function search(Request $request)
    {
        $request->validate([
            'title' => 'sometimes|required|string|min:1',
            'topic' => 'sometimes|required|string|min:1',
        ]);

        $query = Article::with('user');

        if ($request->has('title')) {
            $title = $request->input('title');
            $query->where('judul', 'like', '%' . $title . '%');
        }

        if ($request->has('topic')) {
            $topic = $request->input('topic');
            $query->where('topik', $topic);
        }

        $articles = $query->get();

        if ($articles->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No articles found with the given criteria.',
                'data' => []
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Articles found successfully',
            'data' => $articles
        ]);
    }

    public function countAllArticles()
    {
        $count = Article::count();
        return response()->json(['total_articles' => $count]);
    }
}