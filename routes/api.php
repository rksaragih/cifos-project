<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\BlackoutController;

// Publicly accessible routes for Menu
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/recommended', [MenuController::class, 'getRecommendedMenus']);
Route::get('/menus/best-seller', [MenuController::class, 'getBestSellerMenus']);
Route::get('/menus/search', [MenuController::class, 'search']);
Route::get('/menus/filter-by-category', [MenuController::class, 'filterByCategory']);
Route::get('/menus/recommended-by-category', [MenuController::class, 'getRecommendedMenusByCategory']);
Route::get('/menus/best-seller-by-category', [MenuController::class, 'getBestSellerMenusByCategory']);
Route::get('/menus/speciality', [MenuController::class, 'getSpecialityMenus']);
Route::get('/menus/count', [MenuController::class, 'countAllMenus']);
Route::get('/menus/{menu}', [MenuController::class, 'show']);

// Publicly accessible routes for Category
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Publicly accessible routes for Article
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/search', [ArticleController::class, 'search']);
Route::get('/articles/count', [ArticleController::class, 'countAllArticles']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);

// Publicly accessible routes for Reservation
Route::prefix('reservations')->group(function () {
    Route::post('/process', [ReservationController::class, 'process']);
    Route::get('/success/{kode_reservasi}', [ReservationController::class, 'success']);
    Route::post('/cancel/{kode_reservasi}', [ReservationController::class, 'cancel']);
});

// Publicly accessible route for Send Email
Route::post('/contact', [UploadController::class, 'sendEmail']);

// Publicly accessible route for checking blackout dates
Route::get('/blackout-dates/check/{date}', [BlackoutController::class, 'checkDate']);

// Admin Authentication
Route::post('/admin/login', [AdminController::class, 'login']);
Route::middleware('auth:sanctum')->post('/admin/logout', [AdminController::class, 'logout']);

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Admin-only routes for Menu
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
    Route::post('/uploads', [UploadController::class, 'menuFoto']);
    
    // Admin-only routes for Category
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    
    // Admin-only routes for Article
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{article}', [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);
    Route::post('/uploads/artikel', [UploadController::class, 'artikelFoto']);
    
    // Admin-only routes for Reservation
    Route::prefix('admin/reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::get('/statistics', [ReservationController::class, 'statistics']);
        Route::get('/export', [ReservationController::class, 'export']);
        Route::put('/{kode_reservasi}/menus', [ReservationController::class, 'updateMenus']);
        Route::get('/{kode_reservasi}', [ReservationController::class, 'show']);
        Route::put('/{kode_reservasi}', [ReservationController::class, 'update']);
        Route::delete('/{kode_reservasi}', [ReservationController::class, 'destroy']);
    });

    // Admin-only routes for Blackout Dates
    Route::get('/blackout-dates', [BlackoutController::class, 'index']);
    Route::post('/blackout-dates', [BlackoutController::class, 'store']);
    Route::post('/blackout-dates/add', [BlackoutController::class, 'addDate']);
    Route::delete('/blackout-dates/{date}', [BlackoutController::class, 'removeDate']);
    Route::delete('/blackout-dates', [BlackoutController::class, 'clearAll']);
});

// Public route to get all blackout dates (untuk public reservation page)
Route::get('/blackout-dates', [BlackoutController::class, 'index']);