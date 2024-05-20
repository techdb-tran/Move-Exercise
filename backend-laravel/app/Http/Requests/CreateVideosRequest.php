<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class CreateVideoRequest extends FormRequest
{
    private $NEEDS_AUTHORIZATION = true;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->NEEDS_AUTHORIZATION;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'video' => [
                'required',
                File::types(['mp4'])
                    ->max(2 * 1024 * 1024 * 1024),
            ],
        ];
    }

    public function messages()
    {
        return [
            'video.required' => __('video.upload.required'),
            'video.mimes' => __('video.upload.mimes'),
            'video.max' => __('video.upload.max'),
        ];
    }
}
