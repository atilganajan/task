<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{

    public function rules()
    {
        $categoryId = $this->id;

        return [
            'name' => ['required','max:50',Rule::unique('categories')->ignore($categoryId)],
        ];

    }


}
