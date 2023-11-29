<?php

namespace App\Http\Resources\Article;

use App\Http\Resources\Category\CategoryCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'author'=>$this->author,
            'title' =>$this->title,
            'description' => $this->description,
            'url_to_image' => $this->url_to_image,
            'published_at' =>Carbon::parse($this->published_at)->format("d.m.Y [H:i]")
        ];
    }
}
