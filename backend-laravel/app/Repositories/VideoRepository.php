<?php

namespace App\Repositories;

use App\Models\Video;
use App\Repositories\Interfaces\VideoRepositoryInterface;
use Carbon\Carbon;

class VideoRepository extends BaseRepository implements VideoRepositoryInterface
{
    public function getModel()
    {
        return Video::class;
    }

    public function getInactiveVideos()
    {
        return $this->model->where('is_exist', true)->whereNull('title')->whereDate('created_at', '<=', Carbon::now()->subDay())->get();
    }
}
