---
title: "Docker for Mac filesystem volume mount approach for performance"
date: "2018-12-30T12:45:00.000Z"
tags: ["docker", "magento", "magento2"]
---

I've written blogs in the past on how to improve Docker filesystem mounting performance, including <a href="https://markshust.com/2017/03/02/making-docker-mac-faster-overlay2-filesystem">using the overlay2 filesystem</a> and <a href="https://markshust.com/2018/01/30/performance-tuning-docker-mac">performance tuning Docker for Mac</a>. While they have drastically increased filesystem throughput and performance, none of them have been a silver bullet in truly solving filesystem performance issues with Docker for Mac.

The single biggest performance improvement Docker for Mac has made in the last couple years is adding the <a href="https://docs.docker.com/docker-for-mac/osxfs-caching/#delegated" target="_blank">delegated flag for mounting filesystems</a>. The "weak set of guarantees" noted by Docker is really quite sufficient, as there are really no noticeable changes between the default and delegated volume mount types. Working with open source software with over one hundred thousand lines of code (~Magento), I've noticed no issues by choosing to run this type of volume mount.

Speaking of Magento, working with a project with this many lines of code has exacerbated Docker for Mac's volume performance issues. While a typical small PHP or small JavaScript application works just fine with Docker for Mac (with or without delegated volumes), you must make one more additional concession to get 90%+ truly native speed: do not mount volumes treated as a "cache". In fact, don't mount any volumes that are part of "core" open source software code. Typically, this is code you do not have to edit anyways, as modifications to core OSS files are generally lost during upgrades anyway.

I'm going to talk into more detail about the Magento filesystem, as this is the system I am most familiar with and it presents a few different issues. That said, this approach should really apply to just about anyone having filesystem performance issues with Docker for Mac volume mounts, due to the way D4M operates as a sort of virtual machine to run on the Docker server daemon.

Here is the normal Magento filesystem, with explanations of each file/folder:

`CHANGELOG.md`, `LICENSE.txt`, `COPYING.txt`, `LICENSE_AFL.txt`: readme/license files

`Gruntfile.js.sample`, `grunt-config.json.sample`, `auth.json.sample`, `nginx.conf.sample`, `package.json.sample`, `php.ini.sample`: sample configuration files for respective packages

`app/`: folder for local code changes/updates

`bin/`: folder for helper scripts

`composer.json`, `composer.lock`: Composer configuration files

`dev/`: folder for built-in dev tools and unit testing

`generated/`: cache directory for code generation

`index.php`: main bootstrap file that handles internal requests

`lib/`: directory that contains frontend library scripts

`phpserver/`: folder for server configuration using built-in PHP web server

`pub/`: public directory for web server access containing files for routing/requesting static assets

`setup/`, `update/`: directories for web installers/updaters

`var/`: directory to contain temp files (sessions, logs, cache, etc)

`vendor/`: folder for artifacts from composer/library install command

Performance issues arose when mounting this entire filesystem. The source for for Magento was placed within a `src` directory, and mounted like so within a Docker Compose file:

```yaml
  volumes:
    - ./src:/var/www/html:delegated
```

While this appears to be the most straight-forward way to work with a project on Docker for Mac, it's not performant at all, due to the vast amount of files and folders that are written to and read from. Using the above, page load times were roughly 14 seconds from a stale cache -- just about twice as long as requests would be, versus running the application on the host machine without Docker at all. While acceptable for development, this really isn't as efficient as it should be.

Let's talk a bit how development works with Magento. Typically, all code updates and changes are handled in one place: the `app` folder. This is where local changes go, and really the one true place we need bi-directional sync of folders and files from and to Docker. So, why not just use native Docker volumes, and mount just that `app` directory?

```yaml
    volumes:
      - appdata:/var/www/html
      - ./src/app:/var/www/html/app:delegated
```

We may also want a few other things synced, such as composer caches (which are infrequently used, just during times of installing composer dependencies), composer configuration files, and perhaps an Nginx configuration file. We may also want to specify the exact subdirectories within the `app` directory, to really fine tune performance:

