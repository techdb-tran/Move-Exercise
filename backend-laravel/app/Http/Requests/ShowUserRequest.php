<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowUserRequest extends FormRequest
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
        ];
    }

    public function messages()
    {
        return [
            'id.numeric' => __('user.update.id.numeric'),
        ];
    }
}
