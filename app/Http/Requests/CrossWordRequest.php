<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class CrossWordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'word_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value !== 'FREE' && ! is_numeric($value)) {
                        return $fail('Word ID must be a valid number or "FREE".');
                    }

                    if ($value !== 'FREE' && ! DB::table('words')->where('id', $value)->exists()) {
                        return $fail('The specified word does not exist.');
                    }
                },
            ],

            'action'  => [
                'required',
                'string',
                'in:cross,uncross',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'word_id.required' => 'Word ID is required.',
            'word_id.integer'  => 'Word ID must be a valid number.',
            'word_id.exists'   => 'The specified word does not exist.',
            'action.required'  => 'Action is required.',
            'action.in'        => 'Action must be either "cross" or "uncross".',
        ];
    }
}
