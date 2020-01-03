---
title: "Locally overriding or extending third-party Composer modules"
date: "2019-01-01T11:19:00.000Z"
tags: ["composer", "magento", "magento2", "php"]
---

Recently, I tried installing the <a href="https://marketplace.magento.com/cybersource-global-payment-management.html" target="_blank">Cybersource  module for Magento 2</a> with composer. This is typically accomplished by running one command:

```meta
composer require cybersource/global-payment-management
```

This specific module is actually a metapackage that installs other dependencies. The subsequent Magento command enables the modules:

```meta
bin/magento module:enable CyberSource_AccountUpdater CyberSource_Address CyberSource_ApplePay CyberSource_Atp CyberSource_BankTransfer CyberSource_Core CyberSource_ECheck CyberSource_KlarnaFinancial CyberSource_PayPal CyberSource_SecureAcceptance CyberSource_Tax CyberSource_VisaCheckout
```

I figured this module will pretty much work with Magento 2.3 as-is, however the Composer dependencies do not allow us to install the module. Running the `composer require` line above leads to the following error:

```meta
    - cybersource/global-payment-management 3.0.0 requires cybersource/module-bank-transfer 3.0.0 -> satisfiable by cybersource/module-bank-transfer[3.0.0].
    - Installation request for cybersource/global-payment-management ^3.0 -> satisfiable by cybersource/global-payment-management[3.0.0].
    - Conclusion: don't install magento/framework 101.0.0
    - cybersource/module-bank-transfer 3.0.0 requires cybersource/module-core ~3.0.0 -> satisfiable by cybersource/module-core[3.0.0, 3.0.1, 3.0.2, 3.0.3].
    - cybersource/module-core 3.0.0 requires magento/module-payment 100.2.* -> satisfiable by magento/module-payment[100.2.0, 100.2.1, 100.2.2, 100.2.3, 100.2.4, 100.2.5].
    - cybersource/module-core 3.0.1 requires magento/module-payment 100.2.* -> satisfiable by magento/module-payment[100.2.0, 100.2.1, 100.2.2, 100.2.3, 100.2.4, 100.2.5].
    - cybersource/module-core 3.0.2 requires magento/module-payment 100.2.* -> satisfiable by magento/module-payment[100.2.0, 100.2.1, 100.2.2, 100.2.3, 100.2.4, 100.2.5].
    - cybersource/module-core 3.0.3 requires magento/module-payment 100.2.* -> satisfiable by magento/module-payment[100.2.0, 100.2.1, 100.2.2, 100.2.3, 100.2.4, 100.2.5].
    - magento/module-payment 100.2.5 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/module-payment 100.2.4 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/module-payment 100.2.3 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/module-payment 100.2.2 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/module-payment 100.2.1 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/module-payment 100.2.0 requires magento/framework 101.0.* -> satisfiable by magento/framework[101.0.0, 101.0.1, 101.0.2, 101.0.3, 101.0.4, 101.0.5, 101.0.6, 101.0.7].
    - magento/framework 101.0.1 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.2 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.3 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.4 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.5 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.6 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - magento/framework 101.0.7 requires colinmollenhour/php-redis-session-abstract 1.3.4 -> satisfiable by colinmollenhour/php-redis-session-abstract[v1.3.4].
    - Conclusion: don't install colinmollenhour/php-redis-session-abstract v1.3.4|install magento/framework 101.0.0
```

We can see that the first required dependency: `cybersource/module-bank-transfer 3.0.0 requires cybersource/module-core ~3.0.0`

Requires another dependency: `cybersource/module-core 3.0.3 requires magento/module-payment 100.2.*`

Which requires another dependency: `magento/module-payment 100.2.5 requires magento/framework 101.0.* `

...and so on. The root of the issue is that the `composer.json` file for this module requires the `magento/module-payment` payment package `100.2.*`, but Magento 2.3 uses the `100.3.*` version:

```javascript
    ...
    "require": {
        "php": "7.0.2|7.0.4|~7.0.6|~7.1.0",
        "magento/module-payment": "100.2.*"
    },
    ...
```

