<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\TypeReportResource;
use App\Repositories\Interfaces\TypeReportRepositoryInterface;
use App\Traits\JsonResponseTrait;

class TypeReportController extends Controller
{
    use JsonResponseTrait;

    private TypeReportRepositoryInterface $typeReportRepository;

    public function __construct(TypeReportRepositoryInterface $typeReportRepositoryInterface)
    {
        $this->typeReportRepository = $typeReportRepositoryInterface;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->result(TypeReportResource::collection($this->typeReportRepository->getAll()), true);
    }
}
