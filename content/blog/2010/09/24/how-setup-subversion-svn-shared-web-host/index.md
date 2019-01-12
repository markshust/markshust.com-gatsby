---
title: "How to setup Subversion (SVN) on a shared web host"
date: "2010-09-24T00:00:00.000Z"
tags: ["svn"]
---

Well, if you aren’t privileged enough to host with my hosting company, Insider Host (shameless plug), then you may stumble upon a shared web host that doesn’t have Subversion installed (shame on them! unless they are using Git…). That doesn’t mean you can’t install SVN if you have SSH/shell access.

There are some write-up’s that are correct online, but they are all super-dated (over a couple years old). While Subversion 1.6.X is in fact released, at the time of this writing Subversion 1.4.2 is still the main supported version on major package repositories. Since you will run into mighty trouble eventually trying to mix commits from different versions of SVN, this writing will focus on getting everything configured for Subversion 1.4.2.

You can use the following lines for reference or just to copy/paste directly into your terminal window. Happy trails!

```bash
mkdir ~/src
cd ~/src
# Download all packages
wget http://archive.apache.org/dist/apr/apr-util-1.2.12.tar.gz http://archive.apache.org/dist/apr/apr-1.2.12.tar.gz http://www.webdav.org/neon/neon-0.27.2.tar.gz http://subversion.tigris.org/downloads/subversion-1.4.2.tar.gz
# Unzip all packages
tar -xzf apr-1.2.12.tar.gz && tar -xzf apr-util-1.2.12.tar.gz && tar -xzf neon-0.27.2.tar.gz && tar -xzf subversion-1.4.2.tar.gz
# Build & Install
cd ~/src/apr-1.2.12 && ./configure --prefix=$HOME LDFLAGS="-L/lib64" && make && make install
cd ~/src/apr-util-1.2.12 && ./configure --prefix=$HOME --with-apr=$HOME LDFLAGS="-L/lib64" && make && make install
cd ~/src/neon-0.27.2 && ./configure --enable-shared --prefix=$HOME LDFLAGS="-L/lib64" && make && make install
cd ~/src/subversion-1.4.2 && ./configure --prefix=$HOME --without-apxs --without-berkeley-db --with-zlib --with-ssl LDFLAGS="-L/lib64" && make && make install
# You can now get rid of downloaded source code
rm -rf ~/src
```
