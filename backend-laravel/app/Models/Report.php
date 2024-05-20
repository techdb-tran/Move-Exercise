<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'reported_user_id',
        'type_report_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function userReport()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }
    public function typeReport()
    {
        return $this->belongsTo(TypeReport::class, 'type_report_id');
    }
}
