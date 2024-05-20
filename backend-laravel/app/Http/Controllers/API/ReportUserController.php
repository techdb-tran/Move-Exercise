<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateReportUserRequest;
use App\Repositories\Interfaces\ReportUserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Illuminate\Support\Facades\Auth;

class ReportUserController extends Controller
{
    use JsonResponseTrait;

    private ReportUserRepositoryInterface $reportUserRepository;

    public function __construct(ReportUserRepositoryInterface $reportUserRepositoryInterface)
    {
        $this->reportUserRepository = $reportUserRepositoryInterface;
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateReportUserRequest $request)
    {
        $dataReport = $request->toArray();
        $dataReport['user_id'] = Auth::user()->id;
        if (
            $this->reportUserRepository->checkCountUserReportOtherUser(
                $dataReport['user_id'],
                $dataReport['reported_user_id']
            ) > 0
        ) {
            return $this->respondInvalidQuery(__('report.create.exists'));
        }
        return $this->result($this->reportUserRepository->create($dataReport) ? true : false, true);
    }
}
