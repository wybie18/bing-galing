<?php
namespace App\Http\Controllers;

use App\Events\PlayerJoined;
use App\Events\PlayerLeft;
use App\Http\Requests\CrossWordRequest;
use App\Http\Requests\JoinGameRequest;
use App\Http\Resources\PlayerResource;
use App\Models\Game;
use App\Models\Player;
use App\Models\Word;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class PlayerController extends Controller
{
    /**
     * Join a game
     */
    public function joinGame(JoinGameRequest $request, Game $game): JsonResponse
    {
        if (! $game->canJoin()) {
            return response()->json([
                'message' => 'Game is not accepting new players',
            ], 422);
        }

        $playerId = $request->header('X-Player-ID') ?: Session::getId();

        $existingPlayer = $game->players()
            ->where('session_id', $playerId)
            ->first();

        $calledWords = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.called_at')
            ->select('word', 'meaning')
            ->get()
            ->toArray();

        if ($existingPlayer) {
            return response()->json([
                'message'      => 'You have already joined this game',
                'session_id'   => $playerId,
                'data'         => new PlayerResource($existingPlayer),
                'called_words' => $calledWords,
            ], 200);
        }

        $bingoCard = $this->generateBingoCard($game);

        $player = $game->players()->create([
            'name'          => $request->name,
            'session_id'    => $playerId,
            'bingo_card'    => $bingoCard,
            'crossed_words' => [],
            'status'        => 'joined',
            'joined_at'     => now(),
        ]);

        broadcast(new PlayerJoined($game, $player));

        return response()->json([
            'message'      => 'Successfully joined the game',
            'session_id'   => $playerId,
            'data'         => new PlayerResource($player),
            'called_words' => $calledWords,
        ], 201);
    }

    public function resumeGame(Request $request, Game $game)
    {
        if (! $game->canJoin()) {
            return response()->json([
                'message' => 'Game is not accepting new players',
            ], 422);
        }

        $playerId = $request->header('X-Player-ID') ?: Session::getId();

        $existingPlayer = $game->players()
            ->where('session_id', $playerId)
            ->first();

        $calledWords = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.called_at')
            ->select('word', 'meaning')
            ->get()
            ->toArray();

        if (! $existingPlayer) {
            return response()->json([
                'message' => 'You are not registered in this game or your session has expired.',
            ], 422);
        }

        return response()->json([
            'message'      => 'Successfully rejoined the game!',
            'session_id'   => $playerId,
            'data'         => new PlayerResource($existingPlayer),
            'called_words' => $calledWords,
        ], 200);
    }

    /**
     * Get current player info
     */
    public function show(Game $game): JsonResponse
    {
        $playerId = request()->header('X-Player-ID') ?: Session::getId();

        $player = $game->players()
            ->where('session_id', $playerId)
            ->firstOrFail();

        return response()->json([
            'data' => new PlayerResource($player),
        ]);
    }

    /**
     * Cross/uncross a word on bingo card
     */
    public function crossWord(CrossWordRequest $request, Game $game): JsonResponse
    {
        $playerId = $request->header('X-Player-ID') ?: Session::getId();

        $player = $game->players()
            ->where('session_id', $playerId)
            ->firstOrFail();

        if ($player->status !== 'playing' && $game->status !== 'active') {
            return response()->json([
                'message' => 'Game is not active or you are not in playing status',
            ], 422);
        }

        $wordId = $request->word_id;
        $action = $request->action;

        if (! in_array($wordId, $player->bingo_card) || $wordId === 'FREE') {
            return response()->json([
                'message' => 'Word not found on your bingo card or cannot cross FREE space',
            ], 422);
        }

        $wordCalled = $game->words()
            ->where('word_id', $wordId)
            ->wherePivot('is_called', true)
            ->exists();

        if (! $wordCalled) {
            return response()->json([
                'message' => 'This word has not been called yet',
            ], 422);
        }

        if ($action === 'cross') {
            $player->crossWord($wordId);
        } else {
            $player->uncrossWord($wordId);
        }

        $bingoLines = $player->checkForBingo();

        $response = [
            'message'  => 'Word ' . $action . 'ed successfully',
            'data'     => new PlayerResource($player->fresh()),
            'progress' => $player->getProgressCount(),
        ];

        if (! empty($bingoLines)) {
            $response['message'] = 'BINGO! You have completed a line!';
        }

        return response()->json($response);
    }

    /**
     * Claim bingo
     */
    public function claimBingo(Game $game): JsonResponse
    {
        $playerId = request()->header('X-Player-ID') ?: Session::getId();

        Log::info("Player: " . $playerId);

        $player = $game->players()
            ->where('session_id', $playerId)
            ->firstOrFail();

        if ($player->status === 'won') {
            return response()->json([
                'message' => 'You have already won this game',
            ], 422);
        }

        $bingoLines = $player->checkForBingo();

        if (empty($bingoLines)) {
            return response()->json([
                'message' => 'No bingo detected on your card',
            ], 422);
        }

        $winningLine = $bingoLines[0];

        $bingoClaim = $game->bingoClaims()->create([
            'player_id'    => $player->id,
            'winning_line' => $winningLine['positions'],
            'line_type'    => $winningLine['type'],
            'status'       => 'verified',
            'claimed_at'   => now(),
            'verified_at'  => now(),
        ]);

        $player->update([
            'status' => 'won',
            'won_at' => now(),
        ]);

        return response()->json([
            'message'     => 'Congratulations! Bingo claimed successfully!',
            'data'        => new PlayerResource($player->fresh()),
            'bingo_claim' => $bingoClaim,
        ]);
    }

    /**
     * Leave game
     */
    public function leaveGame(Game $game): JsonResponse
    {
        $playerId = request()->header('X-Player-ID') ?: Session::getId();

        $player = $game->players()
            ->where('session_id', $playerId)
            ->firstOrFail();

        if($player->status !== 'won'){
            $player->update(['status' => 'disconnected']);
        }
        broadcast(new PlayerLeft($game, $player));

        return response()->json([
            'message' => 'Successfully left the game',
        ]);
    }

    /**
     * Get game status and called words
     */
    public function gameStatus(Game $game): JsonResponse
    {
        $playerId = request()->header('X-Player-ID') ?: Session::getId();

        $player = $game->players()
            ->where('session_id', $playerId)
            ->first();

        if (! $player) {
            return response()->json([
                'message' => 'You are not part of this game',
            ], 403);
        }

        $calledWords = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.sequence_order')
            ->get(['words.id', 'words.word', 'game_words.called_at'])
            ->map(function ($word) {
                return [
                    'id'        => $word->id,
                    'word'      => $word->word,
                    'called_at' => $word->pivot->called_at,
                ];
            });

        return response()->json([
            'game'         => [
                'id'            => $game->id,
                'game_code'     => $game->game_code,
                'status'        => $game->status,
                'players_count' => $game->players()->count(),
                'max_players'   => $game->max_players,
            ],
            'player'       => new PlayerResource($player),
            'called_words' => $calledWords,
            'progress'     => $player->getProgressCount(),
        ]);
    }

    /**
     * Get leaderboard
     */
    public function leaderboard(Game $game): JsonResponse
    {
        $players = $game->players()
            ->where('status', '!=', 'disconnected')
            ->get()
            ->map(function ($player) {
                return [
                    'name'      => $player->name,
                    'status'    => $player->status,
                    'progress'  => $player->getProgressCount(),
                    'joined_at' => $player->joined_at,
                    'won_at'    => $player->won_at,
                ];
            })
            ->sortByDesc('progress')
            ->values();

        return response()->json([
            'data' => $players,
        ]);
    }

    /**
     * Generate a random bingo card for the player
     */
    private function generateBingoCard(Game $game): array
    {
        $wordBank = $game->wordBank;
        $words    = $wordBank->words()->pluck('id')->toArray();

        if (count($words) < 24) {
            throw ValidationException::withMessages([
                'word_bank' => 'Word bank must have at least 24 words for bingo card generation',
            ]);
        }

        shuffle($words);
        $selectedWords = array_slice($words, 0, 24);

        $bingoCard = [];
        $wordIndex = 0;

        for ($i = 0; $i < 25; $i++) {
            if ($i === 12) {
                $bingoCard[$i] = 'FREE';
            } else {
                $bingoCard[$i] = $selectedWords[$wordIndex];
                $wordIndex++;
            }
        }

        return $bingoCard;
    }
}
