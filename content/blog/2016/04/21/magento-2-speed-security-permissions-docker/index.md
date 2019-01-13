---
title: "Magento 2 speed, security permissions & docker"
date: "2016-04-21T12:47:00.000Z"
tags: ["docker", "magento", "magento2"]
---

![Speed security permissions & docker](magento-2-speed-security-permissions-docker.png)

> Note that this blog post was originally written by myself on Mage Inferno's blog, which no longer exists. Many old user comments have been lost, but this post won't be!

We hope you've enjoyed (and continue to enjoy) our <a href="https://hub.docker.com/u/mageinferno/" target="_blank">Docker images for Magento 2</a> and related <a href="https://github.com/mageinferno/magento2-docker-compose" target="_blank">Docker Compose</a> setup. Mage Inferno believes Docker is the future of web deployment development & deployment pipelines. While our Docker images generally work really well, working with Docker on OS X has posed it's own sets of issues and limitations.

## Native Performance

If you develop on OS X with Docker and use the default VirtualBox filesystem (vboxfs), you will have a pretty horrible experience if you mount remote fileshares, especially with the many folders & files included in the Magento 2 architecture. This leads most people to run either a <a href="https://github.com/brikis98/docker-osx-dev" target="_blank">filesystem hack</a> or a solution with custom NFS fileshare capabilities, such as <a href="https://github.com/codekitchen/dinghy" target="_blank">Dinghy</a> or <a href="https://github.com/nlf/dlite" target="_blank">DLite</a>.

