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
        Schema::table('tasks', function (Blueprint $table) {
            // Adiciona a chave estrangeira e a coluna
            $table->foreignId('user_id')->default(2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_id', function (Blueprint $table) {
            // Remove a chave estrangeira e a coluna caso precise dar rollback
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
