---
title: "Using the new command line tool 'mage' replacement for pear in Magento"
date: "2011-06-20T09:52:00.000Z"
tags: ["magento", "magento1", "cli"]
---

Magento had a great command line tool built into it's software build called 'pear' that was located in the root folder of Magento installations. Well... it's still there, it has just been renamed 'mage' and comes with different commands to update modules, the core, etc.

Your first step in using 'mage' is to set the proper permissions to make it executable by the executing user. This can be done with chmod from the root of your Magento install:

`chmod 550 mage`

Then, to run it, just type `./mage` in shell. You will be presented with a list of arguments to pass to it:

```
Connect commands available:
===========================
channel-add          Add a Channel       
channel-alias        Specify an alias to a channel name
channel-delete       Remove a Channel From the List
channel-info         Retrieve Information on a Channel
channel-login        Connects and authenticates to remote channel server
channel-logout       Logs out from the remote channel server
clear-cache          Clear Web Services Cache
config-get           Show One Setting    
config-help          Show Information About Setting
config-set           Change Setting      
config-show          Show All Settings   
convert              Convert old magento PEAR package to new format
download             Download Package    
info                 Display information about a package
install              Install Package     
install-file         Install Package Archive File
list-available       List Available Packages
list-channels        List Available Channels
list-files           List Files In Installed Package
list-installed       List Installed Packages In The Default Channel
list-upgrades        List Available Upgrades
package              Build Package       
package-dependencies Show package dependencies
package-prepare      Show installation information of package
sync                 Synchronize Manually Installed Packages
sync-pear            Synchronize already Installed Packages by pear
uninstall            Un-install Package  
upgrade              Upgrade Package     
upgrade-all          Upgrade All Packages
```

This is pretty self explanatory. For example, to upgrade all of the packages in your install, run the following then follow the onscreen prompts:

`./mage upgrade-all`

Note that some of the commands have changed since 'pear', most notably how to download and install extensions. This has been changed with the new 2.0 version of extension packaging. First, lookup the V2.0 extension URL from Magento Connect. After you have that url (should look something like http://connect20.magentocommerce.com/community/extension_name), it's easy-peasy. This url supplies you with the format and naming of how to download your extension. Just take the query part of the url (`community/extension_name`), and you are left with the channel and package name delineated by the slash. Use this and you are set:

`./mage install http://connect20.magentocommerce.com/community extension_name`
