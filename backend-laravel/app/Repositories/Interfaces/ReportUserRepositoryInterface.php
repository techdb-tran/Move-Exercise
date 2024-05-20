<?php

namespace App\Repositories\Interfaces;

interface ReportUserRepositoryInterface extends BaseRepositoryInterface
{
    public function checkCountUserReportOtherUser($userId, $reportedUserId);

    public function getDataPaginating($numberItem);

    public function deleteByIds($ids);
}
