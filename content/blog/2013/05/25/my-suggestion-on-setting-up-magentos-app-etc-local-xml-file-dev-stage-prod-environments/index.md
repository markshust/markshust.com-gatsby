---
title: "My suggestion on setting up Magento's app/etc/local.xml file for dev/stage/prod environments"
date: "2013-05-25T13:06:00.000Z"
tags: ["deployments", "magento", "magento1", "xml"]
---

It seems as though everyone always wonders what to do with `app/etc/local.xml`, and how to best manage it when deploying from development to staging and production. It took me a while to figure this out, but I think I found a really good way.

I have a strong feeling that all code should be on version control. I don't understand why most Magento git deployment suggestions choose to exclude/ignore `app/etc/local.xml` from their version control systems. It surely is not a security concern, as if someone is looking at php/xml code, they most likely have access to the full system anyways. Code should be instantly deployable, and not rely on someone doing something after code is deployed (as in copying in or creating a local.xml file so it can connect to the database). Note that I do not think this applies to parts of the filesystem that are likely to change by user uploads or session (ex. `media` folder, `var` folder, etc.), but it should indeed apply to parts of the site that don't change with human/web interaction (ex. `skin` folder).

Let's say that you just installed a base version of Magento in your development environment, and this is what your `app/etc/local.xml` file looks like:

```xml
<?xml version="1.0"?>
<!--
...
-->
<config>
    <global>
        <install>
            <date><![CDATA[Sun, 28 Oct 2012 13:09:07 +0000]]></date>
        </install>
        <crypt>
            <key><![CDATA[1aaa1a11a11aa11aaaa111111aaaa111]]></key>
        </crypt>
        <disable_local_modules>false</disable_local_modules>
        <resources>
            <db>
                <table_prefix><![CDATA[]]></table_prefix>
            </db>
            <default_setup>
                <connection>
                    <host><![CDATA[localhost]]></host>
                    <username><![CDATA[root]]></username>
                    <password><![CDATA[]]></password>
                    <dbname><![CDATA[magento]]></dbname>
                    <initStatements><![CDATA[SET NAMES utf8]]></initStatements>
                    <model><![CDATA[mysql4]]></model>
                    <type><![CDATA[pdo_mysql]]></type>
                    <pdoType><![CDATA[]]></pdoType>
                    <active>1</active>
                </connection>
            </default_setup>
        </resources>
        <session_save><![CDATA[files]]></session_save>
    </global>
    <admin>
        <routers>
            <adminhtml>
                <args>
                    <frontName><![CDATA[admin]]></frontName>
                </args>
            </adminhtml>
        </routers>
    </admin>
</config>
```

So, we have a `root` user, with no password, and using the database `magento`. All seems ok.

Well, let's say we have a managed dedicated development environment where database credentials need to be different. Or a production database which requires a password (hope this is everyone...). And now we have the conundrum. What do we do with this `app/etc/local.xml` file? The situation gets quite more complex when we add in the possibilty of apc, memcached, etc. all being managed by this file, with varying conditions in different environments.

Initially, I just kept production values in `app/etc/local.xml`, then use `git --assume-unchanged` to ignore the changes I've made in dev and stage environments. But what if we do a `git reset --hard HEAD` in our staging environment, and for some reason don't keep the passwords stored anywhere else? That's a fatal process which will reset our `app/etc/local.xml` file and will take down our site. Oops, that doesn't work too well.

This then lead me to believe that all versions of `local.xml` for dev/stage/prod should be tracked on version control, so if anything ever quickly gets reset, we have a copy of the file which we easily have access to. So, I went ahead and created files for:

- `app/etc/local.xml.dev`
- `app/etc/local.xml.stage`
- `app/etc/local.xml.prod`

I kept the prefix of the files (dev/stage/prod) after the .xml extension so that those files aren't rendered by Magento'x xpath (if they end in .xml, they *would* be included... Thanks Ben Marks :)). Each file is updated to correspond to their appropriate environment setups. But what do we still do about our main app/etc/local.xml file?

You could just copy your `local.xml.dev` file over to `app/etc/local.xml`, but then you have replicated data. And I hate replicated data because it always leads to confusion down the line. So I create a shortcut to local.xml:

```bash
cd app/etc
ln -s local.xml.prod local.xml
```

This creates a symlink from our production local.xml.dev file over to local.xml. This remedies the replicated data situation, and also gives us redundancy for fatal conditions such as git reset --hard HEAD.

Now, I do in fact go ahead and commit the symlink that goes to local.prod.xml. Why do I do this? Again, to product against fatal conditions, and most specifically on the production environment, because this is the one place where things just shouldn't change and I should be able to be reset to base code at any time.

I then tell git to ignore future local file changes in both dev and stage:

```bash
git update-index --assume-unchanged app/etc/local.xml
```

After that is done, I can go ahead and symlink to my environment-specific xml file, and the changes will not be seen as modified according to git. Situation solved.

I'm sure there are a lot of other techniques, but this seems like a fairly simple and straightforward process to get things mainly right. Do you happen to have a better solution? I'd love to hear thoughts and suggestions on this process.
