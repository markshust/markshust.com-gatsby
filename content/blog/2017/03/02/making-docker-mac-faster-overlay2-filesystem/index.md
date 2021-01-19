---
title: "Making Docker for Mac Faster with the Overlay2 Filesystem"
date: "2017-03-02T09:15:00.000Z"
tags: ["docker"]
---

By default, Docker for Mac ships with the default filesystem being `aufs`. This is a fairly antiquated filesystem and is quite slow if you deal with lots of files and filesystem reads and writes. You can <a href="https://github.com/chriskuehl/docker-storage-benchmark" target="_blank">see the results of a filesystem benchmark to compare</a>.

The easiest task to do to get better filesystem performance in Docker is to switch to the `overlay2` filesystem. This achieves better performance by optimizing how layers are created and managed.

The first step to do is to check that you are in fact currently not using `overlay2`. Open up command line and type:

```bash
docker info | grep "Storage Driver"
```

The output will most likely be `Storage Driver: aufs`. Let's change this to `overlay2`.

## Cleaning out your closet

Since switching filesystems will change the location of where all of the docker images and containers are stored on your machine, switching the driver will cause you to lose the reference to all of these. If you don't ever wish to switch back to `aufs`, you'll want to be sure to reclaim disk space first to make sure there aren't any unnecessary disk images stored on your machine that you aren't currently using.

You can remove all images on your machine by first stopping and removing all running containers on your machine. Then run the command:

```bash
docker image prune -a
```

This will remove all images stored on your machine. If you just wish to test out `overlay2`, you may want to skip this step so you can go back to your previous configuration and images.

## Update the Daemon

The easiest way to switch to the `overlay2` filesystem with Docker for Mac is to open up the Docker taskbar app and go to Preferences. Under the Daemon tab, you will find an Advanced tab. This is where you can edit the `daemon.json` file to have your changes persist upon system reboots and Docker updates. You'll want this line to read:

```javascript
{
  "storage-driver": "overlay2"
}
```

Then click Apply & Restart.

## Confirm Overlay2 Filesystem

After the daemon restarts, open up terminal and again type:

```bash
docker info | grep "Storage Driver"
```

If you see `Storage Driver: overlay2` being outputted, congratulations, you are now using the `overlay2` filesystem. Enjoy better filesystem performance!