So, we need to modify the modules' composer.json file to update that requirement. What we need to do here is create something like a `vendorlocal` directory, in juxtaposition to the usual `vendor` directory that contains our Composer module installation artifacts. The idea here is to create this `vendorlocal` directory and keep it under version control, and treat it as the "source" repository for installing our specified modules. Note that this differs from the `vendor` folder, which is treated as a build artifact and not typically under version control (artifacts are built at runtime). 

We'll copy the directory structure of the module we wish to override. Usually this module is installed at `vendor/cybersource/module-core`, so we'll create a directory at `vendorlocal/cybersource/module-core`. Why `cybersource/module-core`? Because that is the directory that is failing the dependency requirement at the end of the day. Resolving the `cybersource/module-core 3.0.3 requires magento/module-payment 100.2.*` error should resolve all of the other dependency issues.

How do we get the code for `vendorlocal/cybersource/module-core`? Usually, you can grab the code from GitHub. Unfortunately in this situation, the code is hosted on Magento Marketplace's Composer repository, so our code is not publicly available. The easiest solution to get this code at the moment is to launch a base install of Magento 2.2, install the module with Composer there, and copy over the directory from `vendor/cybersource/module-core`. Note that our only dependency issue is with `cybersource/module-core`, so we don't have to copy over or modify any of the other modules installed from the core metapackage. By not copying these folders over, we'll use the versions from Marketplace.

After copying the folder to `vendorlocal/cybersource/module-core`, let's modify `vendorlocal/cybersource/module-core/composer.json` file to require `"magento/module-payment": "100.3.*"`. Note that the version we copied over is `3.0.3`, however we need a version that differs from Marketplace's version, and also let's us satisfy the other required Composer dependencies with SemVer. I've found a very similar solution is to append a `.0` to the version, so the new version would become `3.0.3.0`. If you require a different PHP version than the initial module, this is also a good time & place to update that as well:

```javascript
    ...
    "require": {
        "php": "7.0.2|7.0.4|~7.0.6|~7.1.0",
        "magento/module-payment": "100.3.*"
    },
    ...
    "version": "3.0.3.0",
    ...
```

One other file we need to update is our base project's `composer.json` in the root of our Magento installation. This update will require us to directly add all of the needed Composer packages, since we do not have access to the `cybersource/global-payment-management` metapackage. Let's add the following to the `require` property:

```javascript
    "require": {
        ...
        "cybersource/module-account-updater": "^3.0",
        "cybersource/module-address": "^3.0",
        "cybersource/module-applepay": "^3.0",
        "cybersource/module-atp": "^3.0",
        "cybersource/module-bank-transfer": "^3.0",
        "cybersource/module-core": "^3.0",
        "cybersource/module-echeck": "^3.0",
        "cybersource/module-klarna": "^3.0",
        "cybersource/module-paypal": "^3.0",
        "cybersource/module-secure-acceptance": "^3.0",
        "cybersource/module-tax": "^3.0",
        "cybersource/module-visa-checkout": "^3.0",
        "magento/product-enterprise-edition": "2.3.0"
    },
```

We must also make one other update to this `composer.json` file, as we need to let Composer know about our `vendorlocal` folder, and have it treat it as a code repository. Let's make this update, adding a `vendorlocal` repository with the type of `path` (local filesystem path) and the URL of the folder containing the contents of our local Composer updates:

```javascript
    ...
    "repositories": {
        ...
        "vendorlocal": {
            "type": "path",
            "url": "vendorlocal/*/*"
        }
    },
    ...
```

This tells Composer to look at every `vendorlocal/{NAMESPACE_NAME}/{MODULE_NAME}` location for Composer packages. We use this star format so we don't need to add more local path repository directives in the future.

Our setup is now complete! The next time we run `composer require cybersource/global-payment-management` again, when it comes time to install the `cybersource/module-core` package, Composer will use the version installed within our `vendorlocal` folder instead of the one supplied from the Marketplace repository. Since our `3.0.3.0` version still satisfies SemVer requirements, there will be no dependency issues to deal with.

> Note that if you are using Docker or another system that requires host bind mounts, be sure to add a host bind mount directive to the `vendorlocal` folder, so changes from your host will be synced back to the container or VM. You also want to keep the `vendorlocal` folder under VCS, as that is the new "source of truth" for the needed Composer overrides.
