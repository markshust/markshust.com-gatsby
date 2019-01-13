---
title: "Better way to modify conditions in Magento template files"
date: "2012-08-08T09:56:00.000Z"
tags: ["magento", "magento1"]
---

As it is with almost all Magento projects, you will have times when you need to modify sections of code in custom template files. There are many approaches and ways to handle these changes, but there are some that are more optimal than others.

There is a special case regarding code blocks within conditional logic in which I like to take a certain approach. Let's say we need to make updates & changes to the following file:

<div class="gatsby-code-title">app/code/community/Foo/Bar/controllers/Adminhtml/BazController.php</div>

```php{numberLines: true}
<?php
/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    design
 * @package     base_default
 * @copyright   Copyright (c) 2012 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
 
/**
 * Product media data template
 *
 * @see Mage_Catalog_Block_Product_View_Media
 */
?>
<?php
    $_product = $this->getProduct();
    $_helper = $this->helper('catalog/output');
?>
<?php if ($_product->getImage() != 'no_selection' && $_product->getImage()): ?>
<p class="product-image product-image-zoom">
    <?php
        $_img = '<img id="image" src="'.$this->helper('catalog/image')->init($_product, 'image').'" alt="'.$this->htmlEscape($this->getImageLabel()).'" title="'.$this->htmlEscape($this->getImageLabel()).'" />';
        echo $_helper->productAttribute($_product, $_img, 'image');
    ?>
</p>
<p class="zoom-notice" id="track_hint"><?php echo $this->__('Double click on above image to view full picture') ?></p>
<div class="zoom">
    <img id="zoom_out" src="<?php echo $this->getSkinUrl('images/slider_btn_zoom_out.gif') ?>" alt="<?php echo $this->__('Zoom Out') ?>" title="<?php echo $this->__('Zoom Out') ?>" class="btn-zoom-out" />
    <div id="track">
        <div id="handle"></div>
    </div>
    <img id="zoom_in" src="<?php echo $this->getSkinUrl('images/slider_btn_zoom_in.gif') ?>" alt="<?php echo $this->__('Zoom In') ?>" title="<?php echo $this->__('Zoom In') ?>" class="btn-zoom-in" />
</div>
<script type="text/javascript">
//<![CDATA[
    Event.observe(window, 'load', function() {
        product_zoom = new Product.Zoom('image', 'track', 'handle', 'zoom_in', 'zoom_out', 'track_hint');
    });
//]]>
</script>
<?php else: ?>
<p class="product-image">
    <?php
        $_img = '<img src="'.$this->helper('catalog/image')->init($_product, 'image')->resize(265).'" alt="'.$this->htmlEscape($this->getImageLabel()).'" title="'.$this->htmlEscape($this->getImageLabel()).'" />';
        echo $_helper->productAttribute($_product, $_img, 'image');
    ?>
</p>
<?php endif; ?>
<?php if (count($this->getGalleryImages()) > 0): ?>
<div class="more-views">
    <h2><?php echo $this->__('More Views') ?></h2>
    <ul>
    <?php foreach ($this->getGalleryImages() as $_image): ?>
        <li>
            <a href="#" onclick="popWin('<?php echo $this->getGalleryUrl($_image) ?>', 'gallery', 'width=300,height=300,left=0,top=0,location=no,status=yes,scrollbars=yes,resizable=yes'); return false;" title="<?php echo $this->htmlEscape($_image->getLabel()) ?>"><img src="<?php echo $this->helper('catalog/image')->init($this->getProduct(), 'thumbnail', $_image->getFile())->resize(56); ?>" width="56" height="56" alt="<?php echo $this->htmlEscape($_image->getLabel()) ?>" /></a>
        </li>
    <?php endforeach; ?>
    </ul>
</div>
```

You are going through the project specifications, and realize that the product zoom and additional image thumbnails are not needed with this project, because the client just wants to use one high-quality image.

The easiest/quickest way to do this would be to remove the following lines, presented in this diff:

