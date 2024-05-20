<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    private $data;

    private $emailClass;

    public function __construct($emailClass, $data)
    {
        Log::info('Queueing new message', [
            'to' => $data->email,
            'desc' => $data->desc,
        ]);
        $this->emailClass = $emailClass;
        $this->data = $data;
        Log::info('Email Queued');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $email = new $this->emailClass($this->data);
        Mail::to($this->data->email)->send($email);
        Log::info('Email sent');
    }
}
