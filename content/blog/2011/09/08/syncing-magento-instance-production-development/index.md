---
title: "Syncing a Magento instance from production to development"
date: "2011-09-08T15:19:00.000Z"
tags: ["backups", "magento", "magento1"]
---

**UPDATE!** Code moved to bitbucket: <a href="https://bitbucket.org/markoshust/syncdb/src" target="_blank">https://bitbucket.org/markoshust/syncdb/src</a>

Often times, you need to pull down an up-to-date version of Magento from your production server to your development or staging servers. This involves:

- Executing a mysqldump on production.
- Zipping it up.
- Secure copying the zipped file from production to development (or staging).
- Unzipping the file locally.
- Updating the base URL's in the core_config_data table to your local URL's.
- Executing the SQL into your local database instance.
- Deleting all the temp files from your production and development machines.

What a pain. Wouldn't it be nice if you just executed a script that did all of this for you?

```bash
#!/bin/bash
REMOTE_HOST="username@domain.com"
REMOTE_MYSQL_DB="remote_database_name"
REMOTE_MYSQL_USER="remote_mysql_user"
REMOTE_MYSQL_PASS="REMOTEMYSQLPASSWORD"
REMOTE_BASE_URL="www.yourdomain.com"
REMOTE_COOKIE_DOMAIN=".yourdomain.com"
LOCAL_MYSQL_DB="local_database_name"
LOCAL_MYSQL_USER="local_mysql_user"
LOCAL_MYSQL_PASS="LOCALMYSQLPASSWORD"
LOCAL_BASE_URL="www.yourdomain.localhost"
LOCAL_COOKIE_DOMAIN=".yourdomain.localhost"

if [[ `ssh $REMOTE_HOST 'test -e ~/'$REMOTE_MYSQL_DB'.tmp.sql && echo exists'` == *exists* ]]; then
  echo "Backup is currently being executed by another process. Please try again in a few moments."
  exit 1
fi

echo "Creating backup of production database"
ssh $REMOTE_HOST 'mysqldump -u '$REMOTE_MYSQL_USER' -p'$REMOTE_MYSQL_PASS' '$REMOTE_MYSQL_DB' > ~/'$REMOTE_MYSQL_DB'.tmp.sql' &> /dev/null
ssh $REMOTE_HOST 'tar -czf '$REMOTE_MYSQL_DB'.tmp.sql.tar.gz '$REMOTE_MYSQL_DB'.tmp.sql' &> /dev/null

echo "Transferring database backup to localhost"
scp $REMOTE_HOST:~/$REMOTE_MYSQL_DB.tmp.sql.tar.gz ~/
ssh $REMOTE_HOST 'rm ~/'$REMOTE_MYSQL_DB'.tmp*'

echo "Extracting backup" 
tar -xzf ~/$REMOTE_MYSQL_DB.tmp.sql.tar.gz -C ~/
echo "Updating config" 
sed "s/$REMOTE_BASE_URL/$LOCAL_BASE_URL/g" ~/$REMOTE_MYSQL_DB.tmp.sql > ~/$REMOTE_MYSQL_DB.tmp.1.sql
sed "s/$REMOTE_COOKIE_DOMAIN/$LOCAL_COOKIE_DOMAIN/g" ~/$REMOTE_MYSQL_DB.tmp.1.sql > ~/$REMOTE_MYSQL_DB.tmp.2.sql
sed "s/https/http/g" ~/$REMOTE_MYSQL_DB.tmp.2.sql > ~/$REMOTE_MYSQL_DB.tmp.final.sql
echo "Reloading localhost database (may take few minutes)"
mysql -u $LOCAL_MYSQL_USER -p$LOCAL_MYSQL_PASS $LOCAL_MYSQL_DB < ~/$REMOTE_MYSQL_DB.tmp.final.sql &> /dev/null

# Clean local temp files
rm ~/$REMOTE_MYSQL_DB.tmp*

echo "Complete!"
```

You're welcome :)

Just save the file as syncdb.sh somewhere on your Mac or Linux machine (No love for Windows people, sorry. Come on and get a Mac already.), update the constants at the top of the file, make it executable (`chmod +x`), and execute it as so: `~/syncdb.sh`. You can easily set this up on a cron for automated syncing down of a production database to staging.

**NOTE:** Updated NOV-4-2011 with more configurability between remote and local mysql database names, usernames, passwords, etc.

**NOTE:** Updated NOV-18-2011 with multi-store support on same root domain (.yourdomain.com) and nixing https from localhost.

**NOTE:** Updated AUG-13-2012 with db hostname configurability. Also, moved to bitbucket: <a href="https://bitbucket.org/markoshust/syncdb/src" target="_blank">https://bitbucket.org/markoshust/syncdb/src</a>
