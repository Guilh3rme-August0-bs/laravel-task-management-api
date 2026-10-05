<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //$task = Task::all();
        $validator = Validator::make($request->all(), [
            'per_page' => ['nullable', 'in:10,20,25,50,100'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 422);
        }
        $task = Task::with('user')->paginate($request->per_page ?? 10);
        return response()->json([
            'tarefas:' => $task,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'tarefa' => ['required', 'string', 'max:50', 'unique:tasks,tarefa'],
            'descricao' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:PENDENTE,EM_ANDAMENTO,CONCLUIDA'],
            'prioridade' => ['required', 'in:BAIXA,MEDIA,ALTA'],
        ]);

        if ($validator->fails()) {

            return response()->json([
                'erro' => $validator->errors(),
                // OUTRA ALTERNATIVA:
                // "messages"=>$validator->messages()
            ]);
        }

        $dados = $validator->validated();
        $dados['user_id'] = auth('api')->user()->id;

        $task = Task::create($dados);

        return response()->json([
            'tarefa criada' => $task,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::with('user')->get();
        $task = $task->findOrFail($id);

        return response()->json([
            'tarefa selecionada:' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, string $id)
    {
        $task = Task::with('user')->get();
        $task = $task->findOrFail($id);

        $task->update($request->all());

        return response()->json([
            'tarefa atualizada' => $task,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::with('user')->get();
        $task = $task->findOrFail($id);

        $task->delete();

        return response()->json([
            'tarefa excluída' => $task,
        ]);
    }
}
