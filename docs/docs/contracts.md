# Contracts
[[toc]]

## Introduction

Laravel Hyperf's "contracts" are a set of interfaces that define the core services provided by the framework. For example, an `SwooleTW\Hyperf\Auth\Contracts\Gate` contract defines the methods needed for authorizing a resource, while the `SwooleTW\Hyperf\Hashing\Contracts\Hasher` contract defines the methods needed for generating a secure hash.

All of the contracts live separately in the `Contracts` directory in their belonging packages. This provides a quick reference point for all available contracts, as well as a single, decoupled package that may be utilized when building packages that interact with Laravel Hyperf services.

### Contracts vs. Facades

Laravel Hyperf's [facades](/docs/facades) and helper functions provide a simple way of utilizing Laravel Hyperf's services without needing to type-hint and resolve contracts out of the service container. In most cases, each facade has an equivalent contract.

Unlike facades, which do not require you to require them in your class' constructor, contracts allow you to define explicit dependencies for your classes. Some developers prefer to explicitly define their dependencies in this way and therefore prefer to use contracts, while other developers enjoy the convenience of facades. **In general, most applications can use facades without issue during development.**

## When to Use Contracts

The decision to use contracts or facades will come down to personal taste and the tastes of your development team. Both contracts and facades can be used to create robust, well-tested Laravel Hyperf applications. Contracts and facades are not mutually exclusive. Some parts of your applications may use facades while others depend on contracts. As long as you are keeping your class' responsibilities focused, you will notice very few practical differences between using contracts and facades.

In general, most applications can use facades without issue during development. If you are building a package that integrates with multiple PHP frameworks you may wish to use the corresponding contracts to define your integration with Laravel Hyperf's services without the need to require Laravel Hyperf's concrete implementations in your package's `composer.json` file.

## How to Use Contracts

So, how do you get an implementation of a contract? It's actually quite simple.

Many types of classes in Laravel Hyperf are resolved through the [service container](/docs/container), including controllers, event listeners, middleware and even route closures. So, to get an implementation of a contract, you can just "type-hint" the interface in the constructor of the class being resolved.

For example, take a look at this event listener:

```php
<?php

namespace App\Listeners;

use App\Events\OrderWasPlaced;
use App\Models\User;
use SwooleTW\Hyperf\Cache\Contracts\Factory;

class CacheOrderInformation
{
    /**
     * Create a new event handler instance.
     */
    public function __construct(
        protected Factory $cache,
    ) {}

    /**
     * Handle the event.
     */
    public function handle(OrderWasPlaced $event): void
    {
        // ...
    }
}
```

When the event listener is resolved, the service container will read the type-hints on the constructor of the class, and inject the appropriate value. To learn more about registering things in the service container, check out [its documentation](/docs/container).

<a name="contract-reference"></a>
## Contract Reference

This table provides a quick reference to all of the Laravel Hyperf contracts and their equivalent facades:

