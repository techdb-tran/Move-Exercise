<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_url',
        'name',
        'is_show',
    ];

    public function video()
    {
        return $this->hasOne(Video::class, 'category_id');
    }
}
