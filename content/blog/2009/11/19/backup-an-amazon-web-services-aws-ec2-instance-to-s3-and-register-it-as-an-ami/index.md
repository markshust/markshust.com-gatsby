---
title: "Backup an Amazon Web Services (AWS) EC2 instance to S3 and register it as an AMI"
date: "2009-11-19T00:00:00.000Z"
tags: ["aws", "backups", "ec2", "s3"]
---

Here is another hot topic that seems extremely confusing from the start, but is actually very easy to implement. Amazon Web Services EC2 seems to be the most fully-featured cloud-based web services on the internet. Amazon was the first major party to rollout a massive network of VM’s in the ‘cloud’ and remains to be the highest-respected service out there for Linux computing.

Due to the way Amazon is setup using XEN vm software, if there was ever physical hard drive failure, an ‘instance’ would essentially vanish into thin air (all except ‘Volumes). Not good. There does lie great integration with S3 (Amazon’s Simple Storage) that enables you to backup your instance to S3 for easy retrieval in the even that the random occurence actually does happen.

Summarizing the process in as very few steps as possible, the below is how one would go about creating a ‘bundle’, transferring it to S3 for reliable backup, and registering it as an AMI in your AWS Console.

## Create Bundle

ETA: 20 minutes

- Replace X’s with X.509 Certificate Private Key &amp; Certificate.
- Replace 123456789012 with AWS Account ID (found on Security Credentials page).

```bash
/home/ec2/bin/ec2-bundle-vol --destination /mnt --privatekey /root/pk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem --cert /root/cert-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem --user 123456789012 --exclude /home --prefix image-20091119 --arch i386
```

## Upload to S3 Bucket

ETA: 5 minutes

- Replace X’s with Access Key ID &amp; Secret Access Key (found on Security Credentials page).
- Replace BUCKETNAME with name of bucket setup on S3.

```bash
/home/ec2/bin/ec2-upload-bundle -b BUCKETNAME/instance-snapshots/image-20091119 --manifest /mnt/image-20091119.manifest.xml --access-key XXXXXXXXXXXXXXXXXXXX --secret-key XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
## Remove Unneeded Bundle Files

- Bundle is now stored on S3, so no need to keep a copy locally.

```bash
rm -rf /mnt/im*
```

## Register Bundle on S3 as AMI

ETA: 1 minute

- AMI is defaulted to Private AMI. You may change this from the AWS Console.
- Replace X’s with X.509 Certificate Private Key &amp; Certificate.
- Replace BUCKETNAME with name of bucket setup on S3.

```bash
/home/ec2/bin/ec2-register --private-key /root/pk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem --cert /root/cert-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem BUCKETNAME/instance-snapshots/image-20091119/image-20091119.manifest.xml
```

## Other

Be sure to note, that if you have an EBS storage that is connecting on boot via `/etc/fstab`, you will need to provide an alternate fstab file and then activate it after instance launch. It is best to copy `/etc/fstab` to something like `/etc/fstab.bundled`, and then comment out the EBS drive for easy uncommenting later. If you do not do this, there is a good chance the instance will not boot and will be inaccessible.

Below is a sample line for bundling the instance with a customized fstab file.

```bash
/home/ec2/bin/ec2-bundle-vol --destination /mnt --privatekey /root/pk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem --cert /root/cert-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.pem --user 123456789012 --exclude /home --prefix image-20091119 --arch i386 --fstab /etc/fstab.bundled
```
