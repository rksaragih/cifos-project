<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;

Route::post('/admin/login', [AdminController::class, 'login']);
