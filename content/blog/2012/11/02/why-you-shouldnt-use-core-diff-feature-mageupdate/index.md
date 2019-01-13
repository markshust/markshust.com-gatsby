---
title: "Why you shouldn't use the core diff feature of MageUpdate"
date: "2012-11-02T11:43:00.000Z"
tags: ["aws", "heroku", "magento", "magento1", "rds"]
---

I feel as though I have to post about this sooner rather than later. A day or two ago, Kalen of MageUpdate posted an article, <a href="http://mageupdate.blogspot.com/2012/10/magento-core-keeping-it-clean.html" target="_blank">Mage Core: Keeping It Clean</a>. The idea of the script is to check your Magento installation for properly coded modules. In theory, this is an absolutely great idea, because I can certainly attest that there is a plethora of garbage modules and extensions out there.

Looking into the script details, it's a simple two-step process:

- Add your site to mageupdate with SSH credentials.
- Within 15 minutes or so you'll be notified that your clone is complete.

Sounds great, right?

Well, there is a mighty areas of concern here. The obvious: giving out SSH credentials. Now, you could easily get around this by instead of providing access to your production site, you instead give out access to a development/staging server. **This would work, and might work well.** That said, you have to go through certain processes before doing so, such as making sure your dev/staging server doesn't directly have access to other servers via SSH keys, as well as not having access for connecting/deploying anything that has to do with your production site, or any other sites that have confidential and secure information.

Now, *I'm pretty positive Kalen has no underhanded motives*. But, that said, why would you trust any third-party with access to your servers? I wouldn't. What if his servers get hacked? The hacker now undeniably also has full SSH access to your server, and now also has access to your database, and that Magento installs' client information. I think that at this point, modified app/code/core files are the least of your worries.

There are also coding concerns to be aware of, as someone now has full access to your Magento installation and files. You can view database/memcached credentials by accessing their app/code/local.xml file, and also access any code under this Magento installation. Something to be aware of if you indeed have confidential or NDA'd code in your Magento installation.

At the end of the day... let's put this all aside. What does this process actually do? First, it finds the version of your Magento installation. Next, it does a diff on your app/code/core directory against that versions core files. Third, well, that's it. It just diffs out some files.

```plain
diff ~/yoursite/ ~/magento1720/
```

Hmmm... is it worth the security risk, for something you can essentially accomplish in one line of code, or something really similar? I'm sure there are also some excludes in the above line, and a nice visual editor online where you can see the diffs of the files, and the diffs themselves, but I definitely wouldn't risk my site, or any site for that matter, by opening up a production environment to a third-party that isn't PCI-compliant, trusted, and absolutely secure.

I'm a little broken because I agree with the end result of Kalen's process/script, and it's probably a nice script. There are too many bad extensions out there, and a lot of bad developers out there modifying core code with bad coding practices. But, there has got to be a better way. Perhaps a locally running script such as <a href="http://drupal.org/project/coder" target="_blank">Drupal's Coder module</a>? Or, a locally-ran bash script that tries to accomplish the same thing? I've been pushing for a script like this for a long while, as it is absolutely secure and in the end, will lead to better accoutability and development of modules, extensions, and custom development. But, I wouldn't run a script like the above to accomplish this. It's just too big of a risk.
