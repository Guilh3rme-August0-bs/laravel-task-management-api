<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['tarefa', 'descricao', 'status', 'prioridade', 'user_id'];
    protected $guarded = ['id'];
    protected $date = ['created_at', 'updated_at'];

    public function user()
    {
        /* houve uma migration desnecessária para renomear a coluna user_id na tabela Users, 
        por isso o select para pegar apenas o user_id e o name */

        /* Laravel já relacionaria id(users) a user_id(tasks) automaticamente quando usasse belongsTo
         e hasMany */

        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name');
    }
}
