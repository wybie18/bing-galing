<?php

use App\Http\Controllers\PlayerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('games/{game:game_code}')->group(function () {
    
    Route::post('/join', [PlayerController::class, 'joinGame'])
        ->name('games.join');
    
    Route::post('/resume', [PlayerController::class, 'resumeGame'])
        ->name('games.resume');
    
    Route::get('/player', [PlayerController::class, 'show'])
        ->name('games.player.show');
    
    Route::post('/cross-word', [PlayerController::class, 'crossWord'])
        ->name('games.player.cross-word');
    
    Route::post('/claim-bingo', [PlayerController::class, 'claimBingo'])
        ->name('games.player.claim-bingo');
    
    Route::post('/leave', [PlayerController::class, 'leaveGame'])
        ->name('games.player.leave');
    
    Route::get('/status', [PlayerController::class, 'gameStatus'])
        ->name('games.status');
    
    Route::get('/leaderboard', [PlayerController::class, 'leaderboard'])
        ->name('games.leaderboard');
});