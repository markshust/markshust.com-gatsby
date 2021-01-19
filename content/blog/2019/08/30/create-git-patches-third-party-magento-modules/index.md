---
title: "Create Git patches for third-party Magento modules"
date: "2019-08-30T10:57:00.000Z"
tags: ["git", "github", "magento", "magento2", "php"]
---

After updating Magento to 2.3.2, I noticed the builds failing for one of my projects in Magento Cloud after pushing code up for a deployment. After checking the logs, it appeared there was an error with a third-party module, in this case Firebear's <a href="https://firebearstudio.com/improved-configurable-products-for-magento-2.html" target="_blank">Improved Configurable Product</a> module:

```bash
    [2019-08-29 14:27:04] INFO: Sample data media was not found. Skipping.  
    [2019-08-29 14:27:04] NOTICE: Running DI compilation  
    [2019-08-29 14:27:04] INFO: php ./bin/magento setup:di:compile  --ansi --no-interaction  
    W: 
    W: In CompileDi.php line 63:
    W:                                                                                
    W:   Command php ./bin/magento setup:di:compile  --ansi --no-interaction returne  
    W:   d code 255                                                                   
    W:                                                                                
    W: 
    W: In Shell.php line 110:
    W:                                                                                
    W:   Command php ./bin/magento setup:di:compile  --ansi --no-interaction returne  
    W:   d code 255                                                                   
    W:                                                                                
    W: 
    W: build:generate
    W: 
    [2019-08-29 14:27:40] CRITICAL: 
      Compilation was started.
      %message% 0/7 [>---------------------------]   0% < 1 sec 76.5 MiB
%message% 0/7 [>---------------------------]   0% < 1 sec 76.5 MiB
Proxies code generation... 0/7 [>------------------------]   0% < 1 sec 76.5 MiB
Proxies code generation... 1/7 [===>---------------------]  14% 1 sec 82.5 MiB
Repositories code generation... 1/7 [===>------------------]  14% 1 sec 82.5 MiBPHP Fatal error:  Declaration of Firebear\ConfigurableProducts\Block\Product\View\Type\Bundle\Type\Select::getValuesHtml() must be compatible with Magento\Catalog\Block\Product\View\Options\Type\Select::getValuesHtml(): string in /app/vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php on line 97
      
      Fatal error: Declaration of Firebear\ConfigurableProducts\Block\Product\View\Type\Bundle\Type\Select::getValuesHtml() must be compatible with Magento\Catalog\Block\Product\View\Options\Type\Select::getValuesHtml(): string in /app/vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php on line 97  
    [2019-08-29 14:27:40] CRITICAL: Command php ./bin/magento setup:di:compile  --ansi --no-interaction returned code 255  
  
  E: Error building project: Step failed with status code 255.

E: Error: Unable to build application, aborting.
```

The line we care about here is:

```bash
Repositories code generation... 1/7 [===>------------------]  14% 1 sec 82.5 MiBPHP Fatal error:  Declaration of Firebear\ConfigurableProducts\Block\Product\View\Type\Bundle\Type\Select::getValuesHtml() must be compatible with Magento\Catalog\Block\Product\View\Options\Type\Select::getValuesHtml(): string in /app/vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php on line 97
```

### Return type declarations

It took me a second to realize what was going on here, as  <a href="https://www.php.net/manual/en/migration70.new-features.php#migration70.new-features.return-type-declarations" target="_blank">return type declarations</a> are fairly new in the Magento ecosystem and I haven't yet seen an error like this. That said, breaking down the error...

Declaration of

`Firebear\ConfigurableProducts\Block\Product\View\Type\Bundle\Type\Select::getValuesHtml()`

must be compatible with:

`Magento\Catalog\Block\Product\View\Options\Type\Select::getValuesHtml(): string`

...is enough to diagnose the error. The signature of the function `getValuesHtml()` does not match it's parents': `getValuesHtml(): string`.

If we open up the file `vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php` to line 97, we can see:

```php
    public function getValuesHtml()
```

does not match the parent class' `Magento\Catalog\Block\Product\View\Options\Type\Select` function declaration:

```php
    public function getValuesHtml() : string
```

### Replicating the issue

It appears Magento is starting to add return type declarations to functions, which ensures that functions always return a specific type of variable. When you are extending a class which has a return type declaration defined, the child class must also contain the same return type declaration, otherwise you will get this error.

