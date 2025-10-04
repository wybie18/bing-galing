<?php

namespace App\Events;

use App\Http\Resources\TeacherPlayerResource;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $game;
    public $player;
    public $oldStatus;
    public $newStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(Game $game, Player $player, string $oldStatus, string $newStatus)
    {
        $this->game = $game;
        $this->player = $player;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
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
        return 'player.status.changed';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        $message = $this->getStatusChangeMessage();
        
        return [
            'player' => new TeacherPlayerResource($this->player),
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => $message,
            'is_winner' => $this->newStatus === 'won',
        ];
    }

    /**
     * Get appropriate message based on status change
     */
    private function getStatusChangeMessage(): string
    {
        $messages = [
            'won' => $this->player->name . ' has won the game! 🎉',
            'playing' => $this->player->name . ' is now playing',
            'disconnected' => $this->player->name . ' disconnected',
        ];

        return $messages[$this->newStatus] ?? $this->player->name . ' status changed to ' . $this->newStatus;
    }
}
