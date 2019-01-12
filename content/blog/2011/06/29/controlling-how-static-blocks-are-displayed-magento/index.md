---
title: "Controlling how static blocks are displayed in Magento"
date: "2011-06-29T15:41:00.000Z"
tags: ["cms", "layout", "magento", "magento1", "xml"]
---

To disable a static block globally, go to CMS > Static Blocks > Select One > set Status = Disabled > Save

To control the disable of static blocks on various pages, to go CMS > Widgets > Select One > Reference "Layout Updates" section

To remove a specific block for a specific page, go to CMS > Pages > Manage Content > Select One

Click the currently published Revision number on the initial page > Click the Design tab on the left

In the Layout XML section paste in the appropriate block of code dependent on the block you want to remove, for example to unset everything from the left sidebar:

```xml
<reference name="left">
    <action method="unsetChildren"></action>
</reference>
```

To unset a certain static block (named name_of_block) from the right sidebar:

```xml
<reference name="right">
    <action method="unsetChild">
        <name>name_of_block</name>
    </action>
</reference>
```

You can find the id of the static block by going to CMS > Static Blocks and looking up the value in the column Identifier.
