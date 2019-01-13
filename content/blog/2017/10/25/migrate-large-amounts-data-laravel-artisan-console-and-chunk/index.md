---
title: "Migrate large amounts of data in Laravel with Artisan Console and Chunk"
date: "2017-10-25T13:35:00.000Z"
tags: ["artisan", "laravel", "php"]
---

I've recently had to create a script to migrate a large amount of data post-deployment. This presented a couple issues; one being that the script needed to be performant, another being that since it took at least a few minutes to run on a couple hundred thousand rows, I needed to display the status of the script for devops so it didn't appear to be hungup or failed.

I resolved on using a combination of <a href="https://laravel.com/docs/5.5/collections#method-chunk" target="_blank">`chunk`</a> and <a href="https://laravel.com/docs/5.5/collections#method-each" target="_blank">`each`</a>, and passing through the total number of iterable records by reference. This way the migration script didn't run out of memory, as queries were chunked down to 100 rows at a time. It also allows the use of a simple helper function to output the status to the console.

Without further ado, here you go!

```php
<?php
namespace App\Console\Commands;

use App\Foo;
use App\Bar;
use Illuminate\Console\Command;

class MigrateFoo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:foo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate the foo table data to the new format';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = Foo::where('bar_id', '!=', 0);
        $queryCount = $query->count();
        $i = 0;

        $query->chunk(100, function ($foos) use ($queryCount, &$i) {
            $foos->each(function ($foo) {
                $query = Bar::where('baz_id', $foo->baz_id)
                    ->where('qux_id', $foo->qux_id);

                if ($bar = $query->get()->first()) {
                    $foo->bar_id = $bar->id;
                    $foo->save();
                }
            });

            $i += $foos->count();
            $this->showStatus($i, $queryCount);
        });

        $this->showStatus($numAnswers, $queryCount, true);
    }

    /**
     * Console output of status every progression of XX records.
     *
     * @param int $i
     * @param int $total
     * @param bool $force
     */
    public function showStatus(int $i, int $total, bool $force)
    {
        $outputEvery = 5000;

        if ($i % outputEvery === 0 || $force) {
            $percentage = $total > 0
                ? round(($i / $total) * 100)
                : 0;

            echo "Foo table $i of $total records updated ($percentage% Complete)" . PHP_EOL;
        }
    }
}
```
