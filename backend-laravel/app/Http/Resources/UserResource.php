<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'username' => $this->username,
            'fullname' => $this->fullname,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'country' => $this->country,
            'city' => $this->city,
            'state' => $this->state,
            'avatar_url' => $this->avatar_url,
            'is_actived' => $this->is_actived,
            'is_verified' => $this->is_verified,
            'ban' => new UserBanResource($this->userBan),
            'created_at' => Carbon::parse($this->created_at)->timestamp,
            'updated_at' => Carbon::parse($this->updated_at)->timestamp,
        ];
    }
}
