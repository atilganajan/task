<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Article;
use Illuminate\Support\Carbon;

class FetchArticleJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $articleData;

    /**
     * Create a new job instance.
     *
     * @param array $articleData
     */
    public function __construct(array $articleData)
    {
        $this->articleData = $articleData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Article::create([
            'source_id' => $this->articleData['source']['id'],
            'source_name' => $this->articleData['source']['name'],
            'author' => $this->articleData['author'],
            'title' => $this->articleData['title'],
            'description' => $this->articleData['description'],
            'url' => $this->articleData['url'],
            'url_to_image' => $this->articleData['urlToImage'],
            'published_at' => Carbon::parse($this->articleData['publishedAt'])->toDateTimeString(),
            'content' => $this->articleData['content'],
        ]);

    }
}
