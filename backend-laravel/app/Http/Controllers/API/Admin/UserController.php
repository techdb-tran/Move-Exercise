<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShowUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\NotificationStatusUser;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\EmailService;
use App\Traits\JsonResponseTrait;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use JsonResponseTrait;

    private UserRepositoryInterface $userRepository;

    private EmailService $emailService;

    public function __construct(UserRepositoryInterface $userRepositoryInterface, EmailService $emailService)
    {
        $this->userRepository = $userRepositoryInterface;
        $this->emailService = $emailService;
    }

    /**
     * Display a listing of the resource.
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ShowUserRequest $request)
    {
        return $this->result(new UserResource($this->userRepository->getUserInfo($request->id)), true);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $descMail = "";
        $this->userRepository->update($request->id, $request->only(['is_verified']));
        $userInfo = $this->userRepository->getUserInfo($request->id);
        $timeExpireBan = Carbon::now()->addDays($request->expire_ban);
        if ($this->isStatusChanged($userInfo, $request->status, $timeExpireBan)) {
            if ($request->status == UserStatus::ACTIVE) {
                $this->userRepository->updateBan($userInfo, false);
                $descMail = __('mail.notification.user.status.active');
            } elseif ($request->status == UserStatus::SUSPEND) {
                $this->userRepository->updateBan($userInfo, false, $timeExpireBan);
                $descMail = __('mail.notification.user.status.suspend', ['expire_ban' => $timeExpireBan]);
            } else {
                $this->userRepository->updateBan($userInfo, true);
                $descMail = __('mail.notification.user.status.perma');
            }
            $this->emailService->sendMailNotification($userInfo, $descMail, NotificationStatusUser::class);
        }
        return $this->result(new UserResource($userInfo), true);
    }

    protected function getStatusUser($user)
    {
        if (!$user->userBan->is_permaban && (Carbon::parse($user->userBan->ban_expired_at) < Carbon::now() || $user->userBan->ban_expired_at == null)) {
            return UserStatus::ACTIVE;
        } elseif (!$user->userBan->is_permaban && (Carbon::parse($user->userBan->ban_expired_at) >= Carbon::now())) {
            return UserStatus::SUSPEND;
        } else {
            return UserStatus::PERMABAN;
        }
        return null;
    }

    protected function isStatusChanged($user, $userStatus, DateTime $timeExpireBan)
    {
        $userStatusNow = $this->getStatusUser($user);
        if ($userStatusNow === $userStatus) {
            if (($userStatusNow === UserStatus::SUSPEND) && !Carbon::parse($user->userBan->ban_expired_at)->equalTo($timeExpireBan)) {
                return true;
            }
            return false;
        }
        return true;
    }
}