```yaml
    volumes:
      - appdata:/var/www/html
      - ~/.composer:/var/www/.composer:delegated
      - ./src/app/code:/var/www/html/app/code:delegated
      - ./src/app/design:/var/www/html/app/design:delegated
      - ./src/app/etc:/var/www/html/app/etc:delegated
      - ./src/composer.json:/var/www/html/composer.json:delegated
      - ./src/composer.lock:/var/www/html/composer.lock:delegated
      - ./src/nginx.conf.sample:/var/www/html/nginx.conf:delegated
```

What do we do with our other directories and files that aren't mounted? Nothing. Upon setting up the initial project, we copy over all the files from our project to the native Docker volume. A simple bin script may help:

```bash
#!/bin/bash
# Filename: bin/copytocontainer
[ -z "$1" ] && echo "Please specify a directory or file to copy to container (ex. vendor, --all)" && exit

if [ "$1" == "--all" ]; then
  docker cp src/./ $(docker-compose ps|grep phpfpm|awk '{print $1}'):/var/www/html/
  echo "Completed copying all files from host to container"
else
  docker cp src/$1 $(docker-compose ps|grep phpfpm|awk '{print $1}'):/var/www/html/
  echo "Completed copying $1 from host to container"
fi
```

Then by running `bin/copytocontainer --all`, we can copy over our entire Magento filesystem to our PHP container. Once those files are in the container, we really never need them back out, while we also have a copy of the folders and files locally for debugging. We can even make an inverse script to copy things from the container, back to our host, in the event items change at certain times depending on our app:

```bash
#!/bin/bash
# Filename: bin/copyfromcontainer
[ -z "$1" ] && echo "Please specify a directory or file to copy from container (ex. vendor, --all)" && exit

if [ "$1" == "--all" ]; then
  docker cp $(docker-compose ps|grep phpfpm|awk '{print $1}'):/var/www/html/./ src/
  echo "Completed copying all files from container to host"
else
  docker cp $(docker-compose ps|grep phpfpm|awk '{print $1}'):/var/www/html/$1 src/
  echo "Completed copying $1 from container to host"
fi
```

The main performance improvements come from not mounting things considered "caching" directories that are heavily read-intensive during web server or app requests. Our biggest wins are these four directories:

`generated/`: This folder contains files and folders that are automatically-generated on demand, that use Magento's "hook/plugin" system. Since this folder can contain hundreds or even thousands of files, and need to be written to and read from on every request, this is an obvious folder to keep within the native Docker filesystem. We also do not need bi-directional sync. The only time we'll need to be able to view these files is during certain times of debugging, in which case we can just use the `bin/copyfromcontainer generated` command to copy files back to our host for debugging.

`pub/`: Every single one of our web requests and requests for public access makes a request to this folder. This is most likely our heaviest-requested access point in our entire app. Since it's read heavy, and we aren't ever really editing files within this directory, we just keep this in the native Docker volume.

`var/`: Here is a very heavily-utilized folder in Magento, as it contains all cache files, session files, log files, etc. This is the true definition of a caching/temp directory. We rarely need access to anything in this file. If we needed access, we can always connect to the container to inspect the files needed, use the `bin/copyfromcontainer var` command, or mount a specific subfolder we need access to (example: mount `var/log` to the host for bidirectional sync will only mount the `var/log` folder, which isn't a heavily written-to or requested-from folder).

`vendor/`: This is considered an "artifact" directory. Third-party Magento modules get installed here from Composer. It almost certainly contains the highest amount of read from files, and requests hit this directory many, many times on each and every code and app request. Also, we really never edit files here. So, let's keep this just in a native Docker volume. If you did handle development within a subfolder of here instead of the `app` directory, just mount the namespace of your specific directory (ex: `vendor/foo`).

What happens after we apply these updates? Our initial requests of 14 seconds drop to around 7 seconds, and we achieve app performance that roughly 90% or better of native speed/performance. All of the main filesystem reads now happen within the native Docker container/volume, and don't get need to loop through our host machine unnecessarily. Doing this is how we can achieve a significant improvement in I/O within our Docker development environment.

I'm hoping this post helps put an end to filesystem performance issues on Docker for Mac. Hopefully one day, we will not even need to do this! But until then, this is a pretty solid solution that works well for the edge-cases for OSS with very large filesystems.

If you wish to check out my Magento Docker development environment in it's entirety and be able to use many other bin bash helper scripts I've created to deal with common issues, check out my GitHub project at <a href="https://github.com/markshust/docker-magento" target="_blank">markshust/docker-magento</a>.
