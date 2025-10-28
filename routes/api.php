<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\CategoryController;

// Admin login route
Route::post('/admin/login', [AdminController::class, 'login']);

// Publicly accessible routes for Menu
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/search', [MenuController::class, 'search']);
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
