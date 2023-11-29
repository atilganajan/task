<?php

namespace App\Http\Controllers;

use App\Http\Resources\Article\ArticleListCollection;
use App\Models\Article;

class HomeController extends Controller
{

    public function getArticles()
    {
        $articles = new ArticleListCollection(Article::whereNotNull(["title","description","url_to_image"])->paginate(6));

        return response()->json($articles);

    }

}
