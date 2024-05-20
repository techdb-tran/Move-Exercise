<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteReportUserRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'ids.*' => ['required', 'numeric', 'exists:App\Models\Report,id'],
        ];
    }

    public function messages()
    {
        return [
            'ids.required' => __('report.delete.id.required'),
        ];
    }
}
