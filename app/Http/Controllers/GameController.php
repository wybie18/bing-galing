<?php
namespace App\Http\Controllers;

use App\Events\GameEnded;
use App\Events\GamePaused;
use App\Events\GameResumed;
use App\Events\GameStarted;
use App\Events\WordCalled;
use App\Http\Resources\GameResource;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Display a listing of games (history)
     */
    public function index(Request $request)
    {
        $query = Game::with(['teacher', 'wordBank', 'players'])
            ->where('teacher_id', Auth::id());

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $query->where('game_code', 'like', '%' . $request->search . '%');
        }

        $sortField     = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query->orderBy($sortField, $sortDirection);

        $games = $query->paginate(12);

        return Inertia::render('Game/Index', [
            'games'        => GameResource::collection($games),
            'queryFilters' => $request->only(['search', 'queryFilter']) ?: [],
            'queryParams'  => request()->query() ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'word_bank_id' => 'required|exists:word_banks,id',
            'max_players'  => 'sometimes|integer|min:1|max:100',
        ]);

        $game = Game::create([
            'teacher_id'   => Auth::id(),
            'word_bank_id' => $validated["word_bank_id"],
            'max_players'  => $validated["max_players"] ?? 30,
            'status'       => 'waiting',
        ]);

        $game->load(['teacher', 'wordBank', 'players']);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game created successfully!');
    }

    /**
     * Display the specified game
     */
    public function show(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return abort(403, "Unauthorized.");
        }

        $game->load(['teacher', 'wordBank', 'players']);

        return Inertia::render('Game/Show', [
            'game' => new GameResource($game),
        ]);
    }

    public function update(Request $request, Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return abort(403, "Unauthorized.");
        }

        $validatedData = $request->validate([
            'max_players'  => 'sometimes|integer|min:1|max:100',
            'word_bank_id' => 'sometimes|exists:word_banks,id',
        ]);

        $game->update($validatedData);
        $game->load(['teacher', 'wordBank', 'players']);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game updated successfully!');
    }

    /**
     * Remove the specified game
     */
    public function destroy(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return abort(403, "Unauthorized.");
        }

        if (! in_array($game->status, ['waiting', 'finished'])) {
            return redirect()->route('game.show', $game)
                ->with('error', 'Cannot delete an active or paused game');
        }

        $game->delete();

        return redirect()->route('games.index', $game)
            ->with('success', 'Game deleted successfully!');
    }

    /**
     * Start a game
     */
    public function start(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return redirect()->route('games.show', $game)->with('message', 'Unauthorized');
        }

        if ($game->status !== 'waiting') {
            return redirect()->route('games.show', $game)->with('message', 'Game can only be started from waiting status');
        }

        if ($game->players()->count() === 0) {
            return redirect()->route('games.show', $game)->with('message', 'Cannot start game with no players');
        }

        if ($game->status !== 'active') {
            $game->update([
                'status'     => 'active',
                'started_at' => now(),
            ]);
        }

        $game->players()->update([
            'status' => 'playing',
        ]);

        if ($game->words()->count() === 0) {
            $words = $game->wordBank->words()->inRandomOrder()->get();
            foreach ($words as $index => $word) {
                $game->words()->attach($word->id, [
                    'sequence_order' => $index + 1,
                    'is_called'      => false,
                ]);
            }
        }

        broadcast(new GameStarted($game));

        return redirect()->route('games.start.show', $game);
    }

    public function showStart(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return abort(403, "Unauthorized.");
        }

        $game->load(['teacher', 'wordBank', 'players']);

        $currentWord = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.called_at', 'desc')
            ->first();

        $totalWords       = $game->words()->count();
        $calledWordsCount = $game->words()->wherePivot('is_called', true)->count();
        $remainingWords   = $totalWords - $calledWordsCount;

        $gameCompleted = $remainingWords === 0;

        if ($gameCompleted) {
            $game->update([
                'status'   => 'finished',
                'ended_at' => now(),
            ]);
            broadcast(new GameEnded($game, 'completed'));
        }

        $recentWords = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.sequence_order', 'asc')
            ->get(['words.id', 'words.word', 'words.meaning'])
            ->map(function ($word) {
                return [
                    'id'        => $word->id,
                    'word'      => $word->word,
                    'meaning'   => $word->meaning,
                    'called_at' => $word->pivot->called_at,
                ];
            });

        return Inertia::render('Game/Start', [
            'message'      => 'Game started successfully',
            'game'         => new GameResource($game),
            'current_word' => $currentWord ? [
                'id'        => $currentWord->id,
                'word'      => $currentWord->word,
                'meaning'   => $currentWord->meaning,
                'called_at' => $currentWord->pivot->called_at,
            ] : null,
            'statistics'   => [
                'total_words'     => $totalWords,
                'words_called'    => $calledWordsCount,
                'words_remaining' => $remainingWords,
            ],
            'recent_words' => $recentWords,
        ]);
    }

    /**
     * Pause a game
     */
    public function pause(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return redirect()->route('games.start.show', $game)->with('message', 'Unauthorized');
        }

        if ($game->status !== 'active') {
            return redirect()->route('games.start.show', $game)->with('message', 'Only active games can be paused');
        }

        $game->update(['status' => 'paused']);
        $game->load(['teacher', 'wordBank', 'players']);

        broadcast(new GamePaused($game));

        return response()->json([
            'message' => 'Game paused successfully',
            'data'    => new GameResource($game),
        ]);
    }

    /**
     * Resume a paused game
     */
    public function resume(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return redirect()->route('games.start.show', $game)->with('message', 'Unauthorized');
        }

        if ($game->status !== 'paused') {
            return redirect()->route('games.start.show', $game)->with('message', 'Only paused games can be resumed');
        }

        $game->update(['status' => 'active']);
        $game->load(['teacher', 'wordBank', 'players']);

        broadcast(new GameResumed($game));

        return response()->json([
            'message' => 'Game resumed successfully',
            'data'    => new GameResource($game),
        ]);
    }

    /**
     * End a game
     */
    public function end(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return redirect()->route('games.start.show', $game)->with('message', 'Unauthorized');
        }

        if (! in_array($game->status, ['active', 'paused'])) {
            return redirect()->route('games.start.show', $game)->with('message', 'Only active or paused games can be ended');
        }

        $game->update([
            'status'   => 'finished',
            'ended_at' => now(),
        ]);

        $game->load(['teacher', 'wordBank', 'players']);

        broadcast(new GameEnded($game, 'manually_ended'));

        return redirect()->route('games.show', $game)
            ->with('success', 'Game ended successfully!');
    }

    public function callWord(Game $game)
    {
        if ($game->teacher_id !== Auth::id()) {
            return redirect()->route('games.start.show', $game)->with('message', 'Unauthorized');
        }

        if ($game->status !== 'active') {
            return redirect()->route('games.start.show', $game)->with('message', 'Only active games can call the next word');
        }

        $nextWord = $game->words()
            ->wherePivot('is_called', false)
            ->orderBy('game_words.sequence_order', 'asc')
            ->first();

        if (! $nextWord) {
            return response()->json([
                'message'        => 'No more words to call. All words have been called.',
                'game_completed' => true,
            ], 422);
        }

        $game->words()->updateExistingPivot($nextWord->id, [
            'is_called' => true,
            'called_at' => now(),
        ]);

        $nextWord->load('wordBank');

        $totalWords       = $game->words()->count();
        $calledWordsCount = $game->words()->wherePivot('is_called', true)->count();
        $remainingWords   = $totalWords - $calledWordsCount;

        $gameCompleted = $remainingWords === 0;

        $statistics = [
            'total_words'     => $totalWords,
            'words_called'    => $calledWordsCount,
            'words_remaining' => $remainingWords,
        ];

        broadcast(new WordCalled($game, $nextWord, $statistics));

        if ($gameCompleted) {
            $game->update([
                'status'   => 'finished',
                'ended_at' => now(),
            ]);

            broadcast(new GameEnded($game, 'completed'));
        }

        $recentWords = $game->words()
            ->wherePivot('is_called', true)
            ->orderBy('game_words.called_at', 'desc')
            ->take(10)
            ->get(['words.id', 'words.word', 'words.meaning'])
            ->map(function ($word) {
                return [
                    'id'        => $word->id,
                    'word'      => $word->word,
                    'meaning'   => $word->meaning,
                    'called_at' => $word->pivot->called_at,
                ];
            });

        return response()->json([
            'message'        => 'Word called successfully',
            'current_word'   => [
                'id'        => $nextWord->id,
                'word'      => $nextWord->word,
                'meaning'   => $nextWord->meaning,
                'called_at' => now(),
            ],
            'statistics'     => [
                'total_words'     => $totalWords,
                'words_called'    => $calledWordsCount,
                'words_remaining' => $remainingWords,
            ],
            'recent_words'   => $recentWords,
            'game_completed' => $gameCompleted,
        ]);
    }

    public function showPlayerCard(Game $game, Player $player)
    {
        if ($game->teacher_id !== Auth::id()) {
            return abort(403, "Unauthorized.");
        }

        if ($player->game_id !== $game->id) {
            return abort(404, "Player not found in this game.");
        }

        $game->load(['teacher', 'wordBank']);
        $player->load('game');

        $allWords = $game->wordBank->words()->get()->keyBy('id');

        $bingoCardData = [];
        foreach ($player->bingo_card as $position => $wordId) {
            if ($wordId === 'FREE') {
                $bingoCardData[$position] = [
                    'id'         => 'FREE',
                    'word'       => 'FREE',
                    'meaning'    => 'Free Space',
                    'is_crossed' => true,
                ];
            } else {
                $word                     = $allWords->get($wordId);
                $bingoCardData[$position] = [
                    'id'         => $wordId,
                    'word'       => $word ? $word->word : 'Unknown',
                    'meaning'    => $word ? $word->meaning : 'Unknown word',
                    'is_crossed' => $player->isPositionCrossed($position),
                ];
            }
        }

        // Check for bingo lines
        $bingoLines = $player->checkForBingo();
        $hasBingo   = ! empty($bingoLines);

        // Get game statistics
        $totalWords       = $game->words()->count();
        $calledWordsCount = $game->words()->wherePivot('is_called', true)->count();
        $playerProgress   = $player->getProgressCount();

        return Inertia::render('Game/PlayerCard', [
            'game'        => new GameResource($game),
            'player'      => [
                'id'                  => $player->id,
                'name'                => $player->name,
                'status'              => $player->status,
                'joined_at'           => $player->joined_at?->format('Y-m-d H:i:s'),
                'won_at'              => $player->won_at?->format('Y-m-d H:i:s'),
                'progress_count'      => $playerProgress,
                'crossed_words_count' => count($player->crossed_words ?? []),
            ],
            'bingo_card'  => $bingoCardData,
            'bingo_lines' => $bingoLines,
            'has_bingo'   => $hasBingo,
            'statistics'  => [
                'total_words'           => $totalWords,
                'words_called'          => $calledWordsCount,
                'player_progress'       => $playerProgress,
                'completion_percentage' => $totalWords > 0 ? round(($playerProgress / 25) * 100, 1) : 0,
            ],
        ]);
    }
}
