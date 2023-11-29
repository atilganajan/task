<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function articles(){
        return $this->belongsToMany(Article::class, 'category_to_articles', 'category_id', 'article_id')->withTimestamps();
    }


}


