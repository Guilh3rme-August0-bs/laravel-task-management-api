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

        // Query separada para tarefas por usuário
        $sqlPorUsuario = "
        SELECT 
            u.id AS usuario_id,
            u.name AS usuario_nome,
            COUNT(t.id) AS total_tarefas,
            COUNT(CASE WHEN t.status = 'PENDENTE' THEN 1 END) AS pendentes,
            COUNT(CASE WHEN t.status = 'EM_ANDAMENTO' THEN 1 END) AS em_andamento,
            COUNT(CASE WHEN t.status = 'CONCLUIDA' THEN 1 END) AS concluidas
        FROM users u
        LEFT JOIN tasks t ON t.user_id = u.id
        GROUP BY u.id, u.name
        ORDER BY total_tarefas DESC
    ";

        $estatisticasPorUsuario = DB::select($sqlPorUsuario);

        return response()->json([
            'geral' => $estatisticasGerais[0], // Retorna o primeiro (e único) registro
            'por_usuario' => $estatisticasPorUsuario,
        ]);
    }
}
