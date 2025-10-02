<?php

namespace App\Events;

use App\Models\Game;
use App\Models\Player;
use App\Http\Resources\GameResource;
use App\Http\Resources\TeacherPlayerResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerLeft implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $game;
    public $player;

    /**
     * Create a new event instance.
     */
    public function __construct(Game $game, Player $player)
    {
        $this->game = $game->load(['teacher', 'wordBank', 'players' => function ($query) {
            $query->where('status', '!=', 'disconnected');
        }]);
        $this->player = $player;
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
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'player.left';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'player' => new TeacherPlayerResource($this->player),
            'message' => $this->player->name . ' left the game',
        ];
    }

    /**
     * Determine if this event should broadcast.
     */
    public function shouldBroadcast(): bool
    {
        return $this->player->status === 'disconnected';
    }
}