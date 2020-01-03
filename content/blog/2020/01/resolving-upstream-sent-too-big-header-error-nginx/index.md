---
title: "Resolving 'upstream sent too big header' error for Nginx"
date: "2020-01-02T19:30:00.000Z"
tags: ["magento", "nginx", "php"]
---

After I enabling & configured Elasticsearch within my local Magento development environment, I tried searching for a term to test it out and received the notorious 502 Bad Gateway error:

![502 Bad Gateway](502-bad-gateway.png)

A 502 gateway error occurs when the web server loses a connection to a backend proxy. In this case, Nginx is my web server and PHP-FPM is the configured backend proxy connection. When Nginx receives a request for a PHP file, it is proxied to the PHP proxy for processing (which is PHP-FPM listening on port 9000).

The only way to diagnose a gateway error is to inspect the web server logs. The Nginx error log is usually located at `/var/log/nginx/error.log`, so go ahead and open that file up. I'm using Docker where logs are piped to STDOUT, so instead I used `docker-compose logs app`, with `app` being the name of my Nginx container service.

Near the end of the log output I noticed this being logged:

```bash
2020/01/02 23:39:03 [error] 6#6: *2 upstream sent too big header while reading response header from upstream, client: 172.18.0.1, server: mydomain.test, request: "GET /catalogsearch/result/?q=test HTTP/1.1", upstream: "fastcgi://unix:/sock/docker.sock:", host: "mydomain.test"
```

This is telling us the upstream (PHP-FPM) sent too big a header while responding, which is basically an out of memory error. If the header is too big, we need to increase the memory or allocation so the upstream proxy (again, PHP-FPM) can send back a larger request to Nginx.

If I look at the web server config at `/etc/nginx/conf.d/default.conf`, the upstream proxy is defined with:

```bash
upstream fastcgi_backend {
  server unix:/sock/docker.sock;
}
```

I'm using a `fastcgi_backend` that points back to a unix socket, but yours may instead contain a `proxy_pass` directive that points to a web address host and port.

There is also a website-specific Nginx configuration file. For Magento, this is typically defined within the project root at `nginx.conf`, but yours may be in a `sites-available` folder. The goal here is to find the section of this file which deals with the request you're having trouble with. In scanning through the file I eventually stumbled upon this location directive:

```bash
...
# PHP entry point for main application
location ~ ^/(index|get|static|errors/report|errors/404|errors/503|health_check)\.php$ {
    try_files $uri =404;
    fastcgi_pass   fastcgi_backend;
    fastcgi_buffers 1024 4k;

    fastcgi_param  PHP_FLAG  "session.auto_start=off \n suhosin.session.cryptua=off";
    fastcgi_param  PHP_VALUE "memory_limit=756M \n max_execution_time=18000";
    fastcgi_read_timeout 600s;
    fastcgi_connect_timeout 600s;

    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_param  MAGE_RUN_TYPE    $MAGE_RUN_TYPE;
    fastcgi_param  MAGE_RUN_CODE    $MAGE_RUN_CODE;
    include        fastcgi_params;
}
...
```

The comment tells us that this is the main entry point for our application, but even if it didn't we can see that this location directive will match `/index.php`, which is the main entry point for Magento.

The directive we want to inspect within this section is either the `fastcgi_pass` directive or the `proxy_pass` directive. Chances are you will have one or the other. In this case, Magento uses FastCGI to pass values to the PHP proxy, so it uses `fastcgi_pass`.

You will want to use either the `fastcgi_buffer_size` or `proxy_buffer_size` configuration name, depending upon which of the previous types you are using:

- `fastcgi_pass`: Use the `fastcgi_buffer_size` directive
- `proxy_pass`: Use the `proxy_buffer_size` directive

The buffer size controls how much memory the response buffer can allocate. The default is either a measely `4k` or `8k` value. We'll want to raise it to something like `128k`. By increasing this value, we'll allow PHP to process larger requests.

Within the section but near the end, let's add this directive:

```bash
...
    fastcgi_param  MAGE_RUN_TYPE    $MAGE_RUN_TYPE;
    fastcgi_param  MAGE_RUN_CODE    $MAGE_RUN_CODE;
    include        fastcgi_params;

    fastcgi_buffer_size 128k;
}
...
```

Now all we need to do is restart Nginx (or in my case, the Nginx Docker container), and our updates will be applied. You can confirm the value was set properly by running:

```bash
nginx -T | grep buffer_size
```

> The Docker equivalent: `docker-compose exec app nginx -T | grep buffer_size`

When you now check the website address that was receiving the gateway error, it should now return a result. If you still get a gateway error, there is almost certainly another problem going on which you'll need to further diagnose by inspecting the web server logs in more detail.
