<?php

namespace App\Console\Commands;

use App\Events\GameEnded;
use App\Models\Game;
use Illuminate\Console\Command;

class EndExpiredGames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'games:end-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'End games that have been active for more than 2 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $twoHoursAgo = now()->subHours(2);
        
        $expiredGames = Game::whereIn('status', ['active', 'paused'])
            ->where('started_at', '<=', $twoHoursAgo)
            ->get();

        if ($expiredGames->isEmpty()) {
            $this->info('No expired games found.');
            return Command::SUCCESS;
        }

        foreach ($expiredGames as $game) {
            $game->update([
                'status' => 'finished',
                'ended_at' => now(),
            ]);

            broadcast(new GameEnded($game, 'time_expired'));

            $this->info("Game {$game->game_code} has been ended due to time expiration.");
        }

        $this->info("Total games ended: {$expiredGames->count()}");
        
        return Command::SUCCESS;
    }
}
