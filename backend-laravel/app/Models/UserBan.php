<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBan extends Model
{
    use HasFactory;

    public $table = "user_bans";

    protected $fillable = [
        'user_id',
        'is_permaban',
        'ban_expired_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
