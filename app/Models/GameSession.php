<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    protected $fillable = [
        'game_id', 'session_data', 'last_activity',
    ];

    protected $casts = [
        'session_data'  => 'array',
        'last_activity' => 'datetime',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function updateActivity(): void
    {
        $this->update(['last_activity' => now()]);
    }
}
