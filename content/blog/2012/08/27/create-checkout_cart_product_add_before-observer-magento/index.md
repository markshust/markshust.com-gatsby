---
title: "Create the checkout_cart_product_add_before observer in Magento"
date: "2012-08-27T11:12:00.000Z"
tags: ["magento", "magento1"]
---

For some reason no one can explain, it appears that the event observer `checkout_cart_product_add_before` never existed in Magento (even though `checkout_cart_product_add_after` does). Say what?!??

Anyways, it's fairly easy to go ahead and dispatch this event. Just add this to your module's config.xml to rewrite the checkout/cart model:

```xml
<?xml version="1.0">
<config>
    ...
    <global>
        ...
        <models>
            <checkout>
                <rewrite>
                    <cart>Foo_Bar_Model_Checkout_Cart</cart>
                </rewrite>
            </checkout>
        </models>
        ...
    </global>
    ...
</config>
```

Then create your model that adds in the dispatch event to trigger the observers:

```php
<?php
class Foo_Bar_Model_Checkout_Cart extends Mage_Checkout_Model_Cart
{
    /**
     * Create checkout_cart_product_add_before event observer
     *
     * @param   int|Mage_Catalog_Model_Product $productInfo
     * @param   mixed $requestInfo
     * @return  Mage_Checkout_Model_Cart
     */
    public function addProduct($productInfo, $requestInfo=null)
    {
        $product = $this->_getProduct($productInfo);
        Mage::dispatchEvent('checkout_cart_product_add_before', array('product' => $product)); // highlight-line
         
        return parent::addProduct($productInfo, $requestInfo=null);
    }
}
```

Now you can have fun triggering `checkout_cart_product_add_before` event observers! Enjoy!
