<?php

namespace App\Http\Requests;

use App\Enums\DurationVideo;
use App\Enums\LevelVideo;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class UpdateVideoRequest extends FormRequest
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

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id' => $this->route('video'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id' => ['required', 'numeric'],
            'title' => ['required', 'string'],
            'thumbnail' => [
                'nullable', File::image()
                    ->max(12 * 1024 * 1024)
            ],
            'category_id' => ['required', 'numeric', 'exists:App\Models\Category,id'],
            'keyword' => ['nullable', 'string'],
            'duration' => ['required', new EnumValue(DurationVideo::class)],
            'level' => ['required', new EnumValue(LevelVideo::class)],
            'is_comment' => ['required', 'boolean'],

        ];
    }

    public function messages()
    {
        return [
            'id.numeric' => __('validation.required'),
            'id.required' => __('validation.required'),
            'title.required' => __('validation.required'),
            'thumbnail.image' => __('validation.image'),
            'thumbnail.max' => __('validation.max.file'),
            'category_id.required' => __('validation.required'),
            'category_id.exists' => __('validation.exists'),
            'duration.required' => __('validation.required'),
            'level.required' => __('validation.required'),
            'is_comment.required' => __('validation.required'),
            'is_comment.boolean' => __('validation.boolean'),
        ];
    }
}
