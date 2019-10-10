---
title: "Magento 2 models & entities"
date: "2019-10-10T11:11:00.000Z"
tags: ["beginningmagento", "magento", "magento2", "php"]
---

A model in Magento isn't this type of model:

![Ben Stiller really really really ridiculously good-looking](goodlooking.gif)

While they aren't really really really ridiculously good-looking, a model is a basic container that represents any entity or object.

I really really really like burritos, so let's use them as an example:

```php
<?php
namespace MarkShust\Food\Model;

use Magento\Framework\Model\AbstractModel;

class Burrito extends AbstractModel
{
}
```

This is basically the simplest version possible of how we can represent a burrito object as a model. Extending the `AbstractModel` class superpowers all of the burrito objects we'll create from this model, providing them with access to all of the functions defined within the `AbstractModel` class.

So how do you use a model? That's a bit trickier to explain, because it involves some advanced concepts of Magento. Let's skip over the nitty gritty, but just know that we create entities of the model through "factories". For now, let's picture the "factory" being our favorite eating place (where they create burritos as you wait in line).

First, we need to create the factory in the constructor:

```php
<?php
public function __construct(BurritoFactory $burritoFactory)
{
    $this->burritoFactory = $burritoFactory.
}

...
```

Now in another function, we can use that factory to create as many burritos as we want:

```php
<?php
...

public function feedMeMore()
{
    $marksPlainBurrito = $this->burritoFactory->create();
    $marksBarbacoaBurrito = $this->burritoFactory->create(['meat' => 'barbacoa', 'sauce' => 'spicy']);
    $juliesPlainBurrito = $this->burritoFactory->create();
}
```

I just introduced another quick new concept -- you can pass an array of properties to the `create` method, defining whatever you need, to create your perfect burrito.

I wanted this post to keep going, but I'm awfully hungry now. Until next week!

![Mark eating a blimp in Vegas](blimp.jpg)
