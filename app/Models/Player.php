<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    protected $fillable = [
        'game_id', 'name', 'session_id', 'bingo_card',
        'crossed_words', 'status', 'joined_at', 'won_at',
    ];

    protected $casts = [
        'bingo_card'    => 'array',
        'crossed_words' => 'array',
        'joined_at'     => 'datetime',
        'won_at'        => 'datetime',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function bingoClaims()
    {
        return $this->hasMany(BingoClaim::class);
    }

    public function crossWord(int $wordId): void
    {
        if ($wordId === 'FREE') {
            return;
        }
        
        $crossedWords = $this->crossed_words ?? [];
        if (! in_array($wordId, $crossedWords)) {
            $crossedWords[] = $wordId;
            $this->update(['crossed_words' => $crossedWords]);
        }
    }

    public function uncrossWord(int $wordId): void
    {
        if ($wordId === 'FREE') {
            return;
        }
        
        $crossedWords = $this->crossed_words ?? [];
        $this->update([
            'crossed_words' => array_values(array_diff($crossedWords, [$wordId])),
        ]);
    }

    public function getProgressCount(): int
    {
        return count($this->crossed_words ?? []) + 1;
    }

    public function checkForBingo(): array
    {
        $size    = 5;
        $card    = $this->bingo_card;
        $crossed = $this->crossed_words ?? [];
        $lines   = [];

        $isPositionCrossed = function($position) use ($card, $crossed) {
            $wordId = $card[$position];
            return $wordId === 'FREE' || in_array($wordId, $crossed);
        };

        // Check horizontal lines (rows)
        for ($row = 0; $row < $size; $row++) {
            $line = [];
            $isCompleteLine = true;
            
            for ($col = 0; $col < $size; $col++) {
                $position = $row * $size + $col;
                if ($isPositionCrossed($position)) {
                    $line[] = $position;
                } else {
                    $isCompleteLine = false;
                    break;
                }
            }
            
            if ($isCompleteLine && count($line) === $size) {
                $lines[] = ['type' => 'horizontal', 'positions' => $line];
            }
        }

        // Check vertical lines (columns)
        for ($col = 0; $col < $size; $col++) {
            $line = [];
            $isCompleteLine = true;
            
            for ($row = 0; $row < $size; $row++) {
                $position = $row * $size + $col;
                if ($isPositionCrossed($position)) {
                    $line[] = $position;
                } else {
                    $isCompleteLine = false;
                    break;
                }
            }
            
            if ($isCompleteLine && count($line) === $size) {
                $lines[] = ['type' => 'vertical', 'positions' => $line];
            }
        }

        $diagonal1 = [];
        $diagonal2 = [];
        $diagonal1Complete = true;
        $diagonal2Complete = true;
        
        for ($i = 0; $i < $size; $i++) {
            // Main diagonal (top-left to bottom-right)
            $position1 = $i * $size + $i;
            if ($isPositionCrossed($position1)) {
                $diagonal1[] = $position1;
            } else {
                $diagonal1Complete = false;
            }

            // Anti-diagonal (top-right to bottom-left)
            $position2 = $i * $size + ($size - 1 - $i);
            if ($isPositionCrossed($position2)) {
                $diagonal2[] = $position2;
            } else {
                $diagonal2Complete = false;
            }
        }

        if ($diagonal1Complete && count($diagonal1) === $size) {
            $lines[] = ['type' => 'diagonal', 'positions' => $diagonal1];
        }
        if ($diagonal2Complete && count($diagonal2) === $size) {
            $lines[] = ['type' => 'diagonal', 'positions' => $diagonal2];
        }

        return $lines;
    }

    /**
     * Check if a specific position on the card is considered "crossed"
     * This includes the FREE center space which is always crossed
     */
    public function isPositionCrossed(int $position): bool
    {
        if (!isset($this->bingo_card[$position])) {
            return false;
        }
        
        $wordId = $this->bingo_card[$position];
    
        if ($wordId === 'FREE') {
            return true;
        }
        
        return in_array($wordId, $this->crossed_words ?? []);
    }

    /**
     * Get the word at a specific position on the bingo card
     */
    public function getWordAtPosition(int $position): mixed
    {
        return $this->bingo_card[$position] ?? null;
    }
}
