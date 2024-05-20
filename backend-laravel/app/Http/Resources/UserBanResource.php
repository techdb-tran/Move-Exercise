<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserBanResource extends JsonResource
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
            'is_ban' => $this->is_ban,
            'expire_ban' => $this->expire_ban,
            'ban_at' => $this->ban_at ? Carbon::parse($this->ban_at)->timestamp : null,
            'created_at' => Carbon::parse($this->created_at)->timestamp,
            'updated_at' => Carbon::parse($this->updated_at)->timestamp,
        ];
    }
}
