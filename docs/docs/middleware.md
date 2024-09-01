## Introduction

Middleware provide a convenient mechanism for inspecting and filtering HTTP requests entering your application. For example, Laravel Hyperf includes a middleware that verifies the user of your application is authenticated. If the user is not authenticated, the middleware will throw `SwooleTW\Hyperf\Auth\AuthenticationException`. However, if the user is authenticated, the middleware will allow the request to proceed further into the application.

Additional middleware can be written to perform a variety of tasks besides authentication. For example, a logging middleware might log all incoming requests to your application. You can place you middleware in the `app/Http/Middleware` directory.

## Middleware Support

Hyperf supports [PSR-15](https://www.php-fig.org/psr/psr-15/) based middleware by default. This standard provides a common interface for HTTP server-side middleware, ensuring interoperability between different frameworks and libraries.

However, middleware in Laravel doesn't follow this standard. Laravel uses its own middleware implementation, which has a different structure and method signatures compared to PSR-15 middleware.

To ensure backward compatibility and support Laravel-style middleware, Laravel Hyperf allows you to use both types of middleware together. This means you can:

1. Use PSR-15 compliant middleware for maximum interoperability with other PHP libraries and frameworks.
2. Continue using Laravel-style middleware if you're migrating an existing Laravel application or prefer the Laravel middleware syntax.

This flexibility allows developers to choose the middleware style that best suits their needs or gradually migrate from Laravel-style to PSR-15 middleware as needed. When defining middleware in your application, you can mix and match these two types without conflict. Laravel Hyperf will handle the appropriate execution of each middleware type internally.

::: tip
For compatibility with middleware in Hyperf, the `request` you get in the middleware is a `Psr\Http\Message\ServerRequestInterface` object, which only implements basic PSR-7 methods. If you want to use `SwooleTW\Hyperf\Http\Request` within the middleware, you can get it by fetching `SwooleTW\Hyperf\Http\Request` from the container, using `SwooleTW\Hyperf\Support\Facades\Request` facade or calling `request()` global helper function.

`SwooleTW\Hyperf\Http\Request` implements `Psr\Http\Message\ServerRequestInterface` and provides many other useful functions like in Laravel. For more details, you can see: [requests](/docs/requests.html).
:::

## Defining a Hyperf Middleware

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Hyperf\Context\Context;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class CorsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = Context::get(ResponseInterface::class);
        $response = $response->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            // Headers can be rewritten according to actual conditions.
            ->withHeader('Access-Control-Allow-Headers', 'DNT,Keep-Alive,User-Agent,Cache-Control,Content-Type,Authorization');

        Context::set(ResponseInterface::class, $response);

        if ($request->getMethod() == 'OPTIONS') {
            return $response;
        }

        return $handler->handle($request);
    }
}
```

`Request` and `Response` objects in Hyperf follow the [PSR-7](https://www.php-fig.org/psr/psr-7/) standard and are therefore `immutable`. This immutability has important implications for how you work with these objects:

When you call methods like `$response->with***()`, you're not modifying the original `$response` object. Instead, you're creating a new object through cloning. For example:

```php
$response = $response->withHeader('X-Header', 'Value');
```

In this case, `$response` is now a new object, not a modification of the original one. However, Hyperf provides a way to override these objects using context. This allows you to maintain the PSR-7 compliance while still providing a way to modify the request and response objects when necessary.

```php
use Hyperf\Context\Context;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

// $request and $response are the modified objects
$request = Context::set(ServerRequestInterface::class, $request);
$response = Context::set(ResponseInterface::class, $response);
```

::: tip
When working with middleware or other parts of your application where you need to modify the request or response, make sure to return the new object rather than expecting the original to be modified in place.
:::

## Defining Laravel Middleware

You can also define a Laravel-style middleware like this:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use SwooleTW\Hyperf\Auth\AuthenticationException;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Psr\Http\Message\ServerRequestInterface): (\Psr\Http\Message\ResponseInterface)  $next
     */
    public function handle(Request $request, Closure $next): ResponseInterface
    {
        if ($request->input('token') !== 'my-secret-token') {
            throw new AuthenticationException;
        }

        return $next($request);
    }
}
```

As you can see, if the given `token` does not match our secret token, the middleware will throw `AuthenticationException`; otherwise, the request will be passed further into the application. To pass the request deeper into the application (allowing the middleware to "pass"), you should call the `$next` callback with the `$request`.

It's best to envision middleware as a series of "layers" HTTP requests must pass through before they hit your application. Each layer can examine the request and even reject it entirely.

::: note
All middleware are resolved via the [service container](/docs/container.html), so you may type-hint any dependencies you need within a middleware's constructor.
:::

::: important
`Request` in Laravel-style middleware also follow PSR-7 and it's `immutable` as well.
:::

#### Middleware and Responses

