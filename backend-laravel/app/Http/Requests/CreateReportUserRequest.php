<?php

namespace App\Http\Requests;

use App\Traits\JsonResponseTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;

class CreateReportUserRequest extends FormRequest
{
    use JsonResponseTrait;

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
            'type_report_id' => ['required', 'numeric', 'exists:App\Models\TypeReport,id'],
            'reported_user_id' => ['required', 'numeric', 'exists:App\Models\User,id'],
        ];
    }

    public function messages()
    {
        return [
            'type_report_id.required' => __('report.user.create.type_report_id.required'),
            'reported_user_id.required' => __('report.user.create.reported_user_id.required'),
            'type_report_id.numeric' => __('report.user.create.type_report_id.numeric'),
            'reported_user_id.numeric' => __('report.user.create.reported_user_id.numeric'),
            'type_report_id.exists' => __('report.user.create.type_report_id.exists'),
            'reported_user_id.exists' => __('report.user.create.reported_user_id.exists'),
        ];
    }
}
