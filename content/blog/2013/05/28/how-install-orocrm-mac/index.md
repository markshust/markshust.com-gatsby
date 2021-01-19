---
title: "How to install OroCRM on Mac"
date: "2013-05-28T18:54:00.000Z"
tags: ["orocrm"]
---

Being that I'm pretty heavily involved in Magento, I'm following OroCRM, the open-source content relationship management tool, created by the guys who were very actively involved in Magento's development (Yoav & Jary). I'm very excited about this piece of software, as there is very-much lacking an awesome PHP-based CRM software platform. It's also pretty neat that they released Oro Platform as well for developing all sorts of things (besides just CRM software piece).

As this is a very new piece of software (just released on the date this article is published), there is very little documentation available. I looked for a write-up on installing it, but didn't find anything online. Now, there is a good README.md file after checking out the codebase, but if you are anything like me, you like web documentation! Let's get started.

## Install Brew/Git

You really should have this installed already, but if not, go ahead and get git. I like to use <a href="http://mxcl.github.io/homebrew/" target="_blank">Home Brew</a> for managing apps such as this, so let's go ahead and install brew:

```bash
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

Then install git:

```bash
sudo brew install git
```

That's it. If you need to install it manually or are on another platform, you can <a href="http://git-scm.com/downloads" target="_blank">manually download git</a>.

## Install Composer

Symfony 2 (what OroCRM is built upon) uses Composer to manage it's dependencies, so let's get that installed with this nice little one-liner:

```bash
curl -s https://getcomposer.org/installer | php
```

Now you might get a line to add detect_unicode = Off to your command line `/private/etc/php.ini` file, if so, go ahead and do that.

## Checkout OroCRM

Now let's go ahead and get the actual OroCRM code. I like to place all of my websites in a subdirectory of the `~/Sites` folder, but you can place this anywhere you wish. I'll check this out to the `~/Sites/orocrm` directory:

```bash
git clone http://gitlab.orocrm.com/crm-application.git ~/Sites/orocrm
```

You'll also need to <a href="http://httpd.apache.org/docs/2.4/vhosts/examples.html" target="_blank">setup an Apache VirtualHost record</a> and <a href="http://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/" target="_blank">add a local DNS entry</a>, but I won't go into those specifics here. But I must note, be sure to make your base web directory `~/Sites/orocrm/web` (not just `~/Sites/orocrm`).

## Configure Database

OroCRM works off of YAML files, which are just glorified XML files that are easier to read. You'll really like the format of these compared to XML once you get into things.

Let's copy the base `parameters.dist.yml` file over to our new `parameters.yml` file so we can make edits to it:

```bash
cd ~/Sites/orocrm
cp app/config/parameters.dist.yml app/config/parameters.yml
```

Now open up `app/config/parameters.yml` and update all of the database params to match your local environment. I use the root user locally with no password, so I just removed the 'root' value for the password and saved the file.

## Install Dependencies with Composer

Now that we have our YAML file configured, let's go ahead and install the depedencies with Composer. Note that I was missing the International Components of Unicode package on my Mac, and I also ran out of memory when trying to complete the installer line. So here are two prerequisites:

```bash
sudo brew install icu4c
ln -s /usr/local/Cellar/icu4c/__VERSION__/bin/icu-config /usr/local/bin/icu-config
ln -s /usr/local/Cellar/icu4c/__VERSION__/include/unicode /usr/local/include/unicode
sudo pear install pecl/intl
```

These install the needed unicode component libraries. Be sure to replace `__VERSION__` with the version number of your icu4c. The next step is to add these libraries and raise the memory limit in your /etc/php.ini file. I needed to update memory_limit to 1G and added extension=intl.so to the end of the file.

Now that we are ready to continue, go to the root of your installation (for me it's `~/Sites/orocrm`) and run this line:

```bash
sudo php composer.phar install
```

This will install any other packages we happen to need in order to install OroCRM.

## Install OroCRM

We are now finally all prepped and primed to install OroCRM itself. Let's go ahead and run the installer script from command line:

```bash
sudo ./install.sh
```

Another thing I had to do is change web/.htaccess to look at app_dev.php instead of app.php. I'm sure this will change with future versions.

## Set Proper Permissions

For some final prep, make the cache and logs folders world writable:

```bash
sudo chmod -R 777 ~/Sites/orocrm/app/cache
```

## All Complete!

Now all you have to do is fire up your web browser and you should be all set! Your initial login is username: admin, password: admin.
