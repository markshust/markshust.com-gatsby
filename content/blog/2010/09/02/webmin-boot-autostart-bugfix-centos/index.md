---
title: "Webmin boot autostart bugfix for CentOS"
date: "2010-09-02T00:00:00.000Z"
tags: ["centos", "linux"]
---

Webmin not autostarting on boot? Sometime over the last year or so, for some reason Webmin stopped starting after a reboot. I’ve always done a manual restart with a:

```bash
/etc/init.d/webmin start
```

command, so I figured added it to

```bash
/etc/rc.d/rc.local
```

would fix it. But it didn’t.

Apparently, Webmin has a separate startup script of:

```bash
/etc/webmin/start
```

So, to fix the boot startup issue, just add that snippet to your

```bash
/etc/rc.d/rc.local
```

file, and it will correct the problem!
