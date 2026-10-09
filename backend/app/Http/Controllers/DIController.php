<?php

namespace App\Http\Controllers;

use App\services\TaskService;

// Controller feito para praticar dependency injection
class DIController extends Controller
{
    // O Laravel resolve e injeta o TaskService automaticamente aqui
    public function __construct(
        protected TaskService $taskService
    ) {}

    public function store()
    {
        // método create sendo usado aqui
        $mensagem = $this->taskService->create();

        return response()->json([
            'message' => $mensagem,
        ]);
    }
}
