<?php
namespace App\Services;

use App\Models\Game;
use App\Models\Player;
use App\Models\Word;
use App\Models\BingoClaim;
use Illuminate\Support\Collection;

class GameService
{
    public function createGame(int $teacherId, int $wordBankId, array $settings = []): Game
    {
        return Game::create([
            'teacher_id' => $teacherId,
            'word_bank_id' => $wordBankId,
            'game_settings' => $settings,
            'status' => 'waiting'
        ]);
    }

    public function joinGame(string $gameCode, string $playerName, string $sessionId): ?Player
    {
        $game = Game::where('game_code', $gameCode)->first();
        
        if (!$game || !$game->canJoin()) {
            return null;
        }

        $bingoCard = $this->generateBingoCard($game->wordBank->activeWords);

        return Player::create([
            'game_id' => $game->id,
            'name' => $playerName,
            'session_id' => $sessionId,
            'bingo_card' => $bingoCard,
            'joined_at' => now()
        ]);
    }

    public function generateBingoCard(Collection $words): array
    {
        $selectedWords = $words->random(min(16, $words->count()))->pluck('id')->toArray();
        
        while (count($selectedWords) < 16) {
            $selectedWords[] = $words->random()->id;
        }

        return array_slice($selectedWords, 0, 16);
    }

    public function startGame(Game $game): bool
    {
        if ($game->status !== 'waiting') {
            return false;
        }

        $words = $game->wordBank->activeWords->shuffle();
        
        foreach ($words as $index => $word) {
            $game->words()->attach($word->id, [
                'sequence_order' => $index + 1
            ]);
        }

        $game->update([
            'status' => 'active',
            'started_at' => now()
        ]);

        return true;
    }

    public function callNextWord(Game $game): ?Word
    {
        $nextWord = $game->words()
                        ->wherePivot('is_called', false)
                        ->orderBy('game_words.sequence_order')
                        ->first();

        if ($nextWord) {
            $game->words()->updateExistingPivot($nextWord->id, [
                'is_called' => true,
                'called_at' => now()
            ]);
        }

        return $nextWord;
    }

    public function claimBingo(Player $player, array $winningLine, string $lineType): BingoClaim
    {
        return BingoClaim::create([
            'game_id' => $player->game_id,
            'player_id' => $player->id,
            'winning_line' => $winningLine,
            'line_type' => $lineType,
            'claimed_at' => now()
        ]);
    }

    public function getGameState(Game $game): array
    {
        return [
            'game' => $game->load('teacher', 'wordBank'),
            'players' => $game->players()->get()->map(function ($player) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'progress' => $player->getProgressCount(),
                    'status' => $player->status
                ];
            }),
            'current_word' => $game->words()
                                  ->wherePivot('is_called', true)
                                  ->orderBy('game_words.called_at', 'desc')
                                  ->first(),
            'called_words_count' => $game->words()
                                        ->wherePivot('is_called', true)
                                        ->count(),
            'total_words' => $game->words()->count()
        ];
    }
}