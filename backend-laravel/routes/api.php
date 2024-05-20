<?php

use App\Http\Controllers\API\Admin\UserController as AdminUserController;
use App\Http\Controllers\API\Admin\ReportUserController as AdminReportUserController;
use App\Http\Controllers\API\ReportUserController;
use App\Http\Controllers\API\TypeReportController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\VideosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group([
    'middleware' => ['api', 'jwt.auth:api'],
    'prefix' => 'v1'
], function ($router) {
    Route::resource('reports', ReportUserController::class)->only([
        'store'
    ]);
    Route::resource('videos', VideosController::class)->only([
        'store'
    ]);
    Route::post('user/changepassword', [UserController::class, 'changePassword']);
    Route::post('videos/{video}', [VideosController::class, 'updateVideoDetail']);
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'v1'
], function ($router) {
    Route::resource('typereport', TypeReportController::class)->only([
        'index'
    ]);
});

Route::group([
    'middleware' => ['api', 'jwt.auth.admin'],
    'prefix' => 'v1/admin'
], function ($router) {
    Route::resource('reports', AdminReportUserController::class)->only([
        'index', 'update'
    ]);
    Route::resource('users', AdminUserController::class)->only([
        'update', 'show'
    ]);
    Route::post('reports/delete', [AdminReportUserController::class, 'destroyByIds']);
});
