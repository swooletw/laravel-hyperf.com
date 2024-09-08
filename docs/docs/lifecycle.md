# Lifecycle
[[toc]]

## Introduction

When using any tool in the "real world", you feel more confident if you understand how that tool works. Application development is no different. When you understand how your development tools function, you feel more comfortable and confident using them.

The goal of this document is to give you a good, high-level overview of how Laravel Hyperf works. By getting to know the overall framework better, everything feels less "magical" and you will be more confident building your applications. If you don't understand all of the terms right away, don't lose heart! Just try to get a basic grasp of what is going on, and your knowledge will grow as you explore other sections of the documentation.

## Lifecycle Overview

### First Steps

The entry point for all requests to a Laravel Hyperf application is the `bin/hyperf.php` file. The `hyperf.php` file doesn't contain much code. Rather, it is a starting point for loading the rest of the framework.

The `hyperf.php` file loads the Composer generated autoloader definition and environment variables, and then retrieves an instance of the Laravel Hyperf application from `bootstrap/app.php`. The first action taken by Laravel Hyperf itself is to create an instance of the application / [service container](/docs/container.html).

::: note
`BASE_PATH` constant is defined in `bin/hyperf.php`. Although we suggest fetching base path from service container, components in Hyperf framework have strong coupling to `BASE_PATH` constant. Therefore you can still find `BASE_PATH` in Laravel Hyperf for backward compatibility.
:::

### Container Bindings

Same as in Laravel, the application itself is a service container. When the application created, dependencies scanner collected container bindings from `config/dependencies.php`. This is how dependencies are registered in Hyperf by default. Laravel Hyperf also supports registering dependencies in service providers.

### Console Kernel

Next, the console kernel defines an array of `bootstrappers` that will be run before executing the command. These bootstrappers load facade aliases, register service providers, load commands and setup cronjob scheduling. Typically, these classes handle internal Laravel Hyperf configuration that you do not need to worry about.

### Config Providers / Service Providers

In Hyperf, there's a concept similar to Laravel's Service Providers called Config Providers. Config providers will provide all the configuration information of the corresponding components, which will be started by the Hyperf framework When loaded. Essentially every major feature offered by Hyperf is bootstrapped and configured by config providers.

Laravel Hyperf also integrates [service providers](/docs/providers.html) in a manner similar to Laravel. Service providers are responsible for bootstrapping the framework's various components and are a fundamental part of the Laravel Hyperf application lifecycle.

Laravel Hyperf will iterate through this list of providers and instantiate each of them. After instantiating the providers, the `register` method will be called on all of the providers. Then, once all of the providers have been registered, the `boot` method will be called on each provider. This is so service providers may depend on every container binding being registered and available by the time their `boot` method is executed.

While the framework internally uses dozens of config providers / service providers, you also have the option to create your own. If you're going to create a third-party package, we recommend using `Config Provider` or providing both `Config Provider` and `Service Provider` to ensure compatibility of Hyperf framework.

### Routing

Once the application has been bootstrapped and all service providers have been registered, an HTTP server will be launched and wait for incoming requests.

The `Request` will be handed off to the router for dispatching. The router will dispatch the request to a route or controller, as well as run any route specific middleware.

Middleware provide a convenient mechanism for filtering or examining HTTP requests entering your application. For example, Laravel Hyperf includes a middleware that performs form request validation if a FormRequest class is injected into your controller method. You can set up your middleware in a Laravel style by configuring `app/Http/Kernel.php`. To learn more about middleware, you can refer to the complete [middleware documentation](/docs/middleware.html).

If the request successfully passes through all of the matched route's assigned middleware, the route or controller method will be executed. The response returned by the route or controller method will then be sent back through the route's chain of middleware. This allows middleware to perform actions both before and after your core application logic executes.

Middleware in Laravel Hyperf can filter requests, modify responses, and even terminate the request cycle entirely if necessary. By configuring middleware in `app/Http/Kernel.php`, you can define global middleware, assign middleware to specific routes, or create middleware groups for convenient assignment.

For more detailed information on creating, registering, and using middleware in Laravel Hyperf, including examples and best practices, please refer to the [middleware documentation](/docs/middleware.html).

## Focus on Config Providers / Service Providers

Config Providers / Service providers are truly the key to bootstrapping a Laravel Hyperf application. The application instance is created, the service providers are registered, and the request is handed to the bootstrapped application. It's really that simple!

Having a firm grasp of how a Laravel Hyperf application is built and bootstrapped via service providers is very valuable. Your application's user-defined service providers are stored in the `app/Providers` directory.

By default, the `AppServiceProvider` is fairly empty. This provider is a great place to add your application's own bootstrapping and service container bindings. For large applications, you may wish to create several service providers, each with more granular bootstrapping for specific services used by your application.
