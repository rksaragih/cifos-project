<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // ==================== PUBLIC ENDPOINTS ====================
    
    public function index()
    {
        $menus = Menu::with('category')->get();
        return response()->json($menus);
    }

    public function filterByCategory(Request $request)
    {
        $query = Menu::with('category');

        if ($request->has('category_id')) {
            $query->where('kategori_id', $request->input('category_id'));
        }

        $menus = $query->get();

        return response()->json($menus);
    }

    public function search(Request $request)
    {
        $query = Menu::with('category');

        if ($request->has('name')) {
            $searchTerm = $request->input('name');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nama_menu', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('category', function ($q2) use ($searchTerm) {
                      $q2->where('nama', 'like', '%' . $searchTerm . '%');
                  });
            });
        }

        $menus = $query->get();

        return response()->json($menus);
    }

    public function show(Menu $menu)
    {
        return response()->json($menu->load('category'));
    }

    public function getRecommendedMenus()
    {
        $menus = Menu::where('rekomendasi', true)->with('category')->get();
        return response()->json($menus);
    }

    public function getBestSellerMenus()
    {
        $menus = Menu::where('best_seller', true)->with('category')->get();
        return response()->json($menus);
    }

    public function getRecommendedMenusByCategory(Request $request)
    {
        $query = Menu::where('rekomendasi', true)->with('category');

        if ($request->has('category_id')) {
            $query->where('kategori_id', $request->input('category_id'));
        }

        $menus = $query->get();
        return response()->json($menus);
    }

    public function getBestSellerMenusByCategory(Request $request)
    {
        $query = Menu::where('best_seller', true)->with('category');

        if ($request->has('category_id')) {
            $query->where('kategori_id', $request->input('category_id'));
        }

        $menus = $query->get();
        return response()->json($menus);
    }

    public function getSpecialityMenus()
    {
        try {
            $specialityCategory = Category::where('nama', 'Speciality')->first();

            if (!$specialityCategory) {
                return response()->json([], 404);
            }

            $menus = Menu::where('kategori_id', $specialityCategory->id)->with('category')->get();

            return response()->json($menus);
        } catch (\Exception $e) {
            Log::error('Error in getSpecialityMenus: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    public function countAllMenus()
    {
        $count = Menu::count();
        return response()->json(['total_menus' => $count]);
    }

    // ==================== ADMIN ENDPOINTS (PROTECTED) ====================

    /**
     * Store new menu (Admin)
     * POST /api/menus
     */
    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:categories,id',
            'nama_menu' => 'required|string|max:255',
            'harga_menu' => 'required|numeric',
            'foto_menu' => 'nullable|string|max:255',
            'tersedia' => 'boolean',
            'rekomendasi' => 'boolean',
            'best_seller' => 'boolean',
        ]);

        $data = $request->all();
        
        // foto_menu is already a URL string from UploadController
        $data['foto_menu'] = $request->input('foto_menu', null);

        $menu = Menu::create($data);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Menu created successfully',
            'data' => $menu->load('category')
        ], 201);
    }

    /**
     * Update menu (Admin)
     * PUT /api/menus/{menu}
     */
    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'kategori_id' => 'sometimes|exists:categories,id',
            'nama_menu' => 'sometimes|string|max:255',
            'harga_menu' => 'sometimes|numeric',
            'foto_menu' => 'sometimes|nullable|string|max:255',
            'tersedia' => 'sometimes|boolean',
            'rekomendasi' => 'sometimes|boolean',
            'best_seller' => 'sometimes|boolean',
        ]);

        $data = $request->all();

        // If foto_menu changed and old one exists, delete old photo
        if ($request->has('foto_menu') && $request->input('foto_menu') !== $menu->foto_menu) {
            if ($menu->foto_menu) {
                // Extract relative path from URL and delete from public disk
                $parsedPath = parse_url($menu->foto_menu, PHP_URL_PATH);
                if ($parsedPath) {
                    $relative = preg_replace('#^/storage/#', '', $parsedPath);
                } else {
                    $relative = preg_replace('#^/storage/?#', '', $menu->foto_menu);
                }

                if ($relative && \Illuminate\Support\Facades\Storage::disk('public')->exists($relative)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($relative);
                }
            }
        }

        // Filter out null and empty values except for booleans
        $data = array_filter($data, function($v, $k) {
            if (in_array($k, ['tersedia', 'rekomendasi', 'best_seller'])) {
                return true; // Keep boolean fields even if false
            }
            return $v !== null && $v !== '';
        }, ARRAY_FILTER_USE_BOTH);

        $menu->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Menu updated successfully',
            'data' => $menu->load('category')
        ]);
    }

    /**
     * Delete menu (Admin)
     * DELETE /api/menus/{menu}
     */
    public function destroy(Menu $menu)
    {
        // Delete the associated photo if it exists
        if ($menu->foto_menu) {
            $parsedPath = parse_url($menu->foto_menu, PHP_URL_PATH);
            if ($parsedPath) {
                $relative = preg_replace('#^/storage/#', '', $parsedPath);
            } else {
                $relative = preg_replace('#^/storage/?#', '', $menu->foto_menu);
            }

            if ($relative && \Illuminate\Support\Facades\Storage::disk('public')->exists($relative)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($relative);
            }
        }

        $menu->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Menu deleted successfully'
        ], 200);
    }
}