<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCategoryRequest extends FormRequest
{

    public function rules()
    {

        return [
            'name' => ['required','max:50',Rule::unique('categories')],
        ];

    }


}
