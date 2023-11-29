<?php

namespace App\Http\Resources\Category;

use App\Http\Resources\Article\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EditCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
          "id" => $this->id,
          "name" => $this->name,
          'articel_ids' =>  $this->articles()->get()->pluck("id") ,
        ];
    }

}
