---
title: "Create your own version of ChromeOS with Ubuntu"
date: "2010-08-31T00:00:00.000Z"
tags: ["bash", "linux", "ubuntu"]
---

We are all eagerly awaiting the release of ChromeOS in November. But why wait? You can easily hack Ubuntu 10.04 into a minified (yes, it’s actually a stripped down further) version of ChromeOS. Sure, it won’t have all of the built-in security and other features that may be absolutely necessary for a production-level install, but it will give you sub-5 second boot times, while automatically logging you in and presenting you with the fabulous Chrome window directly after boot.

How, you may ask? It’s fairly simple to create a minimal install of Ubuntu, then modify the bootstrapping process to make it all yours – I’ll show you how.

The first thing you need to do is download the latest copy of Ubuntu (10.04 at the time of this writing) from <a href="http://www.ubuntu.com/server/get-ubuntu/download" target="_blank">http://www.ubuntu.com/server/get-ubuntu/download</a>. I prefer the 64-bit version on all operating system installs. After downloaded and burned to a cd, boot up from it and press F4 at the splash screen and select Minimal Install. This will only install the absolute minimum requirements for an OS. I also didn’t install any options whatsoever (including LVM, miscellaneous options, etc.) as each option could potentially slow down the boot time.

After ubuntu is installed, login from the provided terminal prompt and run the following snippets. Use google-chrome-beta if you want to use the beta version of the Chrome browser instead.

```bash
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/deb/ stable main" &gt;&gt; /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install google-chrome-stable xorg nano
```

After the prerequisites are installed, create a couple user-defined preference files to signal to start x and boot into Chrome.

```bash
nano ~/.bash_profile
```

```bash
#!/bin/bash
startx
```

```bash
nano ~/.xsession
```

```bash
#!/bin/bash
/opt/google/chrome/google-chrome
```

The last step is to autologin the user. Make sure you enter this line correctly, otherwise you may have to install Ubuntu all over again. Yes, it’s that important. Replace ‘username’ with your username.

```bash
nano /etc/init/tty1.conf
```

```bash
exec /bin/login -f username  /dev/tty1 2>&1
```

Now, just do a ‘sudo reboot’ and you should be golden. You can edit any of the files at a later time by just exiting out of Chrome (click the X) which will return you to the terminal.

This process is just meant to demonstrate the power of Ubuntu, and how easily it can be modified to your needs. My settings booted so fast (under 2 seconds without the computer’s signal prompt), that it started the Chrome browser before the ethernet card was even established which forced me to use F5 to refresh to load google.com. Pretty insane.
