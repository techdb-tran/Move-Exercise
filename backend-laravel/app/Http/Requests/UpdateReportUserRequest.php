<?php

namespace App\Http\Requests;

use App\Enums\ReportStatus;
use BenSampo\Enum\Rules\EnumValue;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReportUserRequest extends FormRequest
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
            'id' => $this->route('report'),
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
            'status' => ['required', new EnumValue(ReportStatus::class)],
        ];
    }

    public function messages()
    {
        return [
            'id.numeric' => __('report.update.id.numeric'),
            'status.required' => __('report.update.status.required'),
        ];
    }
}
