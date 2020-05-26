---
title: "Simplifying Magento Setup Data Patch Scripts with SimpleData"
date: "2020-05-26T12:05:00.000Z"
tags: ["magento", "magento2"]
---

Managing CMS content in Magento across environments can be difficult. Most of the time clients manage CMS pages and blocks through the admin. However, if you need to deploy an update tied to a specific code release, or released along with a certain code update, updating CMS content through the admin console after pushing out a code update is a really awful smell in your deployment process.

Why is updating content through the admin after a code push a bad idea? For one, it requires manual intervention, which could lead to human error. Secondly, it requires time to implement after a code push. If your Magento site depends upon a certain CMS block to exist or be updated to a specific layout, it's possible your site will either error out or your site's layout will be borked until you update it.

Another side effect of not updating these blocks programmatically is that your many feature branch, integration, staging, and production environments will become out of sync. Since you will inevitably miss updating a specific environment with specific CMS content, the state of all environments will start to deviate from each other, and that is definitely not what is expected.

By making all of these updates programmatically, you are ensuring that every CMS block or content will be made in every single environment, automatically, without human intervention. This leads to a consistent deployment process in which what you expect to happen, will happen.

## Data Patch Scripts

The way to programmatically update CMS content is with [data patch scripts](https://devdocs.magento.com/guides/v2.3/extension-dev-guide/declarative-schema/data-patches.html). When `bin/magento setup:upgrade` is executed, Magento loops through all the data patch classes and checks whether the class has been installed by referencing the `patch_list` database table. If the class exists in the `patch_list` table, it skips execution, but if it does not find one it executes the data patch script and inserts that class into the table.

Let's say you wanted to change the title of a CMS page. To do so using a normal data patch script, you would need to write something that resembles the following:

```php
<?php
declare(strict_types = 1);

namespace MarkShust\Data\Setup\Patch\Data;

use Magento\Cms\Api\Data\PageInterface;
use Magento\Cms\Api\Data\PageInterfaceFactory;
use Magento\Cms\Api\GetPageByIdentifierInterface;
use Magento\Cms\Model\PageRepository;
use Magento\Framework\Exception\CouldNotDeleteException;
use Magento\Framework\Exception\CouldNotSaveException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Model\AbstractModel;
use Magento\Store\Model\Store;
use Psr\Log\LoggerInterface;

class MyDataPatch
{
    /** @var GetPageByIdentifierInterface */
    protected $getPageByIdentifier;

    /** @var LoggerInterface */
    protected $logger;

    /** @var PageInterfaceFactory */
    protected $pageInterfaceFactory;

    /** @var PageRepository */
    protected $pageRepository;

    /**
     * UpdateConfig constructor.
     * @param GetPageByIdentifierInterface $getPageByIdentifier
     * @param LoggerInterface $logger
     * @param PageInterfaceFactory $pageInterfaceFactory
     * @param PageRepository $pageRepository
     */
    public function __construct(
        GetPageByIdentifierInterface $getPageByIdentifier,
        LoggerInterface $logger,
        PageInterfaceFactory $pageInterfaceFactory,
        PageRepository $pageRepository
    ) {
        $this->getPageByIdentifier = $getPageByIdentifier;
        $this->logger = $logger;
        $this->pageInterfaceFactory = $pageInterfaceFactory;
        $this->pageRepository = $pageRepository;
    }
  
    /**
     * {@inheritdoc}
     */
    public static function getDependencies(): array
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases(): array
    {
        return [];
    }

    /**
     * Our data patch script.
     */
    public function apply(): void
    {
        $identifier = $data['identifier'];
        $storeId = $data['store_id'] ?? Store::DEFAULT_STORE_ID;

        try {
            $page = $this->getPageByIdentifier->execute($identifier, $storeId);
        } catch (NoSuchEntityException $e) {
            $this->logger->critical($e->getMessage());
        }

        $page->setData('title', 'Foo Bar');

        try {
            $this->pageRepository->save($page);
        } catch (CouldNotSaveException $e) {
            $this->logger->critical($e->getMessage());
        }
    }
}
```

This is a LOT to take in! It's no wonder most don't want to deal with data patch scripts. But after analyzing this code, I realized a lot of this can be abstracted away into the background.

## Simplifying Magento data structures

Introducing, [MarkShust_SimpleData](https://github.com/markshust/magento2-module-simpledata), a module which simplifies calling Magento data structures.

By abstracting away the dependencies, object instantiating, interface requirements, as well as catching exceptions to the background, we're left with a a simplified data patch script which looks like this:

```php
<?php
declare(strict_types = 1);

namespace MarkShust\Data\Setup\Patch\Data;

use MarkShust\SimpleData\Setup\Patch\SimpleDataPatch;

class MyDataPatch extends SimpleDataPatch
{
    public function apply()
    {
        $this->page->save([
            'identifier' => 'foo_bar',
            'title' => 'Foo Bar',
        ]);
    }
}
```

The module has helpers for `$this->page`, `$this->block` as well as `$this->config`. You can check out the [usage of the module](https://github.com/markshust/magento2-module-simpledata#usage), and there are also [a list of full examples on GitHub](https://github.com/markshust/magento2-module-simpledata#examples-using-simpledatapatch). I'm hoping to add additional helpers for catalog categories, products, attributes, and so on in the future.

## Let's write more abstractions

If you notice code repeating itself, or the presence of a ton of boilerplate code (as is the case in Magento code), you can use this as an example of how to abstract a lot of it into the background. Check out the [full API source code](https://github.com/markshust/magento2-module-simpledata/tree/master/Api) for the module to see some additional magic I'm doing under the hood to help ensure these scripts are as simple and easy to use as possible.

I hope we see a lot more of these abstractions in the wild in the future, as they greatly simplify our code. A byproduct of this concept is that scripts are easier to debug and code review, which also helps avoid introducing new bugs into our codebase.

The best code is no code, and the more we can aim to strive to that goal, the better we can write clean code.
