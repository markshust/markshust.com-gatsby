---
title: "Removing htaccess files from Magento and moving contents into Apache configuration"
date: "2012-01-11T11:30:00.000Z"
tags: ["apache", "magento", "magento1", "performance"]
---

Performance is the one area of your site that you can make you or break you on the web. Testing out a lot of strategies and hearing about how removing .htaccess files would *drastically* increase your page speed, I had to put it to the test. The theory behind this tweak is that when AllowOverrides are turned on, Apache checks every single directory to see if an .htaccess file exists, and that this lookup costs valuable web server time in projects that have lots of files (such as Magento and Zend Framework) and could cause latency in page requests.

Unfortunately, I didn't see any decrease in page load speeds, or any considerable performance enhancement. I only tested on a base install of Magento 1.6.1.0 with sample data and no load, so it's entirely possible that you may see a decrease in page load speeds under high traffic situations, or other possible situations. I'm deeming this not worthy of tasking out for projects unless you are trying to squeeze out every possible performance enhancements from your site, because there are much more rewarding enhancements you can make to your Magento site other than removing htaccess files. That said, it is very easy to do and not time consuming, so I'm posting up exactly how to accomplish this task if you want to undertake this for your website.

You do not have to remove any htaccess files from your Magento install. Actually, I would recommend you do not so you can diff out the file changes when doing upgrades. Basically this tweak/hack just moves the contents of the htaccess files to the Apache virtual host configuration.

You can easily find all of the htaccess files that exist in Magento by running the following line from the base directory of your website:

```bash
find . -name .htaccess
```

Your results should return the following files:

```bash
./app/.htaccess
./errors/.htaccess
./lib/.htaccess
./.htaccess
./pkginfo/.htaccess
./var/.htaccess
./includes/.htaccess
./media/customer/.htaccess
./media/.htaccess
./media/downloadable/.htaccess
./downloader/.htaccess
./downloader/template/.htaccess
```

I took these htaccess files and pasted the contents into the configuration for this virtual host. Below is the code for a default install of Magento 1.6.1.0 that you could use to paste into your configuration. Happy optimizing!

