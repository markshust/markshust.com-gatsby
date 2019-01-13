---
title: "Easiest way to install git flow on Mac OS X"
date: "2012-05-02T21:19:00.000Z"
tags: ["git"]
---

I've recently switched all of my git repositories to use something called git flow. Found this browsing around, and it's a WAY simpler development process than what I've been doing. Basically, it rebases, merges, creates and deletes branches for you.

**Download and install GCC:**

<a href="https://github.com/kennethreitz/osx-gcc-installer" target="_blank">https://github.com/kennethreitz/osx-gcc-installer</a>

**Download and install Homebrew:**

`/usr/bin/ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"`

**Then install git flow:**

`brew install git-flow`

**Some basic reading material here:**

<a href="http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/" target="_blank">Why Aren't You Using Git Flow?</a>

I highly suggest to everyone using git to install this and start using it immediately, as the current process is most likely killing your dev process. Here is also a good video that visually explains the process of git flow on <a href="http://vimeo.com/16018419" target="_blank">Vimeo</a>.
