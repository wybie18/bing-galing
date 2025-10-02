<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Game extends Model
{
    protected $fillable = [
        'game_code', 'teacher_id', 'word_bank_id', 'status',
        'max_players', 'game_settings', 'started_at', 'ended_at',
    ];

    protected $casts = [
        'game_settings' => 'array',
        'started_at'    => 'datetime',
        'ended_at'      => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($game) {
            if (! $game->game_code) {
                $game->game_code = static::generateUniqueGameCode();
            }
        });
    }

    /**
     * Get the route key for the model.
     * This tells Laravel to use the 'game_code' column for route model binding.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'game_code';
    }

    public static function generateUniqueGameCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (static::where('game_code', $code)->exists());

        return $code;
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function wordBank()
    {
        return $this->belongsTo(WordBank::class);
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function words()
    {
        return $this->belongsToMany(Word::class, 'game_words')
            ->withPivot('sequence_order', 'called_at', 'is_called')
            ->withTimestamps();
    }

    public function bingoClaims()
    {
        return $this->hasMany(BingoClaim::class);
    }

    public function gameSession()
    {
        return $this->hasMany(GameSession::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function canJoin(): bool
    {
        return ($this->status !== 'finished') && $this->players()->count() < $this->max_players;
    }
}
