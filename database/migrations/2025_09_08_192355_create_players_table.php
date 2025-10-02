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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('session_id')->unique();
            $table->json('bingo_card');
            $table->json('crossed_words')->default('[]');
            $table->enum('status', ['joined', 'playing', 'won', 'disconnected'])->default('joined');
            $table->timestamp('joined_at');
            $table->timestamp('won_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
