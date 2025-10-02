<?php

namespace App\Events;

use App\Models\Game;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameEnded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $game;
    public $reason;

    /**
     * Create a new event instance.
     */
    public function __construct(Game $game, string $reason = 'manually_ended')
    {
        $this->game = $game->load(['teacher', 'wordBank', 'players']);
        $this->reason = $reason;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('game.' . $this->game->game_code),
            new PrivateChannel('teacher.' . $this->game->teacher_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $message = match($this->reason) {
            'completed' => 'Game completed! All words have been called.',
            'manually_ended' => 'Game has been ended by the teacher.',
            default => 'Game has ended.'
        };

        return [
            'game' => [
                'id' => $this->game->id,
                'game_code' => $this->game->game_code,
                'status' => $this->game->status,
                'ended_at' => $this->game->ended_at,
                'max_players' => $this->game->max_players,
                'players_count' => $this->game->players->count(),
                'total_words_called' => $this->game->words()->wherePivot('is_called', true)->count(),
            ],
            'reason' => $this->reason,
            'message' => $message,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'game.ended';
    }
}
