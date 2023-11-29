<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\Article\ArticleListCollection;
use App\Http\Resources\Article\EditArticleResource;
use App\Http\Resources\Category\EditCategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function edit($id)
    {
        try {
            Log::info("Editing article data with ID: $id");

            $article = Article::find($id)->first();

            if (!$article) {
                Log::error("Article with ID $id not found");
                return response()->json(["status" => false, "message" => "Article not found"], 404);
            }

            Log::info("Article with ID $id found successfully.");

            $article = new EditArticleResource($article);

            Log::info("Article  data retrieved successfully.");

            return response()->json(["status" => true, "article" => $article]);
        } catch (\Exception $e) {
            Log::error("Error getting article with ID $id: " . $e->getMessage());
            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }
    }


    public function update(UpdateArticleRequest $request)
    {
        $articleId = $request->id;
        try {
            Log::info("Updating article with ID: $articleId ");

            $article = Article::find($articleId);

            if (!$article) {
                Log::error("Article with ID $articleId not found");
                return response()->json(["status" => false, "message" => "Article not found"], 404);
            }
            Log::info("Article with ID $articleId found successfully.");

            $article->update([
                "title" => $request->title,
                "description" => $request->description
            ]);

            Log::info("Article with ID $articleId updated successfully.");

            return response()->json(["status" => true, "message" => "Updated successfully"]);
        } catch (\Exception $e) {
            Log::error("Error updating article with ID $articleId: " . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

    public function delete(Request $request)
    {
        $articleId = $request->id;

        try {
            Log::info("Deleting article with ID: $articleId");

            $article = Article::find($articleId);

            if (!$article) {
                Log::error("Article with ID $articleId not found");
                return response()->json(["status" => false, "message" => "Article not found"], 404);
            }

            Log::info("Article with ID $articleId found successfully.");

            $article->delete();

            Log::info("Article with ID $articleId deleted successfully.");

            return response()->json(["status" => true, "message" => "Deleted successfully"]);
        } catch (\Exception $e) {
            Log::error("Error deleting article with ID $articleId: " . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }
    }


    // TODO Category
    public function categoryStore(CreateCategoryRequest $request)
    {
        try {
            Log::info('Creating category with name: ' . $request->name);

            $category = Category::create(["name" => $request->name]);

            if (count($request->article_ids) > 0) {
                Log::info('Attaching articles to category: ' . $category->name);

                $category->articles()->attach($request->article_ids);
            }

            Log::info('Category created successfully.');


            return response()->json(["status" => true, "message" => "Category created successfully"]);
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

    public function categoryEdit($id)
    {
        try {
            Log::info("Editing category with ID: $id");
            $category = Category::find($id);

            if (!$category) {
                Log::error("Category with ID $id not found");
                return response()->json(["status" => false, "message" => "Category not found"], 404);
            }

            Log::info("Category with ID $id found successfully.");

            $category = new EditCategoryResource($category);
            $articles = new ArticleListCollection(Article::whereNotIn('id', $category->articles()->pluck('articles.id')->toArray())
                ->whereNotNull(["title", "description", "url_to_image"])
                ->paginate(12));

            Log::info("Category edit data retrieved successfully.");

            return response()->json(["status" => true, "category" => $category, "articles" => $articles]);
        } catch (\Exception $e) {
            Log::error("Error editing category with ID $id: " . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

    public function categoryUpdate(UpdateCategoryRequest $request)
    {
        $categoryId = $request->id;

        try {
            Log::info("Updating category with ID: $categoryId");

            $category = Category::find($categoryId);

            if (!$category) {
                Log::error("Category with ID $categoryId not found");

                return response()->json(["status" => false, "message" => "Category not found"], 404);
            }

            Log::info("Category with ID $categoryId found successfully.");

            $category->update(["name" => $request->name]);

            $newArticleIds = $request->article_ids;

            $existingArticleIds = $category->articles()->pluck("articles.id")->toArray();

            Log::info("Attaching articles to category and updated category: " . $category->name);


            $category->articles()->sync($newArticleIds);

            $detachIds = array_diff($existingArticleIds, $newArticleIds);

            Log::info("Detaching articles from category: " . $category->name);

            $category->articles()->detach($detachIds);

            Log::info("Category updated successfully.");

            return response()->json(["status" => true, "message" => "Updated successfully"]);
        } catch (\Exception $e) {
            Log::error("Error updating category with ID $categoryId: " . $e->getMessage());

            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }
    }

    public function categoryDelete(Request $request)
    {
        $categoryId = $request->id;

        try {
            Log::info("Deleting category with ID: $categoryId");
            $category = Category::find($request->id);

            if (!$category) {
                Log::error("Category with ID $categoryId not found");
                return response()->json(["status" => false, "message" => "Category not found"], 404);
            }
            Log::info("Category with ID $categoryId found successfully.");

            $category->delete();

            Log::info("Category deleted successfully.");

            return response()->json(["status" => true, "message" => "Deleted successfully"]);
        } catch (\Exception $e) {
            Log::error("Error deleting category with ID $categoryId: " . $e->getMessage());
            return response()->json(["status" => false, "message" => "Unexpected error"], 500);
        }

    }

}
