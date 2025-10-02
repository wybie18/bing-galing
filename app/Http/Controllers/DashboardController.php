<?php
namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Player;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_games'     => Game::where('teacher_id', $user->id)->count(),
            'active_games'    => Game::where('teacher_id', $user->id)
                ->where('status', 'active')
                ->count(),
            'total_players'   => Player::whereHas('game', function ($query) use ($user) {
                $query->where('teacher_id', $user->id);
            })->count(),
            'completed_games' => Game::where('teacher_id', $user->id)
                ->where('status', 'finished')
                ->count(),
        ];

        $recentGames = Game::where('teacher_id', $user->id)
            ->with(['wordBank', 'players'])
            ->withCount('players')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($game) {
                return [
                    'id'            => $game->id,
                    'game_code'     => $game->game_code,
                    'status'        => $game->status,
                    'max_players'   => $game->max_players,
                    'players_count' => $game->players_count,
                    'created_at'    => $game->created_at,
                    'word_bank'     => [
                        'name'       => $game->wordBank?->name,
                        'word_count' => $game->wordBank?->words()->count(),
                    ],
                ];
            });

        return inertia('Dashboard', [
            'stats'       => $stats,
            'recentGames' => $recentGames,
        ]);
    }
}
