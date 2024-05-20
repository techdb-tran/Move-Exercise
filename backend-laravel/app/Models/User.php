<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'fullname',
        'gender',
        'birthday',
        'country',
        'city',
        'state',
        'avatar_url',
        'is_actived',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    public function reports()
    {
        return $this->hasMany(Report::class, 'user_id');
    }

    public function reportedBy()
    {
        return $this->hasMany(Report::class, 'reported_user_id');
    }

    public function token($browseId)
    {
        return $this->hasOne(Token::class, 'user_id')->where('browse_id', $browseId);
    }

    public function userBan()
    {
        return $this->hasOne(UserBan::class, 'user_id');
    }
}
