<?php

namespace App\Console\Commands;

use App\Jobs\FetchArticleJob;
use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

// Import ShouldQueue
use App\Models\Article;

class FetchArticles extends Command implements ShouldQueue
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fetch-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch articles from News API and store in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            Log::info('Fetching articles from News API...');

            $client = new Client();
            $response = $client->get("https://newsapi.org/v2/everything?q=history&apiKey=" . env('NEWS_API'));
            $data = json_decode($response->getBody(), true);

            if ($data['status'] === 'ok') {
                Log::info('Articles fetched successfully.');

                $articles = $data['articles'];

                foreach ($articles as $articleData) {

                    FetchArticleJob::dispatch($articleData);
                }

                Log::info('Articles added to the queue for processing.');
            } else {
                Log::error('Error fetching articles. API response: ' . json_encode($data));
            }
        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());
        }
    }
}
