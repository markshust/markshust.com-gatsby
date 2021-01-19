---
title: "Install ionCube loader on Mac OS X"
date: "2013-01-18T15:32:00.000Z"
tags: ["php", "ioncube"]
---

It might look to be a little tricky to get ionCube Loader installed on Mac OS X, but it's actually quite easy. The ionCube Loader lets you decrypt ionCube-encoded projects so you can run software that is encrypted by the developer, or software which may be protected to specific domains and/or locations.

First, you need to visit the <a href="http://www.ioncube.com/loaders.php" target="_blank">ionCube Loader download page</a>.

Next, download the version of ionCube Loader which relates to your installation. In this case, it is **OS X (x86-64)**. I usually download tar.gz files because I'm used to working with them, but any archived file will do. Next, uncompress the archive.

After uncompression, open the folder where the archive extracted the files. On my Mac, this was `~/Downloads/ioncube`. In this folder, there are various .so files which are the extensions related to which version of PHP you are running. You can find out which version of PHP you are running by opening up terminal and issueing the folowing a `php -v` command:

```bash
$ php -v
PHP 5.3.15 with Suhosin-Patch (cli) (built: Jul 31 2012 14:49:18) 
Copyright (c) 1997-2012 The PHP Group
Zend Engine v2.3.0, Copyright (c) 1998-2012 Zend Technologies
```

In this case, my version of PHP is 5.3. So, locate the file in your `~/Downloads/ioncube` folder which matches, which in this case is ioncube_loader_dar_5.3.so.

Open up terminal, and copy that to your PHP extension directory. You can find which directory is your extension directory by opening up your `/etc/php.ini` file, and looking for this line: `;zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/xdebug.so"`

Now we know `/usr/lib/php/extensions/no-debug-non-zts-20090626/` is our PHP extension directory. So, let's copy our `ioncube_loader_dar_5.3.so` file to that directory. We need to prefix it with sudo because we need admin rights to write to this folder.

```bash
$ sudo cp ~/Downloads/ioncube/ioncube_loader_dar_5.3.so /usr/lib/php/extensions/no-debug-non-zts/20090626/
```

Now, add the following line to your `/etc/php.ini` file to enable the extension. Be sure when you edit the file to prefix it with sudo so you have proper write permissions, such as: `sudo vi /etc/php.ini`

```bash
zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/ioncube_loader_dar_5.3.so"
```

ionCube Loader should now be installed! Note, that it is currently not compatible with xDebug, so you need to pick which one to use and comment out the other line. Your php -v line should now read something similar to the following:

```bash
$ php -v
PHP 5.3.15 with Suhosin-Patch (cli) (built: Jul 31 2012 14:49:18) 
Copyright (c) 1997-2012 The PHP Group
Zend Engine v2.3.0, Copyright (c) 1998-2012 Zend Technologies
    with the ionCube PHP Loader v4.2.2, Copyright (c) 2002-2012, by ionCube Ltd.
```

Note that you'll need to restart apache in order for the updated ini file settings to take effect. Good luck!
