<?php

namespace App\Repositories;

use App\Models\TypeReport;
use App\Repositories\Interfaces\TypeReportRepositoryInterface;

class TypeReportRepository extends BaseRepository implements TypeReportRepositoryInterface
{
    public function getModel()
    {
        return TypeReport::class;
    }
}
