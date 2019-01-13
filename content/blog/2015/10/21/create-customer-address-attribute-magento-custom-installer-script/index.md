---
title: "Create a customer address attribute in Magento with a custom installer script"
date: "2015-10-21T23:38:00.000Z"
tags: ["magento", "magento2"]
---

Recently, I needed to create a custom customer address attribute, and needed a real simple way to do it. There are a lot of bloated examples online, but this is actually really easy.</p><p>First, create your module definition file. Note that we're putting our module in the local code pool because it's specific to just our one store.

<div class="gatsby-code-title">app/etc/modules/Foo_Bar.xml</div>

```xml{numberLines: true}
<?xml version="1.0"?>
<!--
 * @category    Foo
 * @package     Foo_Bar
-->
<config>
    <modules>
        <Foo_Bar>
            <active>true</active>
            <codePool>local</codePool>
        </Foo_Bar>
    </modules>
</config>
```

Then, we'll create our config XML. Here, we are defining version 0.1.0, and simply setting up our resource setup definition.

<div class="gatsby-code-title">app/code/local/Foo/Bar/etc/config.xml</div>

```xml{numberLines: true}
<?xml version="1.0"?>
<!--
 * @category    Foo
 * @package     Foo_Bar
-->
<config>
    <modules>
        <Foo_Bar>
            <version>0.1.0</version>
        </Foo_Bar>
    </modules>
    <global>
        <resources>
            <foo_bar_setup>
                <setup>
                    <module>Foo_Bar</module>
                    <class>Mage_Eav_Model_Entity_Setup</class>
                </setup>
            </foo_bar_setup>
        </resources>
    </global>
</config>
```

Note how we don't need to define a connection, or even create a setup definition for our module. All we are doing here is saying to create a new setup definition for our Foo_Bar module, and use the Mage_Eav_Model_Entity_Setup class, which will be used to run the installer script.

Finally, we'll create our installer script in PHP. The location and naming of this file is important, as Magento does all of the lookups and routing in the backend to accomplish this. The customer address attribute we are creating is called *baz*. Note that we can only create attributes based off of Mage_Customer_Model_Entity_Setup with this method. If you want to create many attributes from different setup files, you'll either need to create multiple models, or define your our setup resource model.

<div class="gatsby-code-title">app/code/local/Foo/Bar/sql/foo_bar_setup/mysql4-install-0.1.0.php</div>

```php{numberLines: true}
<?php
/**
 * @category    Foo
 * @package     Foo_Bar
 */
 
/* @var $installer Mage_Eav_Model_Entity_Setup */
$installer = $this;
 
$installer->startSetup();
 
$this->addAttribute('customer_address', 'baz', array(
    'label'             => 'Baz',
    'type'              => 'varchar',
    'input'             => 'text',
    'position'          => 140,
    'visible'           => true,
    'required'          => false,
    'is_user_defined'   => true,
));
 
$installer->endSetup();
```

And that's all she wrote! You'll now be able to call your customer address attribute wherever you wish.