Dinghy is something that we initially suggested to use in our original <a href="/2015/07/15/magento-2-development-docker-os-x" target="_blank">Magento 2 Development with Docker on OS X</a> post, and it has proved to be a pretty great tool that also includes a DNS server and HTTP proxy. That said, some have questioned the stack and raised their own sets of concerns with having to implement yet another tool besides Docker, or not being able to use the Docker Toolbox directly with these third-party tools. Dinghy and Docker Toolbox also have a very long startup process, and need to request Admin access to mount remote fileshares (which also comes with it's own set of security concerns).

## Permission Errors

Magento 2 comes out of the box with very rigorous, locked-down set of security permissions. Magento <a href="http://devdocs.magento.com/guides/v2.0/install-gde/prereq/apache-user.html" target="_blank">suggests running their software with a new `magento` user</a> and they also have implemented additional application-level security controls. As you can see with the infamous permissions <a href="https://github.com/magento/magento2/issues/2412" target="_blank">issue #2412</a>, the decision to implement application-level security controls has backfired within the community, and is generally regarded as the <a href="https://github.com/magento/magento2/issues/2412#issuecomment-211807715" target="_blank">number one impediment for a new user installing Magento 2</a>.

The path of least resistance is to <a href="https://github.com/magento/magento2/issues/2412#issuecomment-189118410" target="_blank">remove application-level security controls</a>, which it does appear Magento is <a href="https://github.com/magento/magento2/commit/642127547acbc91f2cb864c3d4880ce4998a9bc4" target="_blank">in the process of merging in & resolving</a>. However, this changeset does not appear to be merged into the most recent version of Magento at the time of this post (2.0.4).

## Welcome to Docker for Mac

Luckily, the ecosystem is progressing, and now there is a better way.

We've recently received our beta invite to the beta for <a href="https://beta.docker.com/" target="_blank">Docker for Mac</a>, and here is our general consensus:

![Oh snap](giphy.gif)

You can read all of the benefits yourself on the <a href="https://beta.docker.com/docs/features-overview/" target="_blank">Features Overview</a> page, but here are some key bullet points:

- **No more VirtualBox.** Docker now runs through a xhyve VM through Alpine Linux, and is managed by Docker directly.
- **Native integration.** No longer does it feel that Docker is running separately from OS X. Now, it feels like it just belongs.
- **osxfs.** vboxfs, nfs, and related fileshare hacks are now history. Now we have native filesystem performance on your Docker containers with osxfs.
- **Built-in DNS.** The above items, and this DNS item specifically, eliminates the need to run other tools such as Dingy or DLite.

## The "magento" User

Until <a href="https://github.com/magento/magento2/issues/2412" target="_blank">issue #2412</a> is resolved, we are recommending to all users of Magento 2 to not implement or use the newly recommended `magento` user. Due to the inability for multiple software packages to properly communicate with each other and work in tandem (because of the implemented application-level security controls), it is practically impossible to get Magento 2 running with the new `magento` user, especially when implementing a setup such as our recommended Nginx + PHP-FPM stack.

We've updated all of our Docker images to only run with the `www-user` user/group, updated all files/folders to be owned by `www-user` user/group, and removed the `magento` user completely from our build scripts. We don't believe the are any inherent security problems at the present time with running this type of ownership setup, and hoping as soon as issue #2412 is resolved, we can reimplement the `magento` user ownerships on files & folders.

## New Docker Images

Mage Inferno's Docker images now have <a href="https://hub.docker.com/u/mageinferno/" target="_blank">over 10,000 pulls</a>! We thank the community for the overwhelming feedback we've received from being the number one Magento 2 Docker images available on DockerHub. We strongly believe that it is still the easiest way to get started with Magento 2 development, and will continue to be for some time.

> <a href="https://hub.docker.com/u/mageinferno/" target="_blank">![Mage Inferno - Docker Hub](logo-tm-md.png)<br/>View all Mage Inferno images at Docker Hub</a>

In honor of hitting our 10,000 pull milestone, we are releasing a new set of Docker images, which will resolve all of the security and permission problems that have occurred in the past.

You can use our Docker images on the current Docker Toolbox, or if you already have access to the new Docker for Mac, use that for better performance.

## 3 Simple Steps

It's so easy to get Magento 2 installed today with Docker, Docker Compose and our container images.

### Step 1: Create docker-compose.yml file:

(also available on GitHub at <a href="https://github.com/mageinferno/magento2-docker-compose" target="_blank">https://github.com/mageinferno/magento2-docker-compose</a>)

```yaml
# Mage Inferno Docker Compose (https://github.com/mageinferno/magento2-docker-compose)
# Version 4.1.0

app:
  image: mageinferno/magento2-nginx:1.9.14-0
  links:
    - phpfpm
    - db
  volumes_from:
    - appdata
  ports:
    - 8000:80

appdata:
  image: tianon/true
  volumes:
    - /srv/www
#    - ~/.composer:/var/www/.composer
#    - ./www/app/code:/srv/www/app/code

phpfpm:
  image: mageinferno/magento2-php:7.0.5-fpm-0
  links:
    - db
  volumes_from:
    - appdata

db:
  image: mariadb:10.1.13
  volumes_from:
    - dbdata
  ports:
    - 8001:3306
  environment:
    - MYSQL_ROOT_PASSWORD=magento2
    - MYSQL_DATABASE=magento2
    - MYSQL_USER=magento2
    - MYSQL_PASSWORD=magento2

dbdata:
  image: tianon/true
  volumes:
    - /var/lib/mysql

setup:
  image: mageinferno/magento2-php:7.0.5-fpm-0
  command: /usr/local/bin/mage-setup
  links:
    - db
  volumes_from:
    - appdata
  environment:
    - M2SETUP_DB_HOST=db
    - M2SETUP_DB_NAME=magento2
    - M2SETUP_DB_USER=magento2
    - M2SETUP_DB_PASSWORD=magento2
    - M2SETUP_BASE_URL=http://m2.localhost:8000/
    - M2SETUP_ADMIN_FIRSTNAME=Admin
    - M2SETUP_ADMIN_LASTNAME=User
    - M2SETUP_ADMIN_EMAIL=dummy@gmail.com
    - M2SETUP_ADMIN_USER=magento2
    - M2SETUP_ADMIN_PASSWORD=magento2
    - M2SETUP_VERSION=2.0.5
    - M2SETUP_USE_SAMPLE_DATA=false
    - M2SETUP_USE_ARCHIVE=true
```

### Step 2: Install Magento 2

```plain
docker-compose run --rm setup
```

### Step 3: Start Magento 2 Application

```plain
docker-compose up -d app
```

## Conclusion

Once the Docker container images initially download, the setup is 100% automated and you'll be up & running in no time. Update the environment variables to set your desired options (for instance, to install sample data, set `M2SETUP_USE_SAMPLE_DATA` to `true`), run a couple commands, and you are good to go.

Here's to another 10,000 pulls!
