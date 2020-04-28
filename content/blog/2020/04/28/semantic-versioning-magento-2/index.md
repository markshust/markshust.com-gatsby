---
title: "Semantic Versioning in Magento 2"
date: "2020-04-28T14:00:00.000Z"
tags: ["magento", "magento2"]
---

Knowing how Magento handles versioning is important for compatibility reasons, so you know if your code is expected to function in new versions.

Magento modules follow semantic versioning (also known as SemVer) to keep track of compatibility states. Semantic versioning is usually thought of as `MAJOR`.`MINOR`.`PATCH`, however a much better way to think of SemVer is `BREAKING`.`FEATURE`.`FIX`.

## Initial Release

Versions are typically published with the initial version:

`1.0.0`

Code introduced to the module over time can affect its compatibility with the application. Typically releases are classified as either "breaking" releases, "feature" releases, or "bugfix" releases.

Breaking releases can contain features & bugfixes, and feature releases can also contain bugfixes, but bugfix releases can only contain bugfixes. Following this strict process leads to predictable software delivery with very little possibility of compatibility issues.

## Fix Releases

Let's assume the first subsequent release of the module contain one or more bugfixes. The module would then be at version:

`1.0.1`

## Feature Releases

Now, let's assume the next release is a big new feature of the module. As long as the new feature code is compatible with the code in version `1.x.x` (meaning any code extended by an end-user within the previous version of `1.0.0` will continue to function), that new version can be released as a child of the `1.x.x` release number:

`1.1.0`

Note how a new feature version resets the FIX version back to `0`. This is so one could track the release and bugfix status of each feature release.

## Breaking Releases

Finally, if a change is ever made to the module which breaks compatibility with the current version, or any previous version of the module, the `BREAKING` version is incremented. This change is to be made irregardless of how big or small the breaking change actually is.

`2.0.0`

This breaking release resets both `FEATURE` and `FIX` versions back to `0`, and the process repeats.

## Marketing Versions/Names

Because even a small change could force a `BREAKING` version to be incremented, it is common for software packages to have a separate "marketing version" or name. This number is used strictly for marketing purposes and prefixes the SemVer version, all the while still properly following SemVer practices:

**All of these are version 1 for marketing purposes:**

`1.1.0.0`

`1.1.1.0`

`1.2.0.0`

Luckily, Magento module versions are typically tied to Magento's marketing version (ex. Magento `2`), so this is rarely needed or a concern when creating modules for Magento.

## Magento Core Release Naming

Magento itself (not its modules) has been following the "Marketing Version" naming scheme. This means that Magento `2.3.1` could perhaps contain breaking updates when upgrading from the `2.3.0` version.

With the release of version `2.3.3` in October of 2019, Magento added a quaternary release for security releases for versions `2.3.2` and onwards (example: `2.3.2-p1`). These releases will only contain security fixes and will not introduce breaking features or updates. When upgrading from version `2.3.2` to `2.3.3` however, you still need to be concerned about this release having breaking updates.

> This is a generally accepted practice for Magento, as modules themselves still follow SemVer. To understand more about Magento versioning and why this approach was established, you can read [Alan Kent's Semantic Versioning](https://alankent.me/2016/09/20/semantic-versioning-and-patch-2-1-2/) article.​
​