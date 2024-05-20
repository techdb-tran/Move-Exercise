<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class VimeoService
{
    private $DOMAIN_API_VIMEO_V2 = "http://vimeo.com/api/v2/video/";

    public function getInfoVideoById($id)
    {
        $response = Http::get($this->DOMAIN_API_VIMEO_V2 . $id . '.xml');
        if ($response->successful()) {
            return simplexml_load_string($response->body());
        }
        return null;
    }

    public function getDurationTimeById($id)
    {
        $dataVideo = $this->getInfoVideoById($id);
        return $dataVideo ? (int) $dataVideo->video->duration : 0;
    }
}