From this error log, we are also aware it's triggered from the line:

`php ./bin/magento setup:di:compile  --ansi --no-interaction `

You'll want to checkout the same branch locally which was throwing the deployment error, and running the same line above to confirm the existance of the error. Once it's replicated locally, it can be fixed.

```bash
bin/magento setup:di:compile --ansi --no-interaction
Compilation was started.
Repositories code generation... 1/7 [====>-----------------------]  14% < 1 sec 94.5 MiB
Fatal error: Declaration of Firebear\ConfigurableProducts\Block\Product\View\Type\Bundle\Type\Select::getValuesHtml() must be compatible with Magento\Catalog\Block\Product\View\Options\Type\Select::getValuesHtml(): string in /var/www/html/vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php on line 97
```

> What's great about the process we are going through is that you need not care if an update or fix is in place already from the third-party module, and you aren't reliant on their response times. In full disclosure, I did not check with Firebear to see if an update was even available for this module. I'm also not putting any blame on Firebear for this code, as this was just a good example for me to use to demonstrate how to cleanly update third-party module code. This was the only item erroring out in my build, so I chose to just move forward with a very simple patch, and to figure out how to do this in the future so I'm not relying on the response of third-parties which could potentially hault the ability to work on a project.

### Creating the Git patch

Since we're now able to replicate the error, our next step is to create a patch. Since Magento Cloud uses `git-apply` to apply patches on deployments, as we learned from how the blog post <a href="/2019/08/26/apply-magento-2-patch-github-pull-request/">Apply a Magento 2 patch from a GitHub pull request</a>, we want to make sure we use Git to also create the patch to make sure it can successfully be applied.

This means that we need to first get the offending file into version control. Since the `vendor` folder an ephemeral artifact, we don't ever store this folder on version control. This folder is generated at build-time, and is also in our gitignore file. We're going to only add this file to VCS temporarily though, just to create our patch file.

Let's create an ephemeral branch.

```bash
git checkout -b feature/fix-firebear-select-return-type
```

Then, force add the file to VCS and commit:

```bash
git add -f vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php
git commit -m "Initial commit of original Firebear Select file"
```

> In case you are wondering, I use the <a href="/2018/04/07/introducing-git-ship-simplified-git-flow-workflow/">Git Ship</a> branching methodology, which is a simplified version of Git Flow. I created this easy to use branch methodology to simplify working with branches, and I highly recommend it for all Magento projects.

Now that the file is on VCS and committed, we can edit and save the file with our updates to `vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php` of line 97:

```php
    public function getValuesHtml() : string
```

Then commit the file:

```bash
git commit -am "Fix Firebear Select return type declaration"
```

By doing this, we created a history in Git with the exact changeset we need. We can then use the `git format-patch` command to create our patch:

```bash
git format-patch -1 HEAD
```

This command creates a patch file containing the diff of the last created commit. For me, running this command created a file in the root of my source directory named `0001-Fix-Firebear-Select-return-type-declaration.patch`. Let's move this file to `m2-hotfixes` directory, which is the location Magento Cloud looks for Magento 2 patches. If you don't already have a folder with that name, go ahead and create one. I use the `m2-hotfixes` directory name for all patches to be consistent, whether or not it's a Magento Cloud project.

We are now done with our ephemeral git branch and can delete it. Let's now checkout the main `develop` branch (or in this case, the `integration` branch for Magento Cloud projects), then delete the fix branch.

```bash
git checkout integration
git branch -D feature/fix-firebear-select-return-type
```

We should now be back to where we started, with `vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php` back to the original file without the return type declaration. Now we can test if our patch file works by running the command:

```bash
git apply m2-hotfixes/0001-Fix-Firebear-Select-return-type-declaration.patch
```

If we now check the file `vendor/firebear/configurableproducts/Block/Product/View/Type/Bundle/Type/Select.php`, we should see the return type declaration being added.

### Confirm the patch fixes the issue

Now's our time to test that our update worked by executing the original command which was causing our build to fail:

```bash
bin/magento setup:di:compile --ansi --no-interaction
```

This command should now successfully execute, and show the expected successful output of running this command:

```bash
Compilation was started.
Interception cache generation... 7/7 [============================] 100% 1 min 490.0 MiB
Generated code and dependency injection configuration successfully.
```

At this point, our work is done. We can now add and commit this file to our `develop`/`integration` branch and push it upstream, or create a new pull request that contains our patch update.
