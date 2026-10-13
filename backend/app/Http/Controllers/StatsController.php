<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getStats()
    {
        $sql = "
        SELECT 
            -- Total geral de tarefas
            COUNT(*) AS total_tarefas,
            
            -- Total de tarefas por status
            COUNT(CASE WHEN status = 'PENDENTE' THEN 1 END) AS tarefas_pendentes,
            COUNT(CASE WHEN status = 'EM_ANDAMENTO' THEN 1 END) AS tarefas_em_andamento,
            COUNT(CASE WHEN status = 'CONCLUIDA' THEN 1 END) AS tarefas_concluidas
        FROM tasks
    ";

        $estatisticasGerais = DB::select($sql);

        return response()->json([
            'geral' => $estatisticasGerais[0], // Retorna o primeiro (e único) registro
        ]);
    }

        public function getStatsByUser()
    {
        $userId = auth('api')->id();
        $sql = "    
        SELECT 
            t.user_id AS usuario_id,
            u.name AS usuario_nome,
            COUNT(*) AS total_tarefas,
            COUNT(CASE WHEN t.status = 'PENDENTE' THEN 1 END) AS tarefas_pendentes,
            COUNT(CASE WHEN t.status = 'EM_ANDAMENTO' THEN 1 END) AS tarefas_em_andamento,
            COUNT(CASE WHEN t.status = 'CONCLUIDA' THEN 1 END) AS tarefas_concluidas
        FROM tasks t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.user_id = ?
        GROUP BY t.user_id, u.name
    ";

        $estatisticas = DB::select($sql, [$userId]);

        return response()->json($estatisticas);
    }

}
