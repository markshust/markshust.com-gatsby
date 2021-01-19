---
title: "Deploying Magento on Heroku with Amazon RDS"
date: "2012-10-29T23:27:00.000Z"
tags: ["aws", "heroku", "magento", "magento1", "rds"]
---

Heroku is a very powerful application deployment system that was initially created for Ruby on Rails apps. But, did you know that Heroku quietly released support for PHP 5? Well, they did, and I will tell you how to deploy Magento to Heroku using Git and Amazon RDS.

Your first step is to unzip your fresh Magento install and get it on git.

```bash
~/Sites/$ cd magento
$ git init
$ git add .
$ git commit
```

Now your Magento install should be on git and a baseline committed. I would now recommend to complete the Magento installation on your local environment, but first you need to setup your Amazon RDS instance and patch through the proper permissions. <a href="http://aws.amazon.com/rds/" target="_blank">Amazon RDS</a> is a very affordable relational database application server which you can use to host your MySQL database for Magento. The micro instance costs roughly $18/mo at the time of this posting, and should be ok for any lightly trafficked Magento installation.

Just complete the signup for AWS if you haven't done so already, and go ahead and proceed to start setting up an RDS instance. Launching your new RDS instance is very straight-forward and simple.

One thing you need to remember to do is patch through the ip of your heroku instance and local network so you have access to RDS. For ease of setup, let's just patch through all of the IP's so anyone can access the RDS instance. This isn't recommended for production environments, but will aid in the setup of this instance and get the ball rolling.

Just add the following ip command to the DB Security Groups portion of your RDS control panel for your default security group. This will allow all IP's to access this instance.

```bash
CIDR: 0.0.0.0/0
```

You can then test your connection locally by using something like the following command line. Of course replace your host/user/pass with the credentials you used to signup for your RDS instance:

```bash
mysql -h oasis.cv8auujxhwjj.us-east-1.rds.amazonaws.com -u magento -pmagento sheltered_oasis_3460
```

A successful connection will confirm your MySQL RDS instance is setup correctly. If you can't connect using the above line, backtrack and debug...

Next, make sure you have your <a href="http://www.heroku.com/" target="_blank">Heroku</a> account setup and ready to go. It's awesome and can be pretty much free depending on how you use it. Once you have setup an account, you'll then need to setup the <a href="https://toolbelt.heroku.com/" target="_blank">Heroku Toolkit</a> on your computer.

After that's setup, let's go back to our web directory and push up our new app.

```bash
$ heroku create
Creating sheltered-oasis-3460... done, stack is cedar
http://sheltered-oasis-3460 herokuapp.com/ | git@heroku.com:sheltered-oasis-3460.git
Git remote heroku added
```

You wil need to then add the <a href="https://addons.heroku.com/amazon_rds" target="_blank">Amazon RDS Add-On</a> to your account. Just use the web interface to do this as it's a lot easier. Then go to your app under My Apps, click on the Amazon RDS Add-On, then enter your mysql string. It will be the exact same info as the above, but put into URL form.

```bash
Database URL: mysql://magento:magento@oasis.cv8auujxhwjj.us-east-1.rds.amazonaws.com/sheltered_oasis_3460
```

Once this is setup, go ahead and complete the install of Magento on your local environment. Once it has been installed and is now working, go ahead and commit your app/etc/local.xml file (along with any other changes you made). You then need to push up your git repo to this new app for things to push upstream.

```bash
$ git push heroku master
The authenticity of host 'heroku.com (50.19.85.132)' can't be established.
RSA key fingerprint is 8b:48:5e:67:0e:c9:16:47:32:f2:87:0c:1f:c8:60:ad.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'heroku.com,50.19.85.132' (RSA) to the list of known hosts.
Counting objects: 15955, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (13975/13975), done.
Writing objects: 100% (15955/15955), 19.64 MiB | 558 KiB/s, done.
Total 15955 (delta 6567), reused 0 (delta 0)
 
-----> Heroku receiving push
-----> PHP app detected
-----> Bundling Apache version 2.2.22
-----> Bundling PHP version 5.3.10
-----> Discovering process types
       Procfile declares types -> (none)
       Default types for PHP   -> web
-----> Compiled slug size: 26.0MB
-----> Launching... done, v4
       http://sheltered-oasis-3460.herokuapp.com deployed to Heroku
 
To git@heroku.com:sheltered-oasis-3460.git
 * [new branch]      master -> master
```

Yay! Our git repo has now been pushed upstream to Heroku and is deployed. You can open your URL by visiting the above URL provided or by the command:

```bash
$ heroku open
```

Hopefully this well debug some myths about running Magento on a Heroku instance and with Amazon RDS. This guide should be used as a starting point, as it is not complete at all and will most likely require some other modifications to make it truly production-ready. You also have access to the list of <a href="https://addons.heroku.com/" target="_blank">other Heroku Add-On's</a> including Heroku Scheduler (useful for cron tasks) and&nbsp;Redis for faster cache reads.
