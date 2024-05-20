<?php

namespace App\Http\Middleware;

use App\Helpers\JWTHelpers;
use App\Repositories\Interfaces\AdminRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JWTAdminVerify
{
    use JsonResponseTrait;

    protected $adminRepository;

    private $HEADER_NAME_AUTHORIZATION = 'AUTHORIZATION';

    public function __construct(AdminRepositoryInterface $adminRepository)
    {
        $this->adminRepository = $adminRepository;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (empty($request->hasHeader($this->HEADER_NAME_AUTHORIZATION))) {
            throw new AuthenticationException(__("auth.not.found"));
        }
        if (!preg_match('/Bearer\s(\S+)/', $request->header($this->HEADER_NAME_AUTHORIZATION), $matches)) {
            throw new AuthenticationException(__("auth.token.not.found"));
        }
        $jwt = $matches[1];
        if (!$jwt) {
            throw new AuthenticationException(__("auth.token.not.extract"));
        }
        $resultCheckAuth = $this->checkAuth($jwt);
        if ($resultCheckAuth->get('result')) {
            if (!Auth::guard('admin')->check()) {
                Auth::guard('admin')->login($resultCheckAuth->get('userInfo'));
            }
            return $next($request);
        }
        throw new AuthenticationException(__("auth.failed"));
    }

    private function checkAuth($jwt)
    {
        $userId = JWTHelpers::GetUserIDAdminJWT($jwt);
        $adminInfo = $this->adminRepository->find($userId);
        $result = collect(['result' => JWTHelpers::DecodeRawJWT($jwt, $adminInfo->public_key), 'userInfo' => $adminInfo]);
        return $result;
    }
}
