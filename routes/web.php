<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di bawah ini contoh dua pendekatan:
| 1. Semua route diarahkan ke React (SPA penuh)
| 2. Hybrid antara Blade dan React
|
*/

// === 1. Untuk SPA penuh (semua route ke React) ===
// Route::get('/{any}', function () {
//     return view('app');
// })->where('any', '.*');


// === 2. Hybrid: Blade untuk halaman utama, React untuk bagian tertentu ===
// Route::get('/', function () {
//     return view('welcome'); // Blade view
// });

// Route::get('/app/{any?}', function () {
//     return view('app'); // React SPA
// })->where('any', '.*');

// === Semua route mengarah ke React SPA ===
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
