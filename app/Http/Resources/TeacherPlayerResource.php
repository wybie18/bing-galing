<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherPlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'progress_count' => $this->getProgressCount(),
            'joined_at' => $this->joined_at->format('Y-m-d H:i:s'),
            'won_at' => $this->won_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            
            'status_info' => $this->getPlayerStatusInfo(),

            'bingo_lines' => $this->when(
                $this->shouldShowBingoDetails($request),
                fn() => $this->checkForBingo()
            ),
            
            'has_bingo' => count($this->checkForBingo()) > 0,
            
            'play_time' => $this->calculatePlayTime(),
        ];
    }

    /**
     * Get player status information for UI display
     */
    private function getPlayerStatusInfo(): array
    {
        $statusMap = [
            'joined' => [
                'label' => 'Joined',
                'color' => 'blue',
                'description' => 'Player has joined the game',
            ],
            'playing' => [
                'label' => 'Playing',
                'color' => 'green',
                'description' => 'Player is actively playing',
            ],
            'won' => [
                'label' => 'Winner',
                'color' => 'gold',
                'description' => 'Player has won the game',
            ],
            'disconnected' => [
                'label' => 'Disconnected',
                'color' => 'red',
                'description' => 'Player has disconnected',
            ],
        ];
        
        return $statusMap[$this->status] ?? [
            'label' => ucfirst($this->status),
            'color' => 'gray',
            'description' => '',
        ];
    }
    
    /**
     * Determine if bingo details should be shown
     */
    private function shouldShowBingoDetails(Request $request): bool
    {
        return $request->user() && (
            $request->user()->id === $this->game->teacher_id ||
            $request->routeIs('games.players.show') ||
            $this->status === 'won'
        );
    }
    
    /**
     * Calculate how long the player has been playing
     */
    private function calculatePlayTime(): ?string
    {
        if (!$this->game->started_at || $this->status === 'joined') {
            return null;
        }
        
        $endTime = $this->won_at ?? ($this->game->ended_at ?? now());
        $playTime = $this->game->started_at->diff($endTime);
        
        if ($playTime->h > 0) {
            return sprintf('%d hours, %d minutes', $playTime->h, $playTime->i);
        } elseif ($playTime->i > 0) {
            return sprintf('%d minutes, %d seconds', $playTime->i, $playTime->s);
        } else {
            return sprintf('%d seconds', $playTime->s);
        }
    }
}
