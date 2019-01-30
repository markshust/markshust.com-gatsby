---
title: "Useful script for working with remote branches in git"
date: "2011-12-28T13:31:00.000Z"
tags: ["git"]
---

Working with git using remote branches is a great tool to manage workflow and coordinating code with other developers. However, the commands you need to remember could be quite daunting and even hard to remember for the experienced programmer. I created a simple script at github called <a href="https://github.com/markshust/git-remotebranch/blob/master/git-remotebranch" target="_blank">git-remotebranch</a>. A copy of the script is below (please see github for the latest and greatest). Just chmod it 777, throw it in your /etc/init.d/ folder (or another directory which has been added to the binary shell path), and you are good to go. It's pretty self explanatory.

```bash
#!/bin/sh
# git-remotebranch <action> &lt;branch_name&gt;
# author: Mark Shust &lt;mark@shust.com&gt;

if [ -z ${2} ]; then
  echo "You must use this script in the format git-remotebranch <action> &lt;branch_name&gt;"
  exit
fi

case $1 in
'add')
    git checkout -b ${2}
    git push -u origin ${2}
    echo "The ${2} remote branch has been added"
    ;;
'rm')
    git push origin :heads/${2}
    # also delete local branch, comment out if not needed
    git branch -D ${2}
    echo "The ${2} remote branch has been removed"
    ;;
'co')
    git checkout --track -b ${2} origin/${2}
    ;;
*)
    echo "Invalid action. Must be 'add', 'rm' or 'co'."
    ;;
esac
```
