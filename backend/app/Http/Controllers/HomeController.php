<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class HomeController extends Controller
{

    public function getArticles()
    {
        $articles = Article::select("id","title","description","url_to_image")->whereNotNull(["title","description","url_to_image"])->paginate(6);

        return response()->json($articles);
    }

}
