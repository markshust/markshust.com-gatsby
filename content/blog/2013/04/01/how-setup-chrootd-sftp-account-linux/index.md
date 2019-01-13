---
title: "How to setup a chroot'd SFTP account in Linux"
date: "2013-04-01T10:22:00.000Z"
tags: ["php", "ioncube"]
---

When I went to create an SFTP account for a client, which needed to be chroot'd (~ locked down to that directory), I really didn't think it would be that difficult. Setting up regular SSH and FTP accounts is usually pretty straight forward, and actually so is creating SFTP accounts. But when you add in the ability to chroot it, it becomes a bit more complex. There aren't too many good straight-forward writeups about this online that actually explain things in any detail, so I did my best and tried to keep it simple.

## Create a group for your users

You need a specific group to house all of your SFTP users. A good name would be `sftpusers`, like so:

```plain
sudo groupadd sftpusers
```

## Create your new user

Next, create a username for your new SFTP account. You also have to choose a subdirectory for your files to live in. In this case, that subdirectory is `public`. Note that it appears the `public` directory would live in the root of your filesystem; this isn't the case, as the front slash in this situation will reference the base directory of all of our sftpusers (just keep following me here). Our username in this case is `joebob`.

```plain
useradd -g sftpusers -d /public -s /sbin/nologin joebob
```

You'll be prompted to create a user password. This line creates an entry in `/etc/passwd` for `joebob`, but is a lot safer to use than editing that file directly. If you want to modify an existing user (or correct a typo), use `usermod` instead of `useradd`.

## Configure Internal SFTP Server and define Chroot Jail

Next, we need to tell SSHD to use the internal sftp for incoming connections.

Open the sshd config file:

```plain
sudo vi /etc/ssh/sshd_config
```

Search for a line starting with Subsystem. This is the line that handles incoming connections. You can comment out the existing line, or replace it with the following:

```plain
Subsystem sftp internal-sftp
```

Here is where the confusion kinda starts. We need to define the jail for our SFTP user group. Since a user is assigned to a group, we need to relate that group to an SSH config:

Still in `/etc/ssh/sshd_config`, add the following to the end of the file:

```plain
Match Group sftpusers
    ChrootDirectory /home/%u
    ForceCommand internal-sftp
Match
```

I like to throw all of the users in the system into the `/home` directory, as this is pretty standard in Linux environments. The `%u` is a special variable that tells SSH to user the name of the username for the person (in this case, `joebob`).

## Create SFTP and user directories

You can also go ahead and create that directory, along with the subdirectory we defined when setting up the user (ex. `public`):

```plain
sudo mkdir /home/joebob
sudo mkdir /home/joebob/public
```

Now, on these directories, we need to set specific permissions. We actually want the /home/joebob folder to be owned by root user and group. This permission makes sure that the user is locked down to their account. So set it as so:

```plain
sudo chown root:root /home/joebob
```

The user's subdirectory will have different ownership permissions so they are able to read/write/execute files and folders inside their folder. So we want this directory to match the user's defined user and group:

```plain
sudo chown joebob:sftpusers /home/joebob/public
```

## Restart SSH and test

You should now be good to go! Just restart the SSH service:

```plain
sudo service sshd restart
```

And test! (of course replace yourserver.com with your server domain or IP):

```plain
sftp joebob@yourserver.com
```

You should now be confirmed into your Chroot jail and be all locked down. Enjoy!
