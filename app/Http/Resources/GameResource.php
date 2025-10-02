<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
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
            'game_code' => $this->game_code,
            'status' => $this->status,
            'max_players' => $this->max_players,
            'current_players' => $this->players_count ?? $this->players->count(),
            'game_settings' => $this->game_settings,
            'started_at' => $this->started_at?->format('Y-m-d H:i:s'),
            'ended_at' => $this->ended_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Duration calculation
            'duration' => $this->calculateDuration(),
            
            // Relationships
            'teacher' => $this->whenLoaded('teacher', function () {
                return [
                    'id' => $this->teacher->id,
                    'name' => $this->teacher->name,
                    'email' => $this->teacher->email,
                ];
            }),
            
            'word_bank' => $this->whenLoaded('wordBank', function () {
                return [
                    'id' => $this->wordBank->id,
                    'name' => $this->wordBank->name,
                    'description' => $this->wordBank->description,
                    'word_count' => $this->wordBank->words->count() ?? 0,
                ];
            }),
            
            'players' => $this->whenLoaded('players', function () {
                return TeacherPlayerResource::collection($this->players);
            }),
            
            // Additional computed properties
            'can_start' => $this->status === 'waiting' && $this->players->count() > 0,
            'can_pause' => $this->status === 'active',
            'can_resume' => $this->status === 'paused',
            'can_end' => in_array($this->status, ['active', 'paused']),
            'can_delete' => in_array($this->status, ['waiting', 'finished']),
            'can_edit' => $this->status === 'waiting',
            'is_full' => $this->players->count() >= $this->max_players,
            
            // Game progress
            'winners' => $this->whenLoaded('players', function () {
                return $this->players->where('status', 'won')->values();
            }),
            'winner_count' => $this->whenLoaded('players', function () {
                return $this->players->where('status', 'won')->count();
            }),
        ];
    }

    /**
     * Calculate game duration
     */
    private function calculateDuration(): ?string
    {
        if (!$this->started_at) {
            return null;
        }
        
        $endTime = $this->ended_at ?? now();
        $duration = $this->started_at->diff($endTime);
        
        if ($duration->h > 0) {
            return sprintf('%d hours, %d minutes', $duration->h, $duration->i);
        } elseif ($duration->i > 0) {
            return sprintf('%d minutes, %d seconds', $duration->i, $duration->s);
        } else {
            return sprintf('%d seconds', $duration->s);
        }
    }
}