| Contract                                                                                                                                               | References Facade         |
|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| [SwooleTW\Hyperf\Auth\Contracts\Authorizable](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/Authorizable.php)                 |  &nbsp;                   |
| [SwooleTW\Hyperf\Auth\Contracts\Gate](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/Gate.php)                                 | `Gate`                    |
| [SwooleTW\Hyperf\Auth\Contracts\Authenticatable](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/Authenticatable.php)                         |  &nbsp;                   |
| [SwooleTW\Hyperf\Auth\Contracts\FactoryContract](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/FactoryContract.php)                                         | `Auth`                    |
| [SwooleTW\Hyperf\Auth\Contracts\Guard](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/Guard.php)                                             | &nbsp;           |
| [SwooleTW\Hyperf\Auth\Contracts\StatefulGuard](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/StatefulGuard.php)                             | &nbsp;                    |
| [SwooleTW\Hyperf\Auth\Contracts\SupportsBasicAuth](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/SupportsBasicAuth.php)                     | &nbsp;                    |
| [SwooleTW\Hyperf\Auth\Contracts\UserProvider](https://github.com/swooletw/hyperf-packages/blob/master/src/auth/src/Contracts/UserProvider.php)                               | &nbsp;                    |
| [SwooleTW\Hyperf\Cache\Contracts\Factory](https://github.com/swooletw/hyperf-packages/blob/master/src/cache/src/Contracts/Factory.php)                                       | `Cache`                   |
| [SwooleTW\Hyperf\Cache\Contracts\Lock](https://github.com/swooletw/hyperf-packages/blob/master/src/cache/src/Contracts/Lock.php)                                             | &nbsp;                    |
| [SwooleTW\Hyperf\Cache\Contracts\LockProvider](https://github.com/swooletw/hyperf-packages/blob/master/src/cache/src/Contracts/LockProvider.php)                             | &nbsp;                    |
| [SwooleTW\Hyperf\Cache\Contracts\Repository](https://github.com/swooletw/hyperf-packages/blob/master/src/cache/src/Contracts/Repository.php)                                 | `Cache::driver()`         |
| [SwooleTW\Hyperf\Cache\Contracts\Store](https://github.com/swooletw/hyperf-packages/blob/master/src/cache/src/Contracts/Store.php)                                           | &nbsp;                    |
| [SwooleTW\Hyperf\Config\Contracts\Repository](https://github.com/swooletw/hyperf-packages/blob/master/src/config/src/Contracts/Repository.php)                               | `Config`                  |
| [SwooleTW\Hyperf\Foundation\Contracts\Application](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Contracts/Application.php)                           | `App`                    |
| [SwooleTW\Hyperf\Foundation\Console\Contracts\Application](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Console/Contracts/Application.php)                           | &nbsp;                    |
| [SwooleTW\Hyperf\Foundation\Console\Contracts\Kernel](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Console/Contracts/Kernel.php)                           | `Artisan`                    |
| [SwooleTW\Hyperf\Foundation\Console\Contracts\Schedule](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Console/Contracts/Schedule.php)                           | `Schedule`                    |
| [SwooleTW\Hyperf\Foundation\Exceptions\Contracts\ExceptionHandler](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Exceptions/Contracts/ExceptionHandler.php)                           | &nbsp;                    |
| [SwooleTW\Hyperf\Foundation\Exceptions\Contracts\ExceptionRenderer](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Exceptions/Contracts/ExceptionRenderer.php)                           | &nbsp;                    |
| [SwooleTW\Hyperf\Foundation\Http\Contracts\ExceptionRenderer](https://github.com/swooletw/hyperf-packages/blob/master/src/foundation/src/Http/Contracts/MiddlewareContract.php)                           | &nbsp;                    |
| [SwooleTW\Hyperf\Container\Contracts\Container](https://github.com/swooletw/hyperf-packages/blob/master/src/container/src/Contracts/Container.php)                           | `App`                     |
| [SwooleTW\Hyperf\Cookie\Contracts\Cookie](https://github.com/swooletw/hyperf-packages/blob/master/src/cookie/src/Contracts/Cookie.php)                                     | `Cookie`                  |
| [SwooleTW\Hyperf\Encryption\Contracts\Encrypter](https://github.com/swooletw/hyperf-packages/blob/master/src/encryption/src/Contracts/Encrypter.php)                         | `Crypt`                   |
| [SwooleTW\Hyperf\Hashing\Contracts\Hasher](https://github.com/swooletw/hyperf-packages/blob/master/src/hashing/src/Contracts/Hasher.php)                                     | `Hash`                    |
| [SwooleTW\Hyperf\Http\Contracts\RequestContract](https://github.com/swooletw/hyperf-packages/blob/master/src/http/src/Contracts/RequestContract.php)                                           | `Request`                    |
| [SwooleTW\Hyperf\Http\Contracts\ResponseContract](https://github.com/swooletw/hyperf-packages/blob/master/src/http/src/Contracts/ResponseContract.php)                                           | `Response`                    |
| [SwooleTW\Hyperf\Router\Contracts\UrlGenerator](https://github.com/swooletw/hyperf-packages/blob/master/src/router/src/Contracts/UrlGenerator.php)                         | `URL`                     |
| [SwooleTW\Hyperf\Router\Contracts\UrlGenerator](https://github.com/swooletw/hyperf-packages/blob/master/src/router/src/Contracts/UrlGenerator.php)                         | `URL`                     |

::: info
The contracts in Hyperf can refer to [hyperf/contract](https://github.com/hyperf/hyperf/tree/master/src/contract/src) package
:::