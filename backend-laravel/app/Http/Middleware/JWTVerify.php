<?php

namespace App\Http\Middleware;

use App\Helpers\JWTHelpers;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JWTVerify
{
    use JsonResponseTrait;

    protected $userRepository;

    private $HEADER_NAME_AUTHORIZATION = 'AUTHORIZATION';

    private $HEADER_BROWSER_ID = 'browse-id';

    public function __construct(UserRepositoryInterface $userRepositoryInterface)
    {
        $this->userRepository = $userRepositoryInterface;
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
        if (empty($request->hasHeader($this->HEADER_NAME_AUTHORIZATION)) || empty($request->hasHeader($this->HEADER_BROWSER_ID))) {
            throw new AuthenticationException(__("auth.not.found"));
        }
        if (!preg_match('/Bearer\s(\S+)/', $request->header($this->HEADER_NAME_AUTHORIZATION), $matches) || !$request->header($this->HEADER_BROWSER_ID)) {
            throw new AuthenticationException(__("auth.token.not.found"));
        }
        $jwt = $matches[1];
        if (!$jwt) {
            throw new AuthenticationException(__("auth.token.not.extract"));
        }
        $resultCheckAuth = $this->checkAuth($jwt, $request->header($this->HEADER_BROWSER_ID));
        if ($resultCheckAuth->get('result')) {
            if (!Auth::check()) {
                Auth::login($resultCheckAuth->get('userInfo'));
            }
            return $next($request);
        }
        throw new AuthenticationException(__("auth.failed"));
    }

    private function checkAuth($jwt, $browserId)
    {
        $userId = JWTHelpers::GetUserIDJWT($jwt);
        $userInfo = $this->userRepository->find($userId);
        $publicKey = $this->userRepository->getPublicKeyWithBrowseId($userInfo, $browserId);
        $result = collect(['result' => JWTHelpers::DecodeRawJWT($jwt, $publicKey), 'userInfo' => $userInfo]);
        return $result;
    }
}
