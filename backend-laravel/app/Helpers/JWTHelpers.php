<?php

namespace App\Helpers;

use App\Exceptions\AuthenticationException;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Traits\JsonResponseTrait;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use DateTimeImmutable;
use DomainException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use UnexpectedValueException;

class JWTHelpers
{
    public static function decodeRawJWT($jwt, $secretKey)
    {
        try {
            $token = JWT::decode($jwt, new Key($secretKey, "HS256"));
            if ($token) {
                return true;
            }
        } catch (Exception $e) {
            Log::debug('Exception DecodeRawJWT: ' . $e);
        } catch (InvalidArgumentException $e) {
            // provided key/key-array is empty or malformed.
            Log::debug('Exception InvalidArgumentException: ' . $e);
        } catch (DomainException $e) {
            // provided algorithm is unsupported OR
            // provided key is invalid OR
            // unknown error thrown in openSSL or libsodium OR
            // libsodium is required but not available.
            Log::debug('Exception DomainException: ' . $e);
        } catch (SignatureInvalidException $e) {
            // provided JWT signature verification failed.
            Log::debug('Exception SignatureInvalidException: ' . $e);
        } catch (BeforeValidException $e) {
            // provided JWT is trying to be used before "nbf" claim OR
            // provided JWT is trying to be used before "iat" claim.
            Log::debug('Exception BeforeValidException: ' . $e);
        } catch (ExpiredException $e) {
            // provided JWT is trying to be used after "exp" claim.
            Log::debug('Exception ExpiredException: ' . $e);
        } catch (UnexpectedValueException $e) {
            // provided JWT is malformed OR
            // provided JWT is missing an algorithm / using an unsupported algorithm OR
            // provided JWT algorithm does not match provided key OR
            // provided key ID in key/key-array is empty or invalid.
            Log::debug('Exception UnexpectedValueException: ' . $e);
        }
        return false;
    }

    public static function getUserIdJWT($token)
    {
        $jwt = explode(".", $token);
        $payload = json_decode(base64_decode($jwt[1]), true);
        return $payload['user_id'];
    }

    public static function GetUserIDAdminJWT($token)
    {
        $jwt = explode(".", $token);
        $payload = json_decode(base64_decode($jwt[1]), true);
        return $payload['id'];
    }
}
