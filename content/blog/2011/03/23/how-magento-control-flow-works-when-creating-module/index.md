---
title: "How the Magento control flow works when creating a module"
date: "2011-03-23T09:02:00.000Z"
tags: ["controllers", "magento", "magento1", "xml"]
---

I would like to start some short segments on how Magento works. There seems to be very little correct information on the web, and given I just came back from <a href="http://www.magentocommerce.com/services/training" target="_blank">Magento U</a>, I figure I can start spreading all of the good news.

Magento makes extensive use of XML. I'm sure all of you developers are fully aware of that by now, and some are completely loss in the mess of XML. In actuality, it's not a mess at all, but a very well designed architecture that believe it or not, you will learn to love after you get involved in module development. The purpose of the XML layer is to provide a much easier ability to override and extend the default Magento classes, and provide some structure to the thousands of files that exist in a default Magento install.

Some things you should know from the get-go: Magento combines ALL of the xml files, everywhere, into one giant XML file. Theoretically, any XML directive can go in any file, as long as it follows the same naming conventions inside the XML. This gives great freedom to the developer, but there are certain 'standards' you should follow so your code is easy to understand and maintain by the great many other Magento developers.

All code you will be working with is located within **app/code**, within a certain subdirectory (core = Magento, community = community modules, local = your site-specific modules). The first step to take when creating a module is setup your namespace (ex. make it easy on yourself: the name of your company or yourself), and then your module name (ex. Helloworld) so you wind up with the following directory structure:

<pre>
app/code/<strong>community/Company/Helloworld</strong>
</pre>

When you have that set, create some extra subdirectories within the module folder:

<pre>
app/code/community/Company/Helloworld/<strong>controllers</strong>
app/code/community/Company/Helloworld/<strong>etc</strong>
</pre>

Controller files will obviously go in the `controllers` folder, and your xml file(s) will go in the `etc` folder. Make more things easy on yourself: spell it all right. If you don't, you will eventually find yourself hating Magento, and yourself.

First, you need to make Magento aware of your new module; just creating the files doesn't do that. Create a file with the following:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
    <modules>
        <Company_Helloworld> <!-- your namespace and module name. spell/case it right. -->
            <active>true</active> <!-- this is always true unless you want to explicitly disable this module to diagnose issues -->
            <codePool>community</codePool> <!-- where the module lives in app/etc - either local, community or core -->
        </Company_Helloworld>
    </modules>
</config>
```

This file alone makes Magento aware of your module and adds it to the active list of modules. You can verify this by going System &gt; Configuration &gt; Advanced &gt; Advanced in the Magento Admin, and seeing the module listed under the Disabled Modules Output list.

Now, create your module config xml file. Remember: this config.xml file will eventually be merged with all of the other xml files, so it has to follow a specific structure format. Set something up like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
    <modules>
        <Company_Helloworld> <!-- your namespace and module name. spell/case it right. -->
            <version>0.1</version> <!-- the version of your module, unimportant unless dealing with custom sql -->
        </Company_Helloworld>
    </modules>
    <frontend>
        <routers>
            <helloworld> <!-- name of router. for consistency sake, match this to frontName -->
                <use>standard</use> <!-- this is a standard router -->
                <args>
                    <module>Company_Helloworld</module> <!-- what module we should look at for the 'helloworld' router -->
                    <frontName>helloworld</frontName> <!-- for consistency sake, match this to router name -->
                </args>
            </helloworld>
        </routers>
    </frontend>
</config>
```

Looks like a ridiculous amount of code for adding in a custom router, but in actuality is quite condensed. We do have to explicitly declare everything with the correct naming conventions because again, everything is merged into one giant xml file, then parsed. So, essentially you can put the Company_Helloworld.xml file xml contents (active and codePool params) into your config.xml file. But we keep it separate to make sure those other Magento developers know where to go to find certain params. You'll get used to the naming and formatting pretty quick because it's really simple to follow as there is no 'coding' involved, just xml naming conventions.

What happens when we now to go http://magentoinstall.localhost/helloworld is that it is going to check the xml file for a 'helloworld' router. Given the above, it'll find it! The config is telling the helloworld router to look for the controller in Company/Helloworld/controllers and execute it. Well, I guess we need a file there. Throw something up like this:

```php
<?php
class Company_Helloworld_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        echo 'Hello... world!';
    }
}
```

If you are familiar with Zend Framework and MVC, it will come into play here (if not, please go ahead right now and read up on <a href="http://framework.zend.com/manual/en/learning.quickstart.intro.html" target="_blank">Zend Framework &amp; MVC</a>). Long story short, you have the url address something like /helloworld/controller/action, with controller = index and action = index by default. So, rendering /helloworld, /helloworld/index, and /helloworld/index/index all go to the same place (IndexController-&gt;indexAction, as you can see above).

Now visit http://magentoinstall.localhost/helloworld, and you should see your Hello... world! display. Hopefully this clarifies some of the beginning routing questions available and gives you a brief overview of the xml naming and structuring process.

## Related Screencast

I created a related screencast that is available on Vimeo, <a href="http://vimeo.com/user10494399/screencast-creating-helloworld-module-magento" target="_blank">Creating a Helloworld Module in Magento</a>.
