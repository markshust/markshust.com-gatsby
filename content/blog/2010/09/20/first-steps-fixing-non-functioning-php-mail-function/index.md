---
title: "First steps to fixing a non-functioning php mail() function"
date: "2010-09-20T00:00:00.000Z"
tags: ["php"]
---

After creating and configuring a new LAMP stack, there are times where the php mail() function will not work. This could cause a lot of headaches, but there are really only a few things to check to save yourself from a bunch of waterworks and lost time.

- Make sure php-imap is installed. This is necessary for php to send mail

  ```bash
  yum install php-imap
  service httpd restart
  ```

- Ensure your machine has a FQDN (fully-qualified domain name). You may query the current hostname using:

  ```bash
  hostname
  ```

- If you are testing a new domain which is not yet configured on the server, using the default Postfix mail program, add the domain

  ```bash
  nano /etc/postfix/main.cf
  ```

- Change the myhostname variable to your domain, example: `myhostname = my.foo.com`

- Test the mail function using a good sendmail.php script, such as the following:

```php{numberLines: true}
<!--
This is a script, written and designed to test the functionality of the
PHP mail() function on a web hosting account. I offer no warrenty with
this script. Anyone can use and distribute the script freely.
-->
<title>PHP Mail() test</title>
This form will attempt to send a test email. Please enter where this test should be sent to:
<form action="sendmail.php" method="post" name="sendmail" data-children-count="2">
Enter an email address: <input type="text" name="to" data-kwimpalastatus="alive" data-kwimpalaid="1547324401405-2">
<br>
<input type="submit" value="Send" name="submit">
<input type="reset" value="Reset" name="reset">
<br>
<p>
<?php
if(isset($_POST['to'])) {
    $host = $_SERVER['HTTP_HOST'];
    $uri = $_SERVER['SCRIPT_URI'];
    $mail_to=$_POST['to'];
    $mail_subject="Test email from $host";
    $mail_body="This is a test email, sent from $uri";
    $header = "Content-type: text/html\n";
    $header .= "From: \"PHP mail() Test Script\"\n";
    if (mail($mail_to, $mail_subject, $mail_body,$header)) {
        print "Email sent successfully!";
    } else {
        print "Email did not send";
    }
}
```

First, follow the above steps. If those still don’t work, then you need to start digging further...
