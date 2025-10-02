<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = [
        'word_bank_id', 'word', 'meaning', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function wordBank()
    {
        return $this->belongsTo(WordBank::class);
    }

    public function games()
    {
        return $this->belongsToMany(Game::class, 'game_words')
            ->withPivot('sequence_order', 'called_at', 'is_called')
            ->withTimestamps();
    }
}
