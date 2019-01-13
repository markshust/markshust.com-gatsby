---
title: "There is absolutely no difference in Magento Community and Enterprise extensions / modules"
date: "2012-02-01T13:45:00.000Z"
tags: ["magento", "magento1"]
---

Let me start off my saying that I am a Magento Enterprise Developer, and that I work with both Magento Community and Enterprise editions every day. I also sell customized Magento extensions.

Do you notice something about my modules? As in, the option to purchase a Community or Enterprise edition? There isn't one. Why, you may ask? Because there is a **zero difference** in core functionality between a Community "version" and an Enterprise "version" of an extension / module. Yes, I said it.

**No difference.**

This is because when creating an extension, you are overriding the Magento core code that exists in `app/code/core/Mage` (or `app/design/frontend` &amp; `skin/frontend` for theming updates). Do you know something about the app/code/core/Mage folder? Everything in that folder is **exactly the same regardless of Magento version**. This means that both Community and Enterprise versions have the exact same files in that folder.

When it comes to theming, both editions also share the same folders and files in app/code/design/base and skin/frontend/base. Now, the Enterprise edition has a much nicer theme installed (in app/code/design/enterprise and skin/frontend/enterprise), while Community edition has the more mundane "classic" Magento look you are used to (in app/code/design/default and skin/frontend/default). Both versions share the same 'base' package, and all Magento extensions, if they are designed properly, should store theming files in the 'base' package, as that is the final fallback layer of Magento theming and provides the greatest ability for you to customize, override and extend any theming file.

So, why do extension developers charge more for "Enterprise-only" versions, and tell you that they only work on Enterprise? One reason:

- They know Enterprise customers have a larger budget, so they can pad pricing to these clients

Now, while I continue to rant on the absolute similarity of developing extensions for these two versions, I do want to make note that extension developers offer an additional reason to make an Enterprise "version" of the extension: support. They say that support of the Enterprise version is higher than that of a Community "version". Um, read this article again, thoroughly; both versions share the same code-base, and the level of support is therefore, you guessed it: **exactly the same**.

All of my ranting aside, it is definitely viable for an extension developer to in fact offer an "Enterprise-only" extension. For it to be an actual "Enterprise-only" extension, it needs to override app/code/core/Enterprise namespaced files, possibly in addition to the Mage files. I've never come across an extension that actually does this, and while it's possible for extensions like these to exist, they would be few and far between. My best guestimation of the actual figure of extensions such as these would likely total less than 1% of all Magento extensions that exist in the entire communtiy, if it is even possible with Magento's licensing model to develop extensions such as these.

The reason for this article was not to tick-off any of the Magento extension developers out there (a lot of them make absolutely great extensions!), but to inform the public how Magento extensions work, and to help stop the spread of Magento misinformation.

So, it is very valid for you to ask the extension developer if it contains overrides of Enterprise-only features.

And if it doesn't? Go ahead and buy that Community "version", and save the padded fees at no risk.