```bash
<VirtualHost 127.0.0.1:80>
DocumentRoot "/var/www/html/yourdomain.com"
ServerName yourdomain.com
<Directory "/var/www/html/yourdomain.com">
allow from all
</Directory>
 
# Begin Magento Directives
<Directory "/var/www/html/yourdomain.com">
AllowOverride None
</Directory>
<Directory "/var/www/html/yourdomain.com">
############################################
## uncomment these lines for CGI mode
## make sure to specify the correct cgi php binary file name
## it might be /cgi-bin/php-cgi
 
#    Action php5-cgi /cgi-bin/php5-cgi
#    AddHandler php5-cgi .php
 
############################################
## GoDaddy specific options
 
#   Options -MultiViews
 
## you might also need to add this line to php.ini
##     cgi.fix_pathinfo = 1
## if it still doesn't work, rename php.ini to php5.ini
 
############################################
## this line is specific for 1and1 hosting
 
    #AddType x-mapp-php5 .php
    #AddHandler x-mapp-php5 .php
 
############################################
## default index file
 
    DirectoryIndex index.php
 
<IfModule mod_php5.c>
 
############################################
## adjust memory limit
 
#    php_value memory_limit 64M
    php_value memory_limit 256M
    php_value max_execution_time 18000
 
############################################
## disable magic quotes for php request vars
 
    php_flag magic_quotes_gpc off
 
############################################
## disable automatic session start
## before autoload was initialized
 
    php_flag session.auto_start off
 
############################################
## enable resulting html compression
 
    #php_flag zlib.output_compression on
 
###########################################
# disable user agent verification to not break multiple image upload
 
    php_flag suhosin.session.cryptua off
 
###########################################
# turn off compatibility with PHP4 when dealing with objects
 
    php_flag zend.ze1_compatibility_mode Off
 
</IfModule>
 
<IfModule mod_security.c>
###########################################
# disable POST processing to not break multiple image upload
 
    SecFilterEngine Off
    SecFilterScanPOST Off
</IfModule>
 
<IfModule mod_deflate.c>
 
############################################
## enable apache served files compression
## http://developer.yahoo.com/performance/rules.html#gzip
 
    # Insert filter on all content
    ###SetOutputFilter DEFLATE
    # Insert filter on selected content types only
    #AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
 
    # Netscape 4.x has some problems...
    #BrowserMatch ^Mozilla/4 gzip-only-text/html
 
    # Netscape 4.06-4.08 have some more problems
    #BrowserMatch ^Mozilla/4\.0[678] no-gzip
 
    # MSIE masquerades as Netscape, but it is fine
    #BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
 
    # Don't compress images
    #SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png)$ no-gzip dont-vary
 
    # Make sure proxies don't deliver the wrong content
    #Header append Vary User-Agent env=!dont-vary
 
</IfModule>
 
<IfModule mod_ssl.c>
 
############################################
## make HTTPS env vars available for CGI mode
 
    SSLOptions StdEnvVars
 
</IfModule>
 
<IfModule mod_rewrite.c>
 
############################################
## enable rewrites
 
    Options +FollowSymLinks
    RewriteEngine on
 
############################################
## you can put here your magento root folder
## path relative to web root
 
    #RewriteBase /magento/
 
############################################
## workaround for HTTP authorization
## in CGI environment
 
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
 
############################################
## Compress, Combine and Cache Javascript/CSS
# Fooman Speedster module, uncomment if needed
    #RewriteRule ^(index.php/)?minify/([^/]+)(/.*.(js|css))$ lib/minify/m.php?f=$3&d=$2
 
############################################
## always send 404 on missing files in these folders
 
    RewriteCond %{REQUEST_URI} !^/(media|skin|js)/
 
############################################
## never rewrite for existing files, directories and links
 
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
 
############################################
## rewrite everything else to index.php
 
    RewriteRule .* index.php [L]
 
</IfModule>
 
############################################
## Prevent character encoding issues from server overrides
## If you still have problems, use the second line instead
 
    AddDefaultCharset Off
    #AddDefaultCharset UTF-8
 
<IfModule mod_expires.c>
 
############################################
## Add default Expires header
## http://developer.yahoo.com/performance/rules.html#expires
 
    ExpiresDefault "access plus 1 year"
 
</IfModule>
 
############################################
## By default allow all access
 
    Order allow,deny
    Allow from all
 
###########################################
## Deny access to release notes to prevent disclosure of the installed Magento version
 
    <Files RELEASE_NOTES.txt>
        order allow,deny
        deny from all
    </Files>
 
############################################
## If running in cluster environment, uncomment this
## http://developer.yahoo.com/performance/rules.html#etags
 
    #FileETag none
 
</Directory>
<Directory "/var/www/html/yourdomain.com/app">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/errors">
<FilesMatch "\.(xml|phtml)$">
    Deny from all
</FilesMatch>
</Directory>
<Directory "/var/www/html/yourdomain.com/pkginfo">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/lib">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/var">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/includes">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/media">
    Options All -Indexes
<IfModule mod_php5.c>
    php_flag engine 0
</IfModule>
AddHandler cgi-script .php .pl .py .jsp .asp .htm .shtml .sh .cgi
Options -ExecCGI
<IfModule mod_rewrite.c>
############################################
## enable rewrites
    Options +FollowSymLinks
    RewriteEngine on
############################################
## never rewrite for existing files
    RewriteCond %{REQUEST_FILENAME} !-f
############################################
## rewrite everything else to index.php
    RewriteRule .* ../get.php [L]
</IfModule>
</Directory>
<Directory "/var/www/html/yourdomain.com/media/customer">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/media/downloadable">
    Order deny,allow
    Deny from all
</Directory>
<Directory "/var/www/html/yourdomain.com/downloader">
<IfModule mod_deflate.c>
    RemoveOutputFilter DEFLATE
    RemoveOutputFilter GZIP
</IfModule>
<Files ~ "\.(cfg|ini|xml)$">
    Order allow,deny
    Deny from all
</Files>
</Directory>
<Directory "/var/www/html/yourdomain.com/downloader/template">
    Order deny,allow
    Deny from all
</Directory>
# End Magento Directives

</VirtualHost>
```
