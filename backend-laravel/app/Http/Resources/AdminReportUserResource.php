<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminReportUserResource extends JsonResource
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
            'user' => new UserResource($this->user),
            'reported_user' => new UserResource($this->userReport),
            'type_report' => new TypeReportResource($this->typeReport),
            'status' => $this->status,
            'created_at' => Carbon::parse($this->created_at)->timestamp,
            'updated_at' => Carbon::parse($this->updated_at)->timestamp,
        ];
    }
}
