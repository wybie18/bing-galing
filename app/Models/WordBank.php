<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WordBank extends Model
{
    protected $fillable = [
        'teacher_id', 'name', 'description', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function words()
    {
        return $this->hasMany(Word::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }

    public function activeWords()
    {
        return $this->hasMany(Word::class)->where('is_active', true);
    }
}