Of course, a middleware can perform tasks before or after passing the request deeper into the application. For example, the following middleware would perform some task **before** the request is handled by the application:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): ResponseInterface
    {
        // Perform action

        return $next($request);
    }
}
```

However, this middleware would perform its task **after** the request is handled by the application:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class AfterMiddleware
{
    public function handle(Request $request, Closure $next): ResponseInterface
    {
        $response = $next($request);

        // Perform action

        return $response;
    }
}
```

## Registering Middleware

### Global Middleware

If you want a middleware to run during every HTTP request to your application, list the middleware class in the `$middleware` property of your `app/Http/Kernel.php` class.

### Assigning Middleware to Routes

If you would like to assign middleware to specific routes, you may invoke the `middleware` method when defining the route:

```php
use App\Http\Middleware\Authenticate;

Route::get('/profile', function () {
    // ...
}, ['middleware' => Authenticate::class]);
```

You may assign multiple middleware to the route by passing an array of middleware names to the `middleware` method:

```php
Route::get('/', function () {
    // ...
}, ['middleware' => [First::class, Second::class]);
```

For convenience, you may assign aliases to middleware in your application's `app/Http/Kernel.php` file. By default, the `$middlewareAliases` property of this class contains entries for the middleware included with Laravel Hyperf. You may add your own middleware to this list and assign it an alias of your choosing:

```php
// Within App\Http\Kernel class...

protected array $middlewareAliases = [
    'throttle' => \SwooleTW\Hyperf\Router\Middleware\ThrottleRequests::class,
    'bindings' => \SwooleTW\Hyperf\Router\Middleware\SubstituteBindings::class,
];
```

Once the middleware alias has been defined in the HTTP kernel, you may use the alias when assigning middleware to routes:

```php
Route::get('/profile', function () {
    // ...
}, ['middleware' => 'auth']);
```

### Middleware Groups

Sometimes you may want to group several middleware under a single key to make them easier to assign to routes. You may accomplish this using the `$middlewareGroups` property of your HTTP kernel.

Laravel Hyperf includes predefined `web` and `api` middleware groups that contain common middleware you may want to apply to your web and API routes. Remember, these middleware groups are automatically applied by your application's `App\Providers\RouteServiceProvider` service provider to routes within your corresponding `web` and `api` route files:

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected array $middlewareGroups = [
    'web' => [
        // \SwooleTW\Hyperf\Router\Middleware\SubstituteBindings::class,
        // \SwooleTW\Hyperf\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    ],

    'api' => [
        // 'throttle:60,1,api',
        // \SwooleTW\Hyperf\Router\Middleware\SubstituteBindings::class,
    ],
];
```

::: note
Middleware in `middlewareGroups` are disabled in Laravel Hyperf by default. You can enable them according to your needs.
:::

Middleware groups may be assigned to routes and controller actions using the same syntax as individual middleware. Again, middleware groups make it more convenient to assign many middleware to a route at once:

```php
Route::get('/', function () {
    // ...
}, ['middleware' => 'web']);

Route::group('/', function () {
    // ...
}, ['middleware' => 'auth']);
```

::: note
Out of the box, the `web` and `api` middleware groups are automatically applied to your application's corresponding `routes/web.php` and `routes/api.php` files by the `App\Providers\RouteServiceProvider`.
:::

### Sorting Middleware

Rarely, you may need your middleware to execute in a specific order but not have control over their order when they are assigned to the route. In this case, you may specify your middleware priority using the `$middlewarePriority` property of your `app/Http/Kernel.php` file. This property may not exist in your HTTP kernel by default. If it does not exist, you may copy its default definition below:

```php
/**
 * The priority-sorted list of middleware.
 *
 * This forces non-global middleware to always be in the given order.
 *
 * @var string[]
 */
protected array $middlewarePriority = [
    // \SwooleTW\Hyperf\Router\Middleware\ThrottleRequests::class,
    // \SwooleTW\Hyperf\Router\Middleware\SubstituteBindings::class,
];
```

## Middleware Parameters

Middleware can also receive additional parameters. For example, if your application needs to verify that the authenticated user has a given "role" before performing a given action, you could create an `EnsureUserHasRole` middleware that receives a role name as an additional argument.

Additional middleware parameters will be passed to the middleware after the `$next` argument:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Psr\Http\Message\ServerRequestInterface): (\Psr\Http\Message\ResponseInterface)  $next
     */
    public function handle(Request $request, Closure $next, string $role): ResponseInterface
    {
        if (! $request->user()->hasRole($role)) {
            // throw exception...
        }

        return $next($request);
    }
}
```

Middleware parameters may be specified when defining the route by separating the middleware name and parameters with a `:`:

```php
Route::put('/post/{id}', function (string $id) {
    // ...
}, ['middleware' => 'role:editor']);
```
