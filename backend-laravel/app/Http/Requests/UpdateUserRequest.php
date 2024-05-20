<?php

namespace App\Http\Requests;

use App\Enums\UserStatus;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'id' => $this->route('user'),
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
            'is_verified' => ['required', 'boolean'],
            'status' => ['required', new EnumValue(UserStatus::class)],
            'expire_ban' => ['required_if:status,' . UserStatus::SUSPEND, 'numeric'],
        ];
    }

    public function messages()
    {
        return [
            'id.numeric' => __('user.update.id.numeric'),
            'status.required' => __('user.update.status.required'),
            'is_verified.required' => __('user.update.is_verified.required'),
            'expire_ban.required' => __('user.update.expire_ban.required'),
            'status.numeric' => __('user.update.status.numeric'),
            'is_verified.boolean' => __('user.update.is_verified.boolean'),
        ];
    }
}
