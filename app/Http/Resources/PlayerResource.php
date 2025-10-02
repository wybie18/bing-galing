<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'bingo_card' => $this->getBingoCardWithWords(),
            'crossed_words' => $this->crossed_words ?? [],
            'progress_count' => $this->getProgressCount(),
            'joined_at' => $this->joined_at?->toISOString(),
            'won_at' => $this->won_at?->toISOString(),
            'game' => [
                'id' => $this->game->id,
                'game_code' => $this->game->game_code,
                'status' => $this->game->status,
            ],
            'bingo_lines' => $this->checkForBingo(),
            'has_bingo' => !empty($this->checkForBingo()),
        ];
    }

    /**
     * Get bingo card with actual words instead of just IDs
     */
    private function getBingoCardWithWords(): array
    {
        if (!$this->bingo_card) {
            return [];
        }

        $wordIds = array_filter($this->bingo_card, function($item) {
            return $item !== 'FREE'; 
        });
        
        $words = \App\Models\Word::whereIn('id', $wordIds)->get()->keyBy('id');
        
        $cardWithWords = [];
        foreach ($this->bingo_card as $index => $wordId) {
            if ($wordId === 'FREE') {
                $cardWithWords[] = [
                    'position' => $index,
                    'word_id' => 'FREE',
                    'word' => 'FREE',
                    'is_crossed' => true,
                    'is_free_space' => true,
                    'row' => floor($index / 5),
                    'col' => $index % 5,
                ];
            } else {
                $word = $words->get($wordId);
                $cardWithWords[] = [
                    'position' => $index,
                    'word_id' => $wordId,
                    'word' => $word ? $word->word : 'Unknown',
                    'is_crossed' => in_array($wordId, $this->crossed_words ?? []),
                    'is_free_space' => false,
                    'row' => floor($index / 5),
                    'col' => $index % 5,
                ];
            }
        }
        
        return $cardWithWords;
    }
}
