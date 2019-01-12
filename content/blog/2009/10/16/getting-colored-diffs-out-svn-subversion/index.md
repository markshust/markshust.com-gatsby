---
title: "Getting colored diffs out of SVN (Subversion)"
date: "2009-10-16T00:00:00.000Z"
tags: ["bash", "svn"]
---

Here is a neat trick to get much better colored diffs out of subversion when you are in command line. Just add the following lines anywhere in your `~/.bashrc` or `~/.bash_profile` file, and you will have nice colored diffs just like Git.

```bash
#colordiff function svndiff() {
    local SVN="`which svn`"
    # The colordiff utility (http://colordiff.sourceforge.net) is
    # needed for this enhancement to work
    # Thanks to Lukas Kahwe Smith for the addition to
    # leave out whitespace changes
    # Thanks to Robin Speekenbrink for the hint to the -R
    # switch of less, which should fix problems some of
    # you might have with colorization.
    ${SVN} diff "$@" --diff-cmd `which diff` -x "-u -w"|colordiff|less -R
}
```
