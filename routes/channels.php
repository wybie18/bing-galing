<?php

use App\Models\Game;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('game.{gameCode}', function ($user, $gameCode) {
    return true;
});

Broadcast::channel('teacher.{teacherId}', function ($user, $teacherId) {
    return (int) $user->id === (int) $teacherId;
});

Broadcast::channel('game-presence.{gameCode}', function ($user, $gameCode) {
    $game = Game::where('game_code', $gameCode)->first();
    
    if (!$game) {
        return false;
    }
    
    if ($game->teacher_id === $user->id) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => 'teacher',
        ];
    }
    
    if ($game->players()->where('user_id', $user->id)->exists()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => 'player',
        ];
    }
    
    return false;
});