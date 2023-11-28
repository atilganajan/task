<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{

    public function rules()
    {
        return [
            'title' => 'required',
            'description' => 'required',
        ];
    }
}
