<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BingoClaim extends Model
{
    protected $fillable = [
        'game_id', 'player_id', 'winning_line', 'line_type',
        'status', 'claimed_at', 'verified_at',
    ];

    protected $casts = [
        'winning_line' => 'array',
        'claimed_at'   => 'datetime',
        'verified_at'  => 'datetime',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function verify(): bool
    {
        // Verify the claim is valid
        $player     = $this->player;
        $validLines = $player->checkForBingo();

        foreach ($validLines as $line) {
            if ($line['type'] === $this->line_type &&
                array_diff($line['positions'], $this->winning_line) === array_diff($this->winning_line, $line['positions'])) {
                $this->update([
                    'status'      => 'verified',
                    'verified_at' => now(),
                ]);

                $player->update([
                    'status' => 'won',
                    'won_at' => now(),
                ]);

                return true;
            }
        }

        $this->update(['status' => 'invalid']);
        return false;
    }
}
