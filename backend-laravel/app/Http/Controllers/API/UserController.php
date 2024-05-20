<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordUserRequest;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use JsonResponseTrait;

    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepositoryInterface)
    {
        $this->userRepository = $userRepositoryInterface;
    }

    public function changePassword(ChangePasswordUserRequest $request)
    {
        if (!Hash::check($request->password, Auth::user()->password)) {
            return $this->respondInvalidQuery(__('user.changepassword.password.incorrect'));
        }
        $newPasswordHash = Hash::make($request->password_new);
        $finalNodeGeneratedHash = str_replace("$2b$", "$2y$", $newPasswordHash);
        return $this->result($this->userRepository->changePassword(Auth::user(), $finalNodeGeneratedHash), true);
    }
}
