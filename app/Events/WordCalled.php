<?php
namespace App\Events;

use App\Models\Game;
use App\Models\Word;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WordCalled implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $game;
    public $word;
    public $statistics;

    /**
     * Create a new event instance.
     */
    public function __construct(Game $game, Word $word, array $statistics)
    {
        $this->game       = $game->load(['teacher', 'wordBank', 'players']);
        $this->word       = $word;
        $this->statistics = $statistics;
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
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'game'         => [
                'id'        => $this->game->id,
                'game_code' => $this->game->game_code,
                'status'    => $this->game->status,
            ],
            'current_word' => [
                'id'        => $this->word->id,
                'word'      => $this->word->word,
                'meaning'   => $this->word->meaning,
                'called_at' => now()->toISOString(),
            ],
            'statistics'   => [
                'total_words'     => $this->statistics['total_words'],
                'words_called'    => $this->statistics['words_called'],
                'words_remaining' => $this->statistics['words_remaining'],
            ],
            'message'      => "New word called: {$this->word->word}",
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'word.called';
    }
}
