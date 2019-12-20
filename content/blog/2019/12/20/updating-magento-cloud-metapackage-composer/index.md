---
title: "Updating the Magento Cloud metapackage with Composer"
date: "2019-12-20T13:37:00.000Z"
tags: ["magento", "composer"]
---

The <a href="https://devdocs.magento.com/" target="_blank">Magento DevDocs</a> contain instructions on how to <a href="https://devdocs.magento.com/guides/v2.3/comp-mgr/cli/cli-upgrade.html" target="_blank">upgrade Magento 2 by command line</a>. While useful for standard Magento projects, the instructions vary a bit for Magento Cloud. Here is my take on how to upgrade a Magento Cloud project the easiest way.

First, open your `composer.json` file and look for the line that looks like:

```
 "magento/magento-cloud-metapackage": ">=2.3.1 <2.3.2",
 ```

This is the line which controls which version of Magento Cloud you are running. The Magento Cloud Composer metapackage contains the root Magento 2 package, for example `magento/product-enterprise-edition=2.3.3`, along with all of the packages needed for Magento Cloud. In the line above, the version constraint `>=2.3.1 <2.3.2` really references Magento version 2.3.1.

Update the version constraint so that it instead references your desired version. In this case I want to upgrade from version 2.3.1 to 2.3.3, so I will update it to:

```
"magento/magento-cloud-metapackage": ">=2.3.3 <2.3.4",
```

Our next step is to usually run:

```
composer update
```

However when doing so, I received the following error:

```
Fatal error: Uncaught LogicException: Module 'Yotpo_Yotpo' from '/var/www/html/app/code/Yotpo/Yotpo' has been already defined in '/var/www/html/vendor/yotpo/magento2-module-yotpo-reviews'. in /var/www/html/vendor/magento/framework/Component/ComponentRegistrar.php:50
```

This is because Magento 2.3.3 comes with the Yotpo module built-in. I needed to remove any code from `vendor/yotpo` and `app/code/Yotpo`, and then run `composer update` again.

After doing so, Composer will update all of the appropriate packages to bring your version of Magento up to 2.3.3, and the `composer update` line should be successful.

Next, I'll make sure all of the caches are purged by running:

```
bin/magento cache:flush
```

After that I will run all of the setup upgrade scripts contained in the code to bring the Magento database up to the desired version by running:

```
bin/magento setup:upgrade
```

You're code and database should now be all update to date. You'll most likely now need to start the process of testing the site and correcting any outdated code and etc. (this will take some time) before actually launching your site on the updated version.
