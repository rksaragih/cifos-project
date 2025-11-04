<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use App\Models\Category;

//test  
class MenuController extends Controller
{
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

        $menu = Menu::create($request->all());
        return response()->json($menu, 201);
    }

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

        $data = array_filter($request->all(), fn($v) => $v !== null && $v !== '');
        $menu->update($data);

        return response()->json([
            'message' => 'Menu Updated Succesfully',
            'data' => $menu
        ]);
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return response()->json(['message' => 'Menu deleted successfully'], 200);
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
        $specialityCategory = Category::where('nama', 'Speciality')->first();

        if (!$specialityCategory) {
            return response()->json([], 404);
        }

        $menus = Menu::where('kategori_id', $specialityCategory->id)->with('category')->get();

        return response()->json($menus);
    }
}
