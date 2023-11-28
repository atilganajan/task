<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function edit($id){

        $article = Article::select("title","description")->where("id",$id)->first();

        if(!$article){
            return response()->json(["status"=>false,"message"=>"Article not found"],404);
        }
        return response()->json(["status"=>true,"article"=>$article]);
    }

    public function update(UpdateArticleRequest $request){

        $article= Article::find($request->id);

        if(!$article){
            return response()->json(["status"=>false,"message"=>"Article not found"],404);
        }

        try {
            $article->update([
                "title"=>$request->title,
                "description"=>$request->description
            ]);
            return response()->json(["status"=>true,"message"=>"Updated successfully"]);
        }catch (\Exception $e){
            return response()->json(["status"=>false,"message"=>"Server error"],500);
        }

    }

    public function delete(Request $request){

        $article= Article::find($request->id);

        if(!$article){
            return response()->json(["status"=>false,"message"=>"Article not found"],404);
        }

        $article->delete();
        return response()->json(["status"=>true,"message"=>"Deleted successfully"]);
    }

}
