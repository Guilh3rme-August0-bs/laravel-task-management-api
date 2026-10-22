<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getUser()
    {
        $users = User::all();

        return response()->json([
            'usuários' => $users,
        ]);
    }

    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $dados = $validator->validated();

        $user = User::create($dados);

        return response()->json([
            'usuário criado' => $user,
        ]);
    }

    public function updateUsername(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'newUsername' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        $dados = $validator->validated();

        $user = $request->user();

        if (! Hash::check($dados['password'], $user->password)) {
            return response()->json([
                'message' => 'Senha incorreta.',
            ], 401);
        }

        $user->update([
            'name' => $dados['newUsername'],
        ]);

        return response()->json([
            'usuário atualizado' => $user,
        ]);
    }

    public function deleteUser(Request $request)
    {
        $user = $request->user();

        $user->tasks()->delete();
        $user->delete();

        return response()->json([
            'usuário deletado' => $user->name,
        ]);
    }
}
