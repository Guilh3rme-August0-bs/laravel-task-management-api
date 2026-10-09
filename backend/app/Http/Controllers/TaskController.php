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
        $validator = Validator::make($request->all(), [
            'per_page' => ['nullable', 'in:10,20,25,50,100'],
            'sort_by' => ['nullable', 'string', 'in:id,tarefa,descricao,status,prioridade,created_at,updated_at,user.name'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
            'filter_id' => ['nullable', 'integer'],
            'filter_tarefa' => ['nullable', 'string'],
            'filter_status' => ['nullable', 'string', 'in:PENDENTE,EM_ANDAMENTO,CONCLUIDA'],
            'filter_prioridade' => ['nullable', 'string', 'in:BAIXA,MEDIA,ALTA'],
            'filter_usuario' => ['nullable', 'string'],
            'filter_criado_em' => ['nullable', 'date'],
            'filter_atualizado_em' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 422);
        }

        $query = Task::where('user_id', auth('api')->id())
            ->with('user');

        // Aplicar filtros
        if ($request->filled('filter_id')) {
            $query->where('id', $request->filter_id);
        }

        if ($request->filled('filter_tarefa')) {
            $query->where('tarefa', 'like', '%'.$request->filter_tarefa.'%');
        }

        if ($request->filled('filter_status')) {
            $query->where('status', $request->filter_status);
        }

        if ($request->filled('filter_prioridade')) {
            $query->where('prioridade', $request->filter_prioridade);
        }

        if ($request->filled('filter_criado_em')) {
            $query->whereDate('created_at', $request->filter_criado_em);
        }

        if ($request->filled('filter_atualizado_em')) {
            $query->whereDate('updated_at', $request->filter_atualizado_em);
        }

        // Aplicar ordenação
        if ($request->has('sort_by') && $request->has('sort_order')) {
            $sortBy = $request->sort_by;
            $sortOrder = $request->sort_order;

            // Para campos relacionados (user.name)
            if ($sortBy === 'user.name') {
                $query->join('users', 'tasks.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortOrder)
                    ->select('tasks.*');
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        }

        $task = $query->paginate($request->per_page ?? 10);

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
        $dados['user_id'] = auth('api')->user()->user_id;

        $task = Task::create($dados);

        return response()->json([
            'nova_tarefa' => $task,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::where('user_id', auth('api')->id())
            ->with('user')
            ->findOrFail($id);

        return response()->json([
            'tarefa selecionada:' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, string $id)
    {
        $task = Task::where('user_id', auth('api')->id())
            ->with('user')
            ->findOrFail($id);

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
        $task = Task::where('user_id', auth('api')->id())
            ->with('user')
            ->findOrFail($id);

        $task->delete();

        return response()->json([
            'tarefa excluída' => $task,
        ]);
    }
}
