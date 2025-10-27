<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;

// Admin login route
Route::post('/admin/login', [AdminController::class, 'login']);

// Publicly accessible routes for Menu
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{menu}', [MenuController::class, 'show']);

// Admin-only routes for Menu
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
});
