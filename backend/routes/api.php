<?php

use App\Http\Controllers\DIController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\StatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;   
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\UserController;

Route::get('/', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('login', function (Request $request) {
    //Validar os dados recebidos
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    //Buscar o usuário pelo email
    $user = User::where('email', $request->email)->first();

    //Verificar se o usuário existe e se a senha está correta
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Credenciais inválidas'
        ], 401);
    }

    // 4. Gerar o token de acesso
    $token = $user->createToken('my-app-token')->accessToken;

    // 5. Retornar o token e os dados do usuário
    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
});

Route::apiResource('tasks', TaskController::class)->middleware('auth:api');
Route::get('service', [DIController::class, 'store']);

Route::get('users', [UserController::class, 'getUser']);
Route::post('users', [UserController::class, 'createUser']);
Route::delete('users/{id}', [UserController::class, 'deleteUser']);

Route::get('stats', [StatsController::class, 'getStats']);

//rota para testar HTTP requests
Route::post('request', [RequestController::class, 'takeReqData']);
