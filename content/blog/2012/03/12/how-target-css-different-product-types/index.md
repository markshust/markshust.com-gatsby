---
title: "How to target CSS for different product types"
date: "2012-03-12T11:13:00.000Z"
tags: ["magento", "magento1", "css"]
---

To normally target a certain CSS specificity of a page in Magento, you would reference a class in the `<body>` tag (`.cms-index-index`, `.catalog-product-view`, etc.). However, there isn't a way to target the specificity of a certain product type.

There is almost always more than one way to do something in Magento. One option would be to create a custom extension, which taps into Magento's process of creating a custom class name and outputting it onto the `<body>` html's class attribute. This option, however, would involve an experienced Magento programmer to create this extension.

Another option is to target the product type layout handle, and add a separate CSS file for that product type. To do this, add a PRODUCT\_TYPE\_handle to your layout file:

<div class="gatsby-code-title">app/design/frontend/yourpackage/default/layout/local.xml</div>

```xml{numberLines: true}
<?xml version="1.0"?>
<layout version="0.1.0">
    ...
    <PRODUCT_TYPE_handle>
        <reference name="head">
            <action method="addCss"><stylesheet>css/PRODUCT_TYPE_handle.css</stylesheet></action> // highlight-line
        </reference>
    </PRODUCT_TYPE_handle>
    ...
</layout>
```

Then, create a file at `skin/frontend/yourpackage/default/css/PRODUCT_TYPE_handle.css`, and add in your appropriate CSS which you want specific to this product type. Replace PRODUCT_TYPE_handle with the product type you would like to override.

Since this update involves updating XML, be sure to clear the cache in order to rebuild the XML layer and see your changes.

## Magento Product Types and Layout Handles

**Product Type**: Layout Handle

- **Simple:** PRODUCT\_TYPE\_simple
- **Configurable:** PRODUCT\_TYPE\_configurable
- **Grouped:** PRODUCT\_TYPE\_grouped
- **Virtual:** PRODUCT\_TYPE\_virtual
- **Downloadable:** PRODUCT\_TYPE\_downloadable
- **Bundle:** PRODUCT\_TYPE\_bundle
