<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Handle single file upload for menu images.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:2048',
        ]);

        $file = $request->file('file');
        $path = $file->store('menus', 'public');

        // Return public URL to stored file (assumes storage:link exists)
        $url = Storage::url($path);

        return response()->json([
            'path' => $path,
            'url' => $url,
        ], 201);
    }
}
