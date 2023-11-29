<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Tymon\JWTAuth\Http\Middleware\Authenticate;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->withoutMiddleware(Authenticate::class)->group(function () {
    Route::post('/register', [AuthController::class, "register"]);
    Route::post('/login', [AuthController::class, "login"]);
    Route::get('/logout', [AuthController::class, "logout"]);
});
Route::get('/check-role', [AuthController::class, "checkRole"]);

Route::get('/articles', [HomeController::class, "getArticles"])->withoutMiddleware(Authenticate::class);
Route::get('/categories', [CategoryController::class, "getCategories"])->withoutMiddleware(Authenticate::class);

Route::prefix('admin')->middleware("is_admin")->group(function () {
    Route::prefix('article')->group(function () {
        Route::get('/{id}', [AdminController::class, "edit"]);
        Route::post('/update', [AdminController::class, "update"]);
        Route::post('/delete', [AdminController::class, "delete"]);
    });

    Route::prefix('category')->group(function () {
        Route::post('/create', [AdminController::class, "categoryStore"]);
        Route::get('/{id}', [AdminController::class, "categoryEdit"]);
        Route::post('/update', [AdminController::class, "categoryUpdate"]);
        Route::post('/delete', [AdminController::class, "categoryDelete"]);
    });

});




