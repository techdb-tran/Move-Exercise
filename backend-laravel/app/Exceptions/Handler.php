<?php

namespace App\Exceptions;

use App\Traits\JsonResponseTrait;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use JsonResponseTrait;

    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        switch (true) {
            case $exception instanceof NotFoundHttpException:
                return $this->respondNotFound();
                break;
            case $exception instanceof AuthenticationException:
                return $this->respondUnauthorized($exception->getMessage());
                break;
            case $exception instanceof ModelNotFoundException:
                return $this->respondInvalidQuery(__("error.ModelNotFoundException"));
                break;
            case $exception instanceof ValidationException:
                return $this->respondValidatorFailed($exception->validator);
                break;
            case $exception instanceof QueryException:
                return $this->respondInvalidQuery($exception->getMessage());
                break;
            default:
                return $this->setHTTPStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)->respondWithError($exception->getMessage());
                break;
        }
    }
}
