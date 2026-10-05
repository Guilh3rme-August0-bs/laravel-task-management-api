<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $taskId = $this->route('task');

        return [
            'tarefa' => "required|string|max:50|unique:tasks,tarefa,{$taskId}",
            'descricao' => 'nullable|string|max:255',
            'status' => 'required|in:PENDENTE,EM_ANDAMENTO,CONCLUIDA',
            'prioridade' => 'required|in:BAIXA,MEDIA,ALTA',
        ];
    }

    public function messages(): array
    {
        return [
            'tarefa.required' => 'A tarefa é obrigatória',
            'tarefa.string' => 'A tarefa deve ser uma string',
            'tarefa.max' => 'A tarefa deve ter no máximo 50 caracteres',
            'descricao.nullable' => 'A descrição é opcional',
            'descricao.string' => 'A descrição deve ser uma string',
            'descricao.max' => 'A descrição deve ter no máximo 255 caracteres',
            'status.required' => 'O status é obrigatório',
            'status.in' => 'O status deve ser PENDENTE, EM_ANDAMENTO ou CONCLUIDA',
            'prioridade.required' => 'A prioridade é obrigatória',
            'prioridade.in' => 'A prioridade deve ser BAIXA, MEDIA ou ALTA',

        ];
    }
}
