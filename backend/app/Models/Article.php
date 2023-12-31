<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function categories(){
        return $this->belongsToMany(Category::class, 'category_to_articles', 'article_id', 'category_id');
    }

}
