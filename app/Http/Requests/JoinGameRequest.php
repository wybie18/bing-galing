<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JoinGameRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'min:2',
                'max:50',
                'regex:/^[a-zA-Z0-9\s\-_\.]+$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Player name is required.',
            'name.min' => 'Player name must be at least 2 characters.',
            'name.max' => 'Player name cannot exceed 50 characters.',
            'name.regex' => 'Player name can only contain letters, numbers, spaces, hyphens, underscores, and dots.',
        ];
    }
}
