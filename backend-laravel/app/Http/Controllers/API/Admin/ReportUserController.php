<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteReportUserRequest;
use App\Http\Requests\UpdateReportUserRequest;
use App\Http\Resources\AdminReportUserResource;
use App\Http\Resources\PaginateResource;
use App\Repositories\Interfaces\ReportUserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;

class ReportUserController extends Controller
{
    use JsonResponseTrait;

    private ReportUserRepositoryInterface $reportUserRepository;

    private int $NUMBER_ITEM = 30;

    public function __construct(ReportUserRepositoryInterface $reportUserRepositoryInterface)
    {
        $this->reportUserRepository = $reportUserRepositoryInterface;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = $this->reportUserRepository->getDataPaginating($this->NUMBER_ITEM);
        return $this->result(PaginateResource::make($result, AdminReportUserResource::class), true);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateReportUserRequest $request, $id)
    {
        return $this->result($this->reportUserRepository->update($request->id, $request->toArray()), true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroyByIds(DeleteReportUserRequest $request)
    {
        return $this->result($this->reportUserRepository->deleteByIds($request->ids), true);
    }
}
