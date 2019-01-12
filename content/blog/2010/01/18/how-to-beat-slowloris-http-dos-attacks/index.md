---
title: "How to beat Slowloris HTTP DoS attacks"
date: "2010-01-18T00:00:00.000Z"
tags: ["apache"]
---

I’ve recently been involved with a site that was experiencing a heavy level of <a href="http://ha.ckers.org/slowloris/" target="_blank">Slowloris</a> attacks. Slowloris is a DoS (Denial of Service) attack that was made with a very simple agenda – to shutdown websites with a very low-level attacking client. It seems to mainly affect Apache, the most popular web server in the world (newer web servers such as Lighttpd and nginx are unaffected). It has been recently talked about in a variety of magazines and publications such as <a href="http://www.linux-magazine.com/Issues/2009/106/APACHE-HTTPD/(kategorie)/0" target="_blank">Linux Magazine</a> and <a href="http://www.howtoforge.com/how-to-defend-slowloris-ddos-with-mod_qos-apache2-on-debian-lenny" target="_blank">HowToForge.com</a>.

With various possible fixes given in those articles, I was unable to completely guard against the attack. While it seemed as though the Apache module <a href="http://www.zdziarski.com/projects/mod_evasive/" target="_blank">mod\_evasive</a> was the only thing partly helping the attacks, it was not a 100% fix to the problem. Migrating off Apache was not an option at this time, so I thought about it and came to the conclusion that I can have a script automatically restart Apache when the number of current open Apache processes increases past a set threshold. So, I created the following script and placed at `/etc/custom/anti_slowloris.sh`:

```bash
#!/bin/bash
# author: mark shust
# created: 2009.10.12 09:16

# get number of apache processes
apachemem=`ps axo 'pid user size cmd' | grep apache | grep -v '\(root\|grep\)' | wc -l`

# restart apache if there are more than the defined number of running processes
if [ $apachemem -gt 25 ] ; then
  /etc/init.d/httpd restart
fi
```

What this script essentially does in count the number of current open Apache processes, and if is past a certain limit (in this case, 25), it will automatically restart apache. This script has now been running on a cron for 3 months and during that time we have no longer had any issues at all regarding these DoS attacks. Feel free to use the script and modify it as necessary. Below is the related cron setup (basically runs every 5 minutes). Since it is such a tiny script it pretty much takes up no load on the server:

```bash
0,5,10,15,20,25,30,35,40,45,50,55 * * * * /etc/custom/anti_slowloris.sh
```
