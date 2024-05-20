<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeReport extends Model
{
    use HasFactory;

    public $table = "type_report";


    protected $fillable = [
        'title'
    ];

    public function reports()
    {
        return $this->hasMany(Report::class, 'type_report_id');
    }
}
