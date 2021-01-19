---
title: "Creating custom layout files and variables in Magento blocks and templates"
date: "2012-01-09T11:49:00.000Z"
tags: ["layout", "magento", "magento1", "xml"]
---

Sometimes it is necessary to create a custom layout file. Other times, you may need to define and set custom variables for use in your template file. This article demonstrates the ability to do both, in hopes to clarify the "Magento XML Magic" that is going on behind the scenes.

It is important to follow the MVC pattern, and keep data in models, logic in controllers, and use the view strictly to echo out data.

This example also shows you how to define a custom layout XML file in your module config, so you can update the layout XML from within your own module.

This example assumes you are rewriting the catalog product view block. To find out which class block to override, reference the block *type* for the appropriate class to overwrite; in this case we find the appropriate class to override is **Catalog\_Block\_Product\_View**.

Let's go ahead and create your module, and setup all of the appropriate XML.

<div class="gatsby-code-title">app/etc/modules/Foo_Bar.xml</div>

```xml
<?xml version="1.0"?>
<config>
    <modules>
        <Foo_Bar>
            <active>true</active>
            <codePool>community</codePool>
        </Foo_Bar>
    </modules>
</config>
```

<div class="gatsby-code-title">app/code/community/Foo/Bar/etc/config.xml</div>

```xml
<?xml version="1.0"?>
<config>
    <modules>
        <Foo_Bar>
            <version>1.0.0</version>
        </Foo_Bar>
    </modules>
    <global>
        <blocks>
            <catalog>
                <rewrite>
                    <!-- This is how and where we rewrite Mage_Catalog_Product_View -->
                    <product_view>Foo_Bar_Block_Catalog_Product_View</product_view>
                </rewrite>
            </catalog>
        </blocks>
        <models>
            <foo_bar>
                <!-- This is where we define our model directory -->
                <class>Foo_Bar_Model</class>
            </foo_bar>
        </models>
    </global>
    <frontend>
        <layout>
            <updates>
                <foo_bar>
                    <!-- Here, we define the foo_bar handle for our layout update XML -->
                    <!-- This file's base directory is app/design/frontend/base/default/layout -->
                    <!-- We also put bar.xml in it's own 'foo' directory to separate our code from core -->
                    <file>foo/bar.xml</file>
                </foo_bar>
            </updates>
        </layout>
    </frontend>
</config>
```

This is our custom layout XML file. We look in `app/design/frontend/base/default/layout/` for the appropriate XML handle to override. Once you find it (in this case, `catalog.xml`), take the name of the block you want to override, and reference it in your layout XML. We then use the setTemplate method using the action handle to set the appropriate template for this block.

<div class="gatsby-code-title">app/design/frontend/base/default/layout/foo/bar.xml</div>

```xml
<?xml version="1.0"?>
<layout>
    <catalog_product_view>
        <reference name="product.info">
            <!-- This template file uses the base directory app/design/frontend/base/default/template -->
            <action method="setTemplate"><template>foo/bar/catalog/product/view.phtml</template></action>
        </reference>
    </catalog_product_view>
</layout>
```

Now that our XML is all taken care of, let's create our baz object by defining it within our model directory. Extending Varien_Object let's our model inherit the properties that are defined within that class.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Model/Baz.php</div>

```php
<?php
class Foo_Bar_Model_Baz extends Varien_Object
{
}
```

Yep, that easy! Just a blank class.

We then create our custom block, where we will reference the baz object we just created, and use Magento's magic setter methods to set the desired variable and it's value.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Block/Catalog/Product/View.php</div>

```php
<?php
class Foo_Bar_Block_Catalog_Product_View extends Mage_Catalog_Block_Product_View
{
    protected function _prepareLayout()
    {
        $baz = Mage::getSingleton('foo_bar/baz');
        $baz->setQux('Hello world!');
         
        // Just set our variable and get out (send back to default method)
        return parent::_prepareLayout();
    }
}
```

The final step is to retrieve the object and the appropriate variable assigned to that object, again using the singleton method, and Magento's magic getter method.

<div class="gatsby-code-title">app/design/frontend/base/default/template/foo/bar/catalog/product/view.phtml</div>

```php
<?php
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * ...
 * @category    design
 * @package     base_default
 * @copyright   Copyright (c) 2011 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
 
/**
 * Product view template
 *
 * @see Mage_Catalog_Block_Product_View
 * @see Mage_Review_Block_Product_View
 */
?>
<?php $baz = Mage::getSingleton('foo_bar/baz'); ?>
<h1><?php echo $baz->getQux(); ?></h1>
<?php $_helper = $this->helper('catalog/output'); ?>
<?php $_product = $this->getProduct(); ?>
...
```

I hope this article clears up some confusion on how to define and use a custom variable within Magento template files. Following coding standards makes it very easy for everyone else who looks at your code (as well as yourself in the future) to know exactly where to look to change and update your code.
