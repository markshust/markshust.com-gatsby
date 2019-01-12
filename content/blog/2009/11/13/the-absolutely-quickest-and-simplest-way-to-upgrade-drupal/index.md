---
title: "The absolutely quickest and simplest way to upgrade Drupal"
date: "2009-11-13T00:00:00.000Z"
tags: ["drupal"]
---

On the initial surface, upgrading Drupal appears complex, when in actuality it’s very rudimentary. A lot of the tutorials and resources on how to upgrade are just plain confusing and not to the point.

The following is a list of command lines and steps in order to upgrade Drupal quickly and easily in 3 EASY STEPS! It just can’t get easier, and I have yet to see one posting that includes this way of doing it, which is really just the quickest/easier/cleanest/simplest way to get it done.

- Go to your root directory (one step below public_html), download Drupal, and unpack it. Replace 6.x with the new version you are upgrading to:

  `wget http://ftp.drupal.org/files/projects/drupal-6.x.tar.gz tar -zxf drupal-6.x.tar.gz`

- Sync the new files up with your current install:

  `rsync -av drupal-6.x/ public_html/`

- Go to your domain and run the update script:

  `http://www.domain.com/update.php`

The entire upgrade process takes only a few minutes. I dare and challenge you to find a quicker and simpler way of upgrading Drupal — because there isn’t one.

**Update:** I was mistaken; there is an easier method. It's called <a href="http://drupal.org/project/drush" target="_blank">Drush</a> :)
