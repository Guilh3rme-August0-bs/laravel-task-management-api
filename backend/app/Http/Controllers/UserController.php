<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getUser()
    {
        $users = User::all();
        return response()->json([
            'usuários' => $users
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
            'usuário criado' => $user
        ]);
    }

    public function deleteUser(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json([
            'usuário deletado' => $user->name
        ]);
    }
}
