<?php

namespace App\Console\Commands;

use App\Helpers\VimeoHelpers;
use App\Repositories\Interfaces\VideoRepositoryInterface;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Vimeo\Laravel\VimeoManager;

class ClearVideosCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'videos:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete videos not updated description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    protected $videoRepository;

    protected $vimeo;

    public function __construct(VideoRepositoryInterface $videoRepositoryInterface, VimeoManager $vimeoManager)
    {
        parent::__construct();
        $this->videoRepository = $videoRepositoryInterface;
        $this->vimeo = $vimeoManager;
    }

    public function handle()
    {
        $videos = $this->videoRepository->getInactiveVideos();
        if ($videos) {
            foreach ($videos as $video) {
                $urlDelete = VimeoHelpers::urlVideoDelete($video->url);
                Log::info("ClearVideosCommand: ", [$video->url, $urlDelete]);
                if ($urlDelete) {
                    $result = $this->vimeo->request($urlDelete, [], 'DELETE');
                    $this->info('Delete URL: ' . $urlDelete . ' Status: ' . $result['status']);
                }
                $this->videoRepository->update($video->id, ['is_exist' => false]);
            }
            $this->info('Videos not updated have been deleted successfully.');
        } else {
            $this->info('No inactive videos found.');
        }
    }
}
