<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WordBankController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/play', function () {
    return Inertia::render('Play');
})->name('play');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/word-banks/all', [WordBankController::class, 'getAll'])->name('word-banks.all');

    Route::resource('word-banks', WordBankController::class);
    
    Route::post('word-banks/{wordBank}/duplicate', [WordBankController::class, 'duplicate'])
        ->name('word-banks.duplicate');

    Route::prefix('word-banks/{wordBank}')->name('word-banks.')->group(function () {
        
        // Store a new word
        Route::post('words', [WordBankController::class, 'storeWord'])
            ->name('words.store');
        
        // Update a word
        Route::put('words/{word}', [WordBankController::class, 'updateWord'])
            ->name('words.update');
        
        // Delete a word
        Route::delete('words/{word}', [WordBankController::class, 'destroyWord'])
            ->name('words.destroy');
        
        // Toggle word active status
        Route::patch('words/{word}/toggle', [WordBankController::class, 'toggleWordStatus'])
            ->name('words.toggle');
    });

    Route::resource('games', GameController::class);
    Route::get('/games/{game}/start', [GameController::class, 'showStart'])->name('games.start.show');
    Route::post('/games/{game}/start', [GameController::class, 'start'])->name('games.start');
    Route::post('/games/{game}/call-word', [GameController::class, 'callWord'])->name('games.call-word');
    Route::post('/games/{game}/pause', [GameController::class, 'pause'])->name("games.pause");
    Route::post('/games/{game}/resume', [GameController::class, 'resume'])->name("games.resume");
    Route::post('/games/{game}/end', [GameController::class, 'end'])->name("games.end");
    Route::get('/games/{game}/players/{player}', [GameController::class, 'showPlayerCard'])->name('games.players.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
