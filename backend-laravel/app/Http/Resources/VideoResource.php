<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            "description" => $this->description,
            "thumbnail" => $this->thumbnail,
            "url" => $this->url,
            "user" => new UserResource($this->user),
            "category" => new CategoryResource($this->category),
            "keyword" => $this->keyword,
            "is_comment" => $this->is_comment,
            "is_exist" => $this->is_exist,
            "created_at" => Carbon::parse($this->created_at)->timestamp,
            "updated_at" => Carbon::parse($this->updated_at)->timestamp,
            "level" => $this->level,
            "duration" => $this->duration,
            "title" => $this->title
        ];
    }
}
