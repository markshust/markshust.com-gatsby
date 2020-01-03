---
title: "Using Docker Machine on OS X with Dinghy"
date: "2015-09-03T12:02:00.000Z"
tags: ["dinghy", "docker"]
---

![Dinghy](using-docker-machine-os-x-dinghy.png)

> Note that this blog post was originally written by myself on Mage Inferno's blog, which no longer exists. Many old user comments have been lost, but this post won't be!

Today, <a href="https://github.com/codekitchen/dinghy" target="_blank">Dinghy</a> released version 4.0 of their software, based on <a href="https://docs.docker.com/machine/" target="_blank">Docker Machine</a> rather than Vagrant. We are really excited about this, because of some of the shortcomings of vagrant-based VM's, and because of the new features and capabilities Docker Machine.

## Install the brew package

It's quite easy to setup and get going. If you've previously installed Dinghy, do the following:

```meta
cd `brew --prefix`/var/dinghy/vagrant && vagrant destroy
rm -rf `brew --prefix`/var/dinghy/vagrant
cd ~
brew reinstall --HEAD https://github.com/codekitchen/dinghy/raw/latest/dinghy.rb
```

If you are new to Dinghy, install it with the following:

```meta
brew install --HEAD https://github.com/codekitchen/dinghy/raw/latest/dinghy.rb
```

## Create the Dinghy VM

Our next step is to create the dinghy VM. This creates a VM that is based on VirtualBox and docker machine. Please note it will take a few minutes for this command to complete:

```meta
dinghy create --provider virtualbox
```

After a successful VM creation, you'll receive shell output similar to the following:

```meta
export DOCKER_HOST=tcp://192.168.99.100:2376
export DOCKER_CERT_PATH=/Users/your-username/.docker/machine/machines/dinghy
export DOCKER_TLS_VERIFY=1
export DOCKER_MACHINE_NAME=dinghy
```

Be sure to add these lines to your `~/.bash_profile` file. Also, don't copy/paste the above because these lines change for each specific install. (If you have preexisting variables form a previous installation of Dinghy, remember to remove those first).

## Test the installation

You may now test the installation. An easy way is to run:

```meta
docker ps
```

This will show all of your docker images. Let's try testing it out by dropping into a PHP shell:

```meta
docker run -it php
```

## Explore all features

Dinghy is a great tool for working with Docker on OS X, and especially Magento 2 because of the very large filesystem, and need for NFS. Be sure to check out all of these features on <a href="https://github.com/codekitchen/dinghy" target="_blank">their GitHub page</a>:

- DNS Resolution
- HTTP Proxy
- Docker Machine integration
