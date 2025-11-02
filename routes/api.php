<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\CategoryController;

//test
// Admin route
Route::post('/admin/login', [AdminController::class, 'login']);
Route::middleware('auth:sanctum')->post('/admin/logout', [AdminController::class, 'logout']);

// Publicly accessible routes for Menu
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/recommended', [MenuController::class, 'getRecommendedMenus']);
Route::get('/menus/best-seller', [MenuController::class, 'getBestSellerMenus']);
Route::get('/menus/search', [MenuController::class, 'search']);
Route::get('/menus/filter-by-category', [MenuController::class, 'filterByCategory']);
Route::get('/menus/recommended-by-category', [MenuController::class, 'getRecommendedMenusByCategory']);
Route::get('/menus/best-seller-by-category', [MenuController::class, 'getBestSellerMenusByCategory']);
Route::get('/menus/{menu}', [MenuController::class, 'show']);

// Admin-only routes for Menu
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
});

// Publicly accessible routes for Category
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Admin-only routes for Category
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});
