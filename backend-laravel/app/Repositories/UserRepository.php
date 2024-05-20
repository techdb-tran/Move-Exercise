<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use DateTime;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    use JsonResponseTrait;

    public function getModel()
    {
        return User::class;
    }

    public function getUserInfo($id)
    {
        return $this->model->findOrFail($id);
    }

    public function changePassword($userInfo, string $newPassword)
    {
        $userInfo->password = $newPassword;
        return $userInfo->save();
    }

    public function updateBan($user, bool $isBan, DateTime $expire = null)
    {
        $user->userBan->is_permaban = $isBan;
        $user->userBan->ban_expired_at = $expire;
        return $user->userBan->save();
    }

    public function getPublicKeyWithBrowseId($user, $browseId)
    {
        $userToken = $user->token($browseId)->first();
        return $userToken->public_key;
    }
}
