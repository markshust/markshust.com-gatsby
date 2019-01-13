---
title: "PHP 7's null coalesce operator usage with Objects and Arrays"
date: "2017-08-25T16:21:00.000Z"
tags: ["php", "php7"]
---

PHP 7 introduced the <a href="https://wiki.php.net/rfc/isset_ternary" target="_blank">null coalesce</a> operator. Basically, it's syntactical sugar and shorthand when checking for the existence of a variable and then falling back to some value.

For example, this small script outputs `bar`, because `$foo` is not yet defined.

```php
echo $foo ?? 'bar';
```

It's the same thing as writing the following, just much more readable and succinct:

```php
echo isset($foo) ? $foo : 'bar';
```

## Objects

What isn't documented anywhere though is how you can benefit from null coalesce when working with objects and arrays. Let's say you are wanting to return a property on an object, but aren't sure if that object exists. You need to check the base object by doing multiple checks on object properties and their children: 

```php
<?php
class Foo {}

$foo = new Foo;
echo isset($foo) && isset($foo->b) && isset($foo->b->c) ? $foo->b->c : 'baz';
```

You can see how it can easily become a handful when working with many object properties. With null coalesce, all you need to do is call the deepest object property directly. This code is executes exactly the same as the above:

```php
<?php
class Foo {}

$foo = new Foo;
echo $foo->b->c ?? 'baz';
```

And it even works if the object isn't even defined. This script runs without errors:

```php
echo $foo->b->c ?? 'baz';
```

## Arrays

Another use for null coalesce is when working with arrays, and things like `foreach` loops. For example, let's say we want to iterate over an array, but are not sure if this array exists. We would need to do the following, wrapping the entire `foreach` loop with an `if` to check for it's existence:

```php
if (isset($foo)) {
    foreach ($foo as $bar) {
        echo $bar;
    }
}

echo 'done';
```

Since `$foo` is not yet set, this will output `done` with no errors, because we are using `isset`. Without the `isset` check, this fails.

Null coalesce to the rescue! There's a little known usage here, where you can set the default value for the iterable with null coalesce:

```php
foreach ($foo ?? [] as $bar) {
    echo $bar;
}

echo 'done';
```

This script executes successfully. What happens is that since `$foo` is not defined, null coalesce assigns the iterable the value of an empty array. Since the array is empty, the `foreach` never executes.
