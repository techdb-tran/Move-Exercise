<?php

namespace App\Services;

use App\Jobs\SendMail;
use App\Traits\JsonResponseTrait;

class EmailService
{
    use JsonResponseTrait;

    public function sendMailNotification($user, $desc, $mailClass)
    {
        if (!filter_var(trim($user->email), FILTER_VALIDATE_EMAIL)) {
            return $this->respondInvalidParameters(__('mail.invalid'));
        }
        $dataMail = new \stdClass();
        $dataMail->name = $user->name;
        $dataMail->email = trim($user->email);
        $dataMail->desc = $desc;
        // Dispatch the specified mail job class
        SendMail::dispatch($mailClass, $dataMail)->delay(now()->addSeconds(5));
    }
}
