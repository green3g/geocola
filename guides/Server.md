<!--
@page guides.administer.server Server Setup
@parent guides.administer
@link http://geoserver.org/ Geoserver
-->

Any wms server can be used, since the app was tested with Geoserver, this guide will explain how to set up Geoserver.

A great way to avoid problems is to setup geoserver behind a reverse proxy. This solves issues involving Cross Origin requests where requests are blocked because Geoserver runs on a different port than your web server.

Alternatively, you can [enable cors](http://enable-cors.org/index.html) on the software running geoserver.

The following will allow you to access geoserver at localhost/geoserver as opposed to localhost:8080/geoserver.

## Apache2

In `/etc/apache2/httpd.conf` include an additional file:

```
Include /etc/apache2/geoserver.conf
```

And create a new file: `/etc/apache2/geoserver.conf` with the following:

```
ProxyPass /geoserver http://localhost:8080/geoserver
ProxyPassReverse /geoserver http://localhost:8080/geoserver
```

Also enable the mods:
```bash
sudo a2enmod mod_proxy
sudo a2enmod proxy_http
```

## Nginx

```
#...
http {
    #...
    upstream geoserver {
        server 127.0.0.1:8080;
    }
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  C:/www/nginx-1.9.9/logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;


    server {
        listen       80;
        #...

        location /geoserver {
          proxy_pass         http://geoserver;
          proxy_redirect     off;
          proxy_set_header   Host $host;
          proxy_set_header   X-Real-IP $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header   X-Forwarded-Host $server_name;
        }
        #...
    }
  #...
}
```
