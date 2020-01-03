---
title: "Fix Google Chrome slow or hanging resolving host"
date: "2019-12-17T16:45:00.000Z"
tags: ["chrome", "docker"]
---

I've been using Firefox for a while now because I was experiencing issues related to slowness of Google Chrome, seemingly relating to Docker. However due to bugs with a specific SaaS app I use, I needed to switch back to Chrome for the time being.

After working within Chrome for a few days, I was routinely receiving the dreaded "Resolving host..." message for quite a few moments, along with painstakingly slow load times:

![Resolving Host...](resolving-host.png)

I dug around the internet, reading through countless articles of flushing the DNS cache, tweaking Google Chrome settings, trying out new DNS servers, and all sorts of other things. The issue seemed to be directly related to Google Chrome, because, well, Firefox worked just fine, and pings from Terminal to my local domain name were resolving.

Typically with Docker, and really any other web app which needs a local domain, you'd setup new records in the `/etc/hosts` file on your Mac or Linux machine. Here's an example of that file:

```meta
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1 localhost
255.255.255.255 broadcasthost
::1 localhost

# Added by Docker Desktop
# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
# End of section

127.0.0.1 mysite.test
```

The `127.0.0.1 mysite.test` entry at the end of this file was added manually by us, and we can add as many of these DNS entries to this file as we wish. This will cause requests to the `mysite.test` domain to resolve back to our local machine, which in turn resolves requests from that domain back to the Docker container running on either port 80 or 443 on our local machine.

Note that this appears to be the correct way to setup local DNS entries. It is how Docker Desktop sets up the `kubernetes.docker.internal` DNS entry, now isn't it?

Is the entry: `127.0.0.1 mysite.test`

the same format as the entry: `127.0.0.1 kubernetes.docker.internal` ?

The answer: sort of.

There's one important distinction between the Kubernetes DNS entry and ours -- the former ends in `.internal`. A domain ending in `.internal` is treated within a special context and always resolves everything internally, while our `.test` domain does not. That said, our usage of `.test` here is warranted as <a href="https://en.wikipedia.org/wiki/.test" target="_blank">it is the recommended TLD for local web development</a>.

While Firefox resolves our route right away, Google Chrome does not. It sticks in a "resolving host" state. That tells us that Chrome is still awaiting a response to a DNS request. It will eventually resolve, but what else could it be checking for?

The answer: IPv6.

The fix for this is easy. All we need to do is add an IPv6 entry to our host entry:

```meta
127.0.0.1 ::1 mysite.test
```

By adding `::1` to the entry, it tells Chrome, along with any other software app that relies on and uses IPv6, that the IPv6-related DNS is also local. This fully completes Google Chrome's DNS request loop, making it act similarly to the `.internal` domain name, and makes requests no longer hang in the "resolving host" request state. Chrome will now respond to requests which resolve to our local machine instantly.
