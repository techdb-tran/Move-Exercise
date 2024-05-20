<?php

namespace App\Repositories\Interfaces;

use DateTime;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function getUserInfo($id);

    public function changePassword($userInfo, string $newPassword);

    public function updateBan($user, bool $isBan, DateTime $expire = null);

    public function getPublicKeyWithBrowseId($user, $browseId);
}
