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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('game_code', 6)->unique(); // 6-digit game code
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('word_bank_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['waiting', 'active', 'paused', 'finished'])->default('waiting');
            $table->integer('max_players')->default(30);
            $table->json('game_settings')->nullable(); // Store additional game settings
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