```diff{numberLines: true}
diff --git a/media.phtml b/media.phtml
index a2f1eea..df61be5 100644
--- a/media.phtml
+++ b/media.phtml
@@ -34,45 +34,9 @@
     $_product = $this->getProduct();
     $_helper = $this->helper('catalog/output');
 ?>
-<?php if ($_product->getImage() != 'no_selection' && $_product->getImage()): ?>
-<p class="product-image product-image-zoom">
-    <?php
-        $_img = '<img id="image" src="'.$this->helper('catalog/image')->init($_product, 'image').'" alt="'.$this->htmlEscape($this->getImageLabel()).'" title="'.$this->htmlEscape($this->getImageLabel()).'" />';
-        echo $_helper->productAttribute($_product, $_img, 'image');
-    ?>
-</p>
-<p class="zoom-notice" id="track_hint"><?php echo $this->__('Double click on above image to view full picture') ?></p>
-<div class="zoom">
-    <img id="zoom_out" src="<?php echo $this->getSkinUrl('images/slider_btn_zoom_out.gif') ?>" alt="<?php echo $this->__('Zoom Out') ?>" title="<?php echo $this->__('Zoom Out') ?>" class="btn-zoom-out" />
-    <div id="track">
-        <div id="handle"></div>
-    </div>
-    <img id="zoom_in" src="<?php echo $this->getSkinUrl('images/slider_btn_zoom_in.gif') ?>" alt="<?php echo $this->__('Zoom In') ?>" title="<?php echo $this->__('Zoom In') ?>" class="btn-zoom-in" />
-</div>
-<script type="text/javascript">
-//<![CDATA[
-    Event.observe(window, 'load', function() {
-        product_zoom = new Product.Zoom('image', 'track', 'handle', 'zoom_in', 'zoom_out', 'track_hint');
-    });
-//]]>
-</script>
-<?php else: ?>
 <p class="product-image">
     <?php
         $_img = '<img src="'.$this->helper('catalog/image')->init($_product, 'image')->resize(265).'" alt="'.$this->htmlEscape($this->getImageLabel()).'" title="'.$this->htmlEscape($this->getImageLabel()).'" />';
         echo $_helper->productAttribute($_product, $_img, 'image');
     ?>
 </p>
-<?php endif; ?>
-<?php if (count($this->getGalleryImages()) > 0): ?>
-<div class="more-views">
-    <h2><?php echo $this->__('More Views') ?></h2>
-    <ul>
-    <?php foreach ($this->getGalleryImages() as $_image): ?>
-        <li>
-            <a href="#" onclick="popWin('<?php echo $this->getGalleryUrl($_image) ?>', 'gallery', 'width=300,height=300,left=0,top=0,location=no,status=yes,scrollbars=yes,resizable=yes'); return false;" title="<?php echo $this->htmlEscape($_image->getLabel()) ?>"><img src="<?php echo $this->helper('catalog/image')->init($this->getProduct(), 'thumbnail', $_image->getFile())->resize(56); ?>" width="56" height="56" alt="<?php echo $this->htmlEscape($_image->getLabel()) ?>" /></a>
-        </li>
-    <?php endforeach; ?>
-    </ul>
-</div>
```

This method, while verbose, does work just fine. However, look how many lines have been changed in this commit. Believe it or not, removing the code has the opposite effect of what you might think, and actually leads to code bloat in this diff, with 36 lines of diffs! These diffs are important when undergoing version upgrades, as you need to execute diffs to find out what has changed in since the last upgrade.

I like to handle *removing* these conditional logic blocks a different way, by adding in a 'false' to the conditional logic statement.

```diff{numberLines: true}
diff --git a/media.phtml b/media.phtml
index a2f1eea..e26c9fa 100644
--- a/media.phtml
+++ b/media.phtml
@@ -34,7 +34,7 @@
     $_product = $this->getProduct();
     $_helper = $this->helper('catalog/output');
 ?>
-<?php if ($_product->getImage() != 'no_selection' && $_product->getImage()): ?>
+<?php if (false && $_product->getImage() != 'no_selection' && $_product->getImage()): ?>
 <p class="product-image product-image-zoom">
     <?php
         $_img = '<img id="image" src="'.$this->helper('catalog/image')->init($_product, 'image').'" alt="'.$this->htmlEscape($this->getImageLabel()).'" title="'.$this->htmlEscape($this->getImageLabel()).'" />';
@@ -64,7 +64,7 @@
     ?>
 </p>
 <?php endif; ?>
-<?php if (count($this->getGalleryImages()) > 0): ?>
+<?php if (false && count($this->getGalleryImages()) > 0): ?>
 <div class="more-views">
     <h2><?php echo $this->__('More Views') ?></h2>
     <ul>
```

And there you go, 2 lines of code in this diff. This is a unique situation in which more code is actually less. I welcome all comments and feedback on this approach.
