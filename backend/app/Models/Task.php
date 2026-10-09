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
        /* A chave primária de User é user_id (não id) */
        return $this->belongsTo(User::class, 'user_id', 'user_id')->select('user_id', 'name');
    }
}
