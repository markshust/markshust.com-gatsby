---
title: "Preventing injection attacks and securing your website"
date: "2009-09-21T00:00:00.000Z"
tags: ["php", "xss"]
---

Injection attacks and vulnerabilities are extremely common, and can be prevented in just about any case with proper coding and setting permissions correctly. There are a vast array of cross-site scripting (XSS) attacks and worms out there (I’m sure you’ve stumbled on a site with the words ‘viagra’ or ‘xanax’ in the page, and it looks very out-of-place and not consistent with the site’s content). These are usually caused by bots searching the web for securities vulnerabilities.

It is important to <a href="http://www.cgisecurity.com/xss-faq.html" target="_blank">put the proper XSS checks in place</a>, and fixing your website permissions by executing the following commands in the root folder of your website:

```bash
find ./ -type d -exec chmod 755 {} \;
find ./ -type f -exec chmod 644 {} \;
```

This resets all folders and files to their default permission sets and will help prevent these attacks from happening in the future.

If you fear your website has been attacked, you can do a global search on all the files for a certain keyword (ex. viagra, xanax, etc.). This will provide the filename and text of the infected file so that you can cleanup the code.

```bash
find . -type f -name *.php | xargs grep xanax
```
