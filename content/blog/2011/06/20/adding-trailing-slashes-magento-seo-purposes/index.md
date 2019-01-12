---
title: "Adding trailing slashes to Magento for SEO purposes"
date: "2011-06-20T14:38:00.000Z"
tags: ["magento", "magento1", "redirects", "seo"]
---

By default, Magento does not automatically add on trailing url's to the end of every URL. In a database-driven cms system, you will be penalized for this by having two urls' with duplicate content:

http://yourinstall.com/home
http://yourinstall.com/home/

In the case above, each of these url's will lead to the same content, causing search engines to spider both pages, and in turn penalizing your website for having duplicate content. You can either create a 404 error for one of the pages, or redirect everything to a standard url. Adding trailing slashes seems to have been the standard for quite a while now and is how most cms systems manage their url's. Below is a diff you can use on the .htaccess file in the root of your Magento install.

```diff
diff --git a/.htaccess b/.htaccess
index 9acb08b..b8daffd 100644
--- a/.htaccess
+++ b/.htaccess
@@ -123,6 +123,13 @@
     #RewriteBase /magento/
 
 ############################################
+## add trailing slashes to url's if they don't exist
+
+    RewriteCond %{REQUEST_FILENAME} !-f
+    RewriteCond %{REQUEST_URI} !(.*)/$
+    RewriteRule ^(.*)$ http://%{HTTP_HOST}/$1/ [L,R=301]
+
+############################################
 ## workaround for HTTP authorization
 ## in CGI environment</pre>
 ```
