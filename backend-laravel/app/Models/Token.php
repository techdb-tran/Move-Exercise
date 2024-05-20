<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'public_key',
        'type_report_id',
        'refresh_tokens_used',
        'refresh_token',
        'forgot_password',
        'private_key'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
