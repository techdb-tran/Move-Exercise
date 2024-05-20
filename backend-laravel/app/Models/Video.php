<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stevebauman\Purify\Casts\PurifyHtmlOnGet;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'url',
        'user_id',
        'category_id',
        'keyword',
        'is_comment',
        'level',
        'duration',
        'duration_time',
        'is_exist'
    ];

    protected $casts = [
        'title' => PurifyHtmlOnGet::class,
        'keyword' => PurifyHtmlOnGet::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
