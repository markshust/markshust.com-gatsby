---
title: "Magic (Pass-Through) ViewModels for Magento 2"
date: "2019-03-13T14:06:00.000Z"
tags: ["blocks", "magento", "magento2", "viewmodels"]
---

The current best practice for Magento 2.3 is to use ViewModels rather than Block classes. Jisse of Yireo wrote a great blog post about <a href="https://www.yireo.com/blog/2017-08-12-viewmodels-in-magento-2" target="_blank">ViewModels in Magento 2</a> that you should really read if you haven't already.

I recently found myself needing the ability to access a single class' method, specifically the customer session's `isLoggedIn()` method, however it seemed silly to create an abstraction of this model as a ViewModel so that I can access this method.

I stumbled upon a post by Fabian Schmengler on integer\_net's blog about <a href="https://www.integer-net.com/decorators-for-magento-templates/" target="_blank">Decorators for Magento Templates</a>, and it gave me an idea -- why not use <a href="http://php.net/manual/en/language.oop5.magic.php" target="_blank">PHP's magic methods</a> in the same format Fabian was, but instead of for decorators, just for calling a specific model's method from a phtml file? We could do this today with Object Manager, but that would be highly frowned upon as it goes around the dependency injection layer of Magento 2 (see <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/object-manager.html" target="_blank">usage rules</a>).

As far as I know this implementation is architecturally sound, as it keeps the DI layer intact but opens up the ability to easily access a model's methods without a whole lot of boiler. Let's look at an example.

In this case, we want to call the `isLoggedIn()` method of the `Magento\Customer\Model\Session` class. Create a `Foo\Customer` module:

<div class="gatsby-code-title">app/code/Foo/Customer/registration.php</div>

```php{numberLines: true}
<?php
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(ComponentRegistrar::MODULE, 'Foo_Customer', __DIR__);
```

<div class="gatsby-code-title">app/code/Foo/Customer/etc/module.xml</div>

```xml{numberLines: true}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Foo_Customer" setup_version="1.0.0"/>
</config>
```

This module will be simple and contain just one ViewModel for this demo:

<div class="gatsby-code-title">app/code/Foo/Customer/ViewModel/Session.php</div>

```php{numberLines: true}
<?php
namespace Foo\Customer\ViewModel;

use Magento\Customer\Model\Session as Object;
use Magento\Framework\View\Element\Block\ArgumentInterface;

class Session implements ArgumentInterface
{
    private $object;

    public function __construct(Object $object)
    {
        $this->object = $object;
    }

    public function __call($method, $args)
    {
        return $this->object->$method(...$args);
    }
}
```

What we are doing here is just using DI to instantiate the `Magento\Customer\Model\Session` object,  then use `__call` to "pass-through" calls made to this ViewModel to this customer session object. This is the ViewModel in it's entirety. Note how I'm also naming the `$object` here -- this is purely so we can copy/paste this file over and over again and we just need to change the namespace, class name & imported class for each ViewModel, then we're done.

Now, say we are programmatically adding an `authlinks` block to the `layout/default.xml` file of our theme:

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="header.container">
            <block name="authlinks" template="Magento_Theme::authlinks.phtml">
                <arguments>
                    <argument name="customer_session_view_model" xsi:type="object">Foo\Customer\ViewModel\Session</argument>
                </arguments>
            </block>
        </referenceContainer>
    </body>
</page>
```

We can then use this ViewModel within our phtml template to access the `isLoggedIn()` method:

```php
<?php
/** @var \Magento\Customer\Model\Session $customerSession */
$customerSession = $block->getCustomerSessionViewModel();
?>
<div class="authlinks">
<?php if ($customerSession->isLoggedIn()) : ?>
    <a class="logout" href="<?= $this->getUrl('customer/account/logout') ?>"><?= __('Log Out') ?></a>
<?php else : ?>
    <a class="logout" href="<?= $this->getUrl('customer/account/login') ?>"><?= __('Log In') ?></a>
<?php endif; ?>
</div>
```

This implementation can be used wherever you wish to easily access a single (or multiple) methods of a pre-existing module or other core Magento method, but don't want to wire up specific custom functions for calling these other functions. The ViewModels are "magic" and just "pass-through" any calls to the ViewModel directly to the object instantiated within the ViewModel. They can also still be plugged-into or overridden with a class preference, since we aren't using Object Manager directly and the dependency injection layer is still in place.

We can probably deduce a few best practices by using this implementation. One is that ViewModels do not necessarily need to be linked 1:1 to a phtml template. In fact, I can probably argue it's better to split things up into many small ViewModels as much as possible (each with a single responsibility), with each located in their respective modules.

Another is to not use `view_model` as an argument name or `$viewModel` as a variable, but rather use detailed names, such as `customer_session_view_model`. Since view models don't really contain any logic and just "pass-through" to the original class, why not simplify the variable name used within the template to an alias of the original class? Using just `$customerSession` makes a lot of sense here, and naming things other than `$viewModel` for regular ViewModels (ex. `$thisViewModel`) then opens up the ability to use multiple ViewModels within a single phtml file.

I do not believe using many ViewModels within one phtml file is bad practice at all, as it keeps every ViewModel small and easy to maintain. You absolutely need to type hint your ViewModels within your phtml file though:

```/** @var \Magento\Customer\Model\Session $customerSession */```

There's one "gotcha" here -- we'll typehint to the original class (`\Magento\Customer\Model\Session`), not the pass-through ViewModel. This ensures command+clicks and intellicompletes map to the correct original class. Without doing this, it would be very hard to find out where code is coming from and make it extremely difficult to debug issues, especially in cases where many ViewModels exist.

Of course, if you find yourself seemingly using too many ViewModels, your block most likely needs to be broken down into multiple child blocks, as template files should always be pretty small so they are easy to maintain and reason about.

If you have any feedback from this post, please tweet at me and let me know!
