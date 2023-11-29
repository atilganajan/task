<?php

namespace App\Http\Controllers;


use App\Http\Resources\Category\CategoryListCollection;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getCategories()
    {
        $categories = new CategoryListCollection(Category::paginate(6));
        return response()->json($categories);

    }
}
