<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('tarefa')->required();
            $table->string('descricao')->nullable();
            $table->enum('status', ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'])->default('PENDENTE');
            $table->enum('prioridade', ['BAIXA', 'MEDIA', 'ALTA'])->default('MEDIA');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
