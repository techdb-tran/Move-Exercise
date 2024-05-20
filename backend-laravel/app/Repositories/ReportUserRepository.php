<?php

namespace App\Repositories;

use App\Models\Report;
use App\Repositories\Interfaces\ReportUserRepositoryInterface;
use App\Traits\JsonResponseTrait;

class ReportUserRepository extends BaseRepository implements ReportUserRepositoryInterface
{
    use JsonResponseTrait;

    public function getModel()
    {
        return Report::class;
    }

    public function getDataPaginating($numberItem)
    {
        return $this->model->orderBy('created_at', 'desc')->paginate($numberItem);
    }

    public function checkCountUserReportOtherUser($userId, $reportedUserId)
    {
        return $this->model
            ->where("reported_user_id", $reportedUserId)
            ->where("user_id", $userId)
            ->count();
    }

    public function deleteByIds($ids)
    {
        return $this->model->whereIn('id', $ids)->delete();
    }
}
