# Deployment
[[toc]]

## Introduction

When you're ready to deploy your Laravel application to production, there are some important things you can do to make sure your application is running as efficiently as possible. In this document, we'll cover some great starting points for making sure your Laravel Hyperf application is deployed properly.

## Server Requirements

The Laravel Hyperf framework has a few system requirements. You should ensure that your web server has the following minimum PHP version and extensions:

 - PHP >= 8.1
 - Any of the following network engines
   - [Swoole PHP extension](https://github.com/swoole/swoole-src) >= 5.0
   - [Swow PHP extension](https://github.com/swow/swow) >= 1.4
 - JSON PHP extension
 - Pcntl PHP extension (Only on Swoole engine)
 - OpenSSL PHP extension (If you need to use the HTTPS)
 - PDO PHP extension (If you need to use the MySQL Client)
 - Redis PHP extension (If you need to use the Redis Client)
 - Protobuf PHP extension (If you need to use the gRPC Server or Client)

::: note
If you've installed `hyperf/polyfill-coroutine` package, you must set `swoole.use_shortname` to `Off` in your `php.ini` file.
:::

### Docker

If you plan to deploy your application via docker, you can find various Dockerfiles in the [hyperf/hyperf-docker](https://github.com/hyperf/hyperf-docker) project, or use a pre-built image based on [hyperf/hyperf](https://hub.docker.com/r/hyperf/hyperf).

## Server Configuration

### Nginx for HTTP

If you are deploying your application to a server that is running Nginx, you may use the following configuration file as a starting point for configuring your web server. Most likely, this file will need to be customized depending on your server's configuration.

```nginx
# At least one Hyperf node is required, multiple configuration lines
upstream hyperf {
    # IP and port of Hyperf HTTP Server
    server 127.0.0.1:9501;
    server 127.0.0.1:9502;
}

server {
    # listening port
    listen 80;
    # Bound domain name, fill in your domain name
    server_name proxy.hyperf.io;

    location / {
        # Forward the client's Host and IP information to the corresponding node
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Forward cookies, set SameSite
        proxy_cookie_path / "/; secure; HttpOnly; SameSite=strict";

        # Execute proxy access to real server
        proxy_pass http://hyperf;
    }
}
```

### Nginx for Websocket

If you plan to proxy your websocket services, you may use the following configuration file.

```nginx
# At least one Hyperf node is required, multiple configuration lines
upstream hyperf_websocket {
    # Set the load balancing mode to IP Hash algorithm mode, so that each request from different clients will interact with the same node
    ip_hash;
    # IP and port of Hyperf WebSocket Server
    server 127.0.0.1:9503;
    server 127.0.0.1:9504;
}

server {
    listen 80;
    server_name websocket.hyperf.io;

    location / {
        # WebSocket Header
        proxy_http_version 1.1;
        proxy_set_header Upgrade websocket;
        proxy_set_header Connection "Upgrade";

        # Forward the client's Host and IP information to the corresponding node
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        # The connection between the client and the server is automatically disconnected after 60s of no interaction, please set according to the actual business scenario
        proxy_read_timeout 60s ;

        # Execute proxy access to real server
        proxy_pass http://hyperf_websocket;
    }
}
```