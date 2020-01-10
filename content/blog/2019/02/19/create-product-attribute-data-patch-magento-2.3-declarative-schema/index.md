---
title: "Create a product attribute data patch with Magento 2.3's declarative schema"
date: "2019-02-19T10:50:00.000Z"
tags: ["magento", "magento2", "declarativeschema"]
---

I was refactoring one of my Magento 2 modules and noticed that the Magento 2.3 core modules use the <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/declarative-schema/" target="_blank">declarative schema</a> approach rather than setup upgrade scripts. This  is the new recommended approach for Magento versions 2.3 and up, as upgrade scripts will be phased out in favor of this declarative schema approach in the future.

I stumbled on the <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/declarative-schema/data-patches.html" target="_blank">data patches documentation</a>, however this doesn't really apply for creating product attributes within declarative schema scripts.

First, we need to create a class that implements `DataPatchInterface`, and instantiate a copy of the `EavSetupFactory` class within the constructor.

The naming convention Magento core files use for modifications to attributes within declarative schema scripts is: **Verb + (Name or Explanation) + Attribute(s)**. So, if we are trying to add a single attribute named `alternate_color`, we name our class `AddAlternateColorAttribute`.

Within your `Setup\Patch\Data` folder, create a new file named `AddAlternativeColorAttribute.php` with the contents:

```php
<?php
namespace Acme\Foo\Setup\Patch\Data;

use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class AddAlternativeColorAttribute implements DataPatchInterface
{
    /** @var ModuleDataSetupInterface */
    private $moduleDataSetup;

    /** @var EavSetupFactory */
    private $eavSetupFactory;

    /**
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param EavSetupFactory $eavSetupFactory
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        EavSetupFactory $eavSetupFactory
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->eavSetupFactory = $eavSetupFactory;
    }
}
```

The `DataPatchInterface` expects the implementation of three functions: `apply`, `getDependencies` and `getAliases`. 

The `apply` function is where we will create our attribute items. Since we are only creating attributes, there is no need to call `startSetup` and `endSetup` functions here anymore. We just create an instance of the `EavSetupFactory`, passing in our `moduleDataSetup` object, and add our attribute:

```php
    /**
     * {@inheritdoc}
     */
    public function apply()
    {
        /** @var EavSetup $eavSetup */
        $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);

        $eavSetup->addAttribute('catalog_product', 'alternative_color', [
            'type' => 'int',
            'label' => 'Alternative Color',
            'input' => 'select',
            'used_in_product_listing' => true,
            'user_defined' => true,
        ]);
    }
```

Note that just about all attribute parameters except `type`, `label`, and `input` are optional here, and we should really only define the properties which differ from default settings & values. In this case, we are creating a `select` dropdown and we want to set `user_defined` to `true` so a user can add values to this attribute from the admin. We'll also toggled `used_in_product_listing` to `true` so we have access to this attribute within the product listing database query.

The `getDependencies` function expects an array of strings containing class names of dependencies. This is new functionality specific to declarative schema scripts, and tells Magento to execute the "patches" we define here first, before our setup script. This is how Magento controls the order of how patch scripts are executed.

In this situation, we won't have any dependencies, so we'll just return an empty array:

```php
    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }
```

The last function `getAliases`, which defines aliases for this patch class. Since we don't really specify version numbers anymore, our class name could change, and if it does, we should supply the old class name here so it's not executed a second time (patches are only ever ran once). Since this is a new script, we won't have any aliases, so we'll again return an empty array:

```php
    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
```

One last bonus that we won't really use, but I think it's worth mentioning... if we specify a `getVersion` function, we can return a string with a version number.

If the **database version number of the module is lower than the version specified in the file**, the patch will execute.

- Database Version: 2.0.4
- File Version: 2.0.5
- Result: 2.0.4 < 2.0.5, <span style="color: green;">patch executes!</span>

If the **database version number of the module is equal to or higher than the version specified in the file**, the patch will not execute.

- Database Version: 2.0.5
- File Version: 2.0.5
- Result: 2.0.5 = 2.0.5, <span style="color: red;">patch does not execute!</span>
<br />
<br />
- Database Version: 2.0.6
- File Version: 2.0.5
- Result: 2.0.6 > 2.0.5, <span style="color: red;">patch does not execute!</span>

It would seem to me that best practices would denote to not use the versioning capabilities at all, as only certainsituations will warrant versioning, possibly those with complex installations or specific requirements. The format would be as follows:

```php
    /**
     * {@inheritdoc}
     */
    public static function getVersion()
    {
        return '2.0.6';
    }
```

All that explaned, here is our final class:

<div class="gatsby-code-title">app/code/Acme/Foo/Setup/Patch/Data/AddAlternativeColorAttribute.php</div>

```php{numberLines: true}
<?php
namespace Acme\Foo\Setup\Patch\Data;

use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class AddAlternativeColorAttribute implements DataPatchInterface
{
    /** @var ModuleDataSetupInterface */
    private $moduleDataSetup;

    /** @var EavSetupFactory */
    private $eavSetupFactory;

    /**
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param EavSetupFactory $eavSetupFactory
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        EavSetupFactory $eavSetupFactory
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->eavSetupFactory = $eavSetupFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function apply()
    {
        /** @var EavSetup $eavSetup */
        $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);

        $eavSetup->addAttribute('catalog_product', 'alternative_color', [
            'type' => 'int',
            'label' => 'Alternative Color',
            'input' => 'select',
            'used_in_product_listing' => true,
            'user_defined' => true,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
}
```

Now when we run `bin/magento setup:upgrade` to apply the updates, our data patch executes and the attribute is created. For all patches which are successfully executed, Magento inserts a record into the `patch_list` database table with the value of the `patch_name` field being the value of our patch class, like so:

<div class="gatsby-code-title">patch_list</div>

```bash
patch_id    patch_name
...
126         Magento\WidgetSampleData\Setup\Patch\Data\InstallWidgetSampleData
127         Magento\WishlistSampleData\Setup\Patch\Data\InstallWishlistSampleData
128         Acme\Foo\Setup\Patch\Data\AddAlternativeColorAttribute //highlight-line
```

Removing the value from the `patch_list` table will cause the patch to re-execute when running `bin/magento setup:upgrade` again, so this approach can be extremely useful when first creating and debugging patch scripts.
