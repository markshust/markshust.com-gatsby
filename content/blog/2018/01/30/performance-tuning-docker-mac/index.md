---
title: "Performance Tuning Docker for Mac"
date: "2018-01-30T16:50:00.000Z"
tags: ["docker"]
---

There are many various improvements you can make to Docker for Mac to fine-tune performance, especially when working with large application filesystems such as those with Magento or Zend Framework.

## Step 1: Computer, Cores & RAM

I'm absolutely resolved that a dual-core machine with 8GB RAM will just simply not cut it. My MacBook Air just spins fans, and fswatch events get delayed or stop working just because there is not enough computing power to go around.

Once you have (at the very least) a quad-core MacBook Pro with 16GB RAM and an SSD, go to Docker > Preferences > Advanced. Set the "computing resources dedicated to Docker" to at least 4 CPUs and 8.0 GB RAM.

## Step 2: Docker Disk Type

Next, go to Disk settings. Be sure the "Disk image location" value ends with the file type "Docker.raw". The new raw filesystem ensures you are using the latest image format for performance. If you don't see this or instead see something like "qcow2", edit the `filePath` property of the file `~/Library/Group Containers/group.com.docker/settings.json` extension from `.qcow2` to .`raw`, and restart Docker for Mac.

Next, set the Overlay2 Filesystem in Daemon > Advanced. Basically, you want to add a property of `"storage-driver": "overlay2"`. For more information on this, see <a href="http://markshust.com/2017/03/02/making-docker-mac-faster-overlay2-filesystem" target="_blank">this related blog post</a>.

Note that all previous containers, images and Docker data will be reset and lost with either of these changes, so it's best to apply before doing any other tweaks or performance updates.

## Step 3: Disable Unneeded File Shares

By default, Docker for Mac comes with `/Users`, `/Volumes`, `/private`, and `/tmp` directories available to bind mount into Docker containers. Remove all of these. Add the root location of where your website files and composer home are located. For me, this is `/Users/myusername/Sites` as well as `/Users/myusername/.composer`. These are most likely the only folders you need to bind-mount to Docker. This makes sure Docker is not unnecessarily listening for filesystem changes in other locations.

## Step 4: Use "delegated" Volume Mounts

This is a <a href="https://docs.docker.com/docker-for-mac/osxfs-caching/" target="_blank">fairly new feature of Docker for Mac 17.04</a>, and isn't nearly used enough. The "delegated" flag is the one you want to use. This postpones writes back to the host in order to achieve higher filesystem throughput.

Enjoy your modified Docker setup! Hope you experience much better performance as Docker for Mac continues to get better each day.
