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
        $articles = Article::with('user')->get();
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
            'foto' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['author_id'] = auth()->id();

        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('public/articles');
            $data['foto'] = Storage::url($fotoPath);
        } else {
            $data['foto'] = null; // Ensure foto is explicitly null if no file is uploaded
        }

        $article = Article::create($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Article created successfully',
            'data' => $article
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
            'foto' => 'nullable|string',
        ]);

        $data = $request->all();

        if ($request->hasFile('foto')) {
            // Delete old photo if it exists
            if ($article->foto) {
                Storage::delete(str_replace('/storage', 'public', $article->foto));
            }
            $fotoPath = $request->file('foto')->store('public/articles');
            $data['foto'] = Storage::url($fotoPath);
        } else if ($request->has('foto_url')) {
            // If foto_url is present, it means an existing image is being kept
            $data['foto'] = $request->input('foto_url');
        } else {
            // If no new file and no foto_url, assume foto should be cleared
            $data['foto'] = null;
        }

        $article->update($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Article updated successfully',
            'data' => $article
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
            Storage::delete(str_replace('/storage', 'public', $article->foto));
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