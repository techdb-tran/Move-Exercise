<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class VimeoHelpers
{
    private static $DOMAIN_PLAYER = "https://player.vimeo.com/video/";

    private static $URL_DELETE = "/videos/";

    public static function urlVideo($path)
    {
        return self::$DOMAIN_PLAYER . self::getId($path);
    }

    public static function getId($path)
    {
        $arrayPath = explode('/', $path);
        return end($arrayPath);
    }

    public static function urlVideoDelete($path)
    {
        if (Str::contains($path, self::$DOMAIN_PLAYER)) {
            return self::$URL_DELETE . substr($path, strrpos($path, '/') + 1);
        }
        return null;
    }
}
