<?php

namespace App\Http\Resources\Category;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;


class CategoryListCollection extends ResourceCollection
{
    public function toArray($request)
    {

        return [
            'current_page' => $this->currentPage(),
            'data' => $this->collection->map(function ($category) {
                return new CategoryResource($category);
            }),
            'first_page_url' => $this->url(1),
            'from' => $this->firstItem(),
            'last_page' => $this->lastPage(),
            'last_page_url' => $this->url($this->lastPage()),
            'links' => $this->paginationLinks(),
            'next_page_url' => $this->nextPageUrl(),
            'path' => $this->path(),
            'per_page' => $this->perPage(),
            'prev_page_url' => $this->previousPageUrl(),
            'to' => $this->lastItem(),
            'total' => $this->total(),
        ];
    }

    protected function paginationLinks()
    {
        return [
            'prev' => $this->previousPageUrl(),
            'next' => $this->nextPageUrl(),
            'links' => $this->getPageLinks(),
        ];
    }

    protected function getPageLinks()
    {
        return collect($this->getUrlRange(1, $this->lastPage()))
            ->map(function ($url, $page) {
                return [
                    'url' => $url,
                    'label' => $page,
                    'active' => $this->currentPage() == $page,
                ];
            })->toArray();
    }
}
