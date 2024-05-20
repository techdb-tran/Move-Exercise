<?php

namespace App\Http\Controllers\API;

use App\Helpers\VimeoHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Resources\VideoResource;
use App\Repositories\Interfaces\VideoRepositoryInterface;
use App\Services\VimeoService;
use App\Traits\JsonResponseTrait;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Vimeo\Laravel\VimeoManager;

class VideosController extends Controller
{
    use JsonResponseTrait;

    private $vimeo;

    private $vimeoService;

    private VideoRepositoryInterface $videoRepository;

    public function __construct(VimeoManager $vimeo, VimeoService $vimeoService, VideoRepositoryInterface $videoRepositoryInterface)
    {
        $this->vimeo = $vimeo;
        $this->vimeoService = $vimeoService;
        $this->videoRepository = $videoRepositoryInterface;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateVideoRequest $request)
    {
        $resultUpload = $this->vimeo->upload($request->video);
        $data = [
            'user_id' => auth()->user()->id,
            'url' => VimeoHelpers::urlVideo($resultUpload),
            'is_exist' => true,
            'is_comment' => true,
        ];
        return $this->result($this->videoRepository->create($data), true);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateVideoDetail(UpdateVideoRequest $request, $id)
    {
        $data = $request->toArray();
        $dataInfo = $this->videoRepository->find($request->id);
        $data['duration_time'] = $this->vimeoService->getDurationTimeById(VimeoHelpers::getId($dataInfo->url));
        if ($request->file('thumbnail')) {
            $uploadedImageUrl = Cloudinary::upload($request->file('thumbnail')->getRealPath())->getSecurePath();
            $data['thumbnail'] = $uploadedImageUrl;
        }
        return $this->result(new VideoResource($this->videoRepository->update($request->id, $data)), true);
    }
}
