---
title: "Magento database resource model not persisting on save"
date: "2019-01-22T15:30:00.000Z"
tags: ["magento", "magento2", "model"]
---

It's been a while since I've done any regular programming within Magento 2, and I was head down getting a new module to work. I was setting up the regular model & resource model for a new database entity like so:

<div class="gatsby-code-title">Foo/Bar/Model/Baz.php</div>

```php
<?php

namespace Foo\Bar\Model;

use Magento\Framework\Model\AbstractModel;
use Foo\Bar\Model\ResourceModel\Baz as BazResourceModel;

class Baz extends AbstractModel
{

    public function _construct()
    {
        $this->_init(BazResourceModel::class);
    }
}
```

<div class="gatsby-code-title">Foo/Bar/Model/ResourceModel/Baz.php</div>

```php
<?php

namespace Foo\Bar\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Baz extends AbstractDb
{
    protected function _construct()
    {
        $this->_init('foo_bar_baz', 'qux');
    }
}
```

Then within another model, I was trying to save a new record to the database using Magento 2's preferred method with a resource object...

<div class="gatsby-code-title">Foo/Bar/Model/SomeOtherModel.php</div>

```php
...

    protected function createBazRecord($data)
    {
        /** @var Baz $baz */
        $baz = $this->bazFactory->create();
        $baz->setData($data);
        $this->cacheResource->save($cache);

        return $cache;
    }

...
```

However, when the code was executed, my data was not persisting to the database. As a matter a fact, I didn't even receive an error. What could it be?

Naturally, I assumed I was doing something wrong and scoured over my code for typos, misspellings, and anything else that could look out of place. Unfortunately, I couldn't find anything, and going a bit crazy, took a lunch break.

After lunch I came back with a fresh set of burrito eyes (today, for some reason they were not sleeping behind the abyss of tortilla carbs). I set a breakpoint and cracked open Xdebug, and... still nothing. Determined, I started reading through the result of the `$this->cacheResource->save($cache)` line and, low and behold, noticed this property:

```php
_isPkAutoIncrement = false
```

Did I mention I was not using an auto-incrementing ID? The astute may have wondered why the above `qux` primary key wasn't `qux_id` -- it is because `qux` was indeed a string. For some reason I always come across all sorts of use-cases for not always using auto-incrementing ID's as my primary ID.

When you create a new resource model that extends `Magento\Framework\Model\ResourceModel\Db\AbstractDb`, it is important to note that the `AbtractDb` class uses the `_isPkAutoIncrement` property throughout the code. Since this defaults to `true`, if you don't use an auto-incrementing ID as your primary key, new saves to the resource model will fail.

...unless, you set it to false within your resource model:


<div class="gatsby-code-title">Foo/Bar/Model/ResourceModel/Baz.php</div>

```php
<?php

namespace Foo\Bar\Model\ResourceModel;

use Magento\Framework\Model\ResourceModel\Db\AbstractDb;

class Baz extends AbstractDb
{
    protected $_isPkAutoIncrement = false; // highlight-line

    protected function _construct()
    {
        $this->_init('foo_bar_baz', 'qux');
    }
}
```

Ironically, this is not the first time I've spent hours trying to debug this exact same issue. I remember doing this a couple years back, and stumbling upon the same solution. Unable to quickly find a solution lead me to writing this blog post, in the hopes that future me will either find this blog post, or the contents herein will get inscribed on the side of my brain, never to be repeated again.
