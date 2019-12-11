---
title: "Unqualified and fully qualified name usage in code"
date: "2019-12-11T14:20:00.000Z"
tags: ["php"]
---

It's pretty common to see fully qualified names being used throughout code. A fully qualified name is a class name which begins with a separator. Let's look at an example using a PHP class:

**Unqualified name:**

`Category`

**Qualified name:**

`Magento\Catalog\Model\Category`

**Fully qualified name:**

`\Magento\Catalog\Model\Category`

The problem with using fully qualified names is that they make code hard to read. Looking at this quick class definition of the same class:

```php
...
class Category extends \Magento\Catalog\Model\AbstractModel implements
    \Magento\Framework\DataObject\IdentityInterface,
    \Magento\Catalog\Api\Data\CategoryInterface,
    \Magento\Catalog\Api\Data\CategoryTreeInterface
{
...
```

You can see that all the letters makes the code hard to process. A better practice would be to hoist usage of fully qualified names to the top of the class file with use statements, then update the usage of those classes in your code to instead use unqualified names.

This leads code to instead look like this:

```php
...
use \Magento\Catalog\Api\Data\CategoryInterface;
use \Magento\Catalog\Api\Data\CategoryTreeInterface;
use \Magento\Catalog\Model\AbstractModel;
use \Magento\Framework\DataObject\IdentityInterface;

class Category extends AbstractModel implements
    IdentityInterface,
    CategoryInterface,
    CategoryTreeInterface
{
...
```

While the result of executing this code is exactly the same as the previous version, the second approach provides some benefits.

First, by defining all imports at the top of files, external classes wind up being all defined in one place. This **makes code reviews easier to process**, and allows you to **more easily identify dead imports** (that is, imports which are not used throughout code).

Secondly, it's now much easier to read the definition of the class. Rather than needing to process the code reading the entire fully qualified names, **the usage of unqualified names makes the code much easier to read**. Cutting down on the cognitive reasoning needed when looking at code offloads your need to wonder what is going on here, allowing you to focus on the actual code details rather than getting distracted by an implementation detail.
