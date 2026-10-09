<?php

use App\Http\Controllers\DIController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('login', function (Request $request) {
    
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);
    
    $user = User::where('email', $request->email)->first();
    
    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Credenciais inválidas',
        ], 401);
    }
    
    $token = $user->createToken('my-app-token')->accessToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
});

Route::apiResource('tasks', TaskController::class)->middleware('auth:api');
Route::get('service', [DIController::class, 'store']);

Route::get('users', [UserController::class, 'getUser']);
Route::post('users', [UserController::class, 'createUser']);
Route::delete('users/{id}', [UserController::class, 'deleteUser']);

Route::get('stats', [StatsController::class, 'getStats']);

// rota para testar HTTP requests
Route::post('request', [RequestController::class, 'takeReqData']);
